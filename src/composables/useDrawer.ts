// npm
import { computed, onMounted, onScopeDispose, provide, ref, watch } from 'vue';

// composables
import { isIOS, isMobileFirefox } from '~/browser';
import { usePositionFixed } from '~/composables/usePositionFixed';
import { usePreventScroll, isInput } from '~/composables/usePreventScroll';
import { useSnapPoints } from '~/composables/useSnapPoints';
// core
import {
  BORDER_RADIUS,
  CLOSE_THRESHOLD,
  DRAG_CLASS,
  NESTED_DISPLACEMENT,
  SCROLL_LOCK_TIMEOUT,
  TRANSITIONS,
  TRANSITION_EASE,
  VELOCITY_THRESHOLD,
  WINDOW_TOP_OFFSET,
} from '~/constants';
import { DRAWER_CONTEXT_KEY } from '~/context';
import { dampenValue, getTranslate, isVertical, reset, set } from '~/helpers';
import type { DrawerDirection } from '~/types';

export interface DrawerRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  activeSnapPoint?: number | string | null;
  snapPoints?: Array<number | string>;
  fadeFromIndex?: number;
  closeThreshold?: number;
  scrollLockTimeout?: number;
  dismissible?: boolean;
  handleOnly?: boolean;
  modal?: boolean;
  nested?: boolean;
  direction?: DrawerDirection;
  noBodyStyles?: boolean;
  shouldScaleBackground?: boolean;
  setBackgroundColorOnScale?: boolean;
  fixed?: boolean;
  disablePreventScroll?: boolean;
  repositionInputs?: boolean;
  snapToSequentialPoint?: boolean;
  preventScrollRestoration?: boolean;
  autoFocus?: boolean;
  container?: HTMLElement | null;
}

export interface DrawerEmitFns {
  updateOpen: (open: boolean) => void;
  updateActiveSnapPoint: (snapPoint: number | string | null) => void;
  drag: (event: PointerEvent, percentageDragged: number) => void;
  release: (event: PointerEvent | null, open: boolean) => void;
  close: () => void;
  animationEnd: (open: boolean) => void;
}

/**
 * Core of `Drawer.Root`: ports Vaul's `Root` state machine (drag gesture, snap-point
 * release, nested-drawer transforms, body handling) and provides the drawer context.
 */
export function useDrawer(props: DrawerRootProps, emit: DrawerEmitFns) {
  // ----- prop-derived reactive values -----
  const direction = computed<DrawerDirection>(() => {
    return props.direction ?? 'bottom';
  });

  const dismissible = computed(() => {
    return props.dismissible ?? true;
  });

  const modal = computed(() => {
    return props.modal ?? true;
  });

  const handleOnly = computed(() => {
    return props.handleOnly ?? false;
  });

  const noBodyStyles = computed(() => {
    return props.noBodyStyles ?? false;
  });

  const shouldScaleBackground = computed(() => {
    return props.shouldScaleBackground ?? false;
  });

  const setBackgroundColorOnScale = computed(() => {
    return props.setBackgroundColorOnScale ?? true;
  });

  const autoFocus = computed(() => {
    return props.autoFocus ?? false;
  });

  const closeThreshold = computed(() => {
    return props.closeThreshold ?? CLOSE_THRESHOLD;
  });

  const scrollLockTimeout = computed(() => {
    return props.scrollLockTimeout ?? SCROLL_LOCK_TIMEOUT;
  });

  const snapPoints = computed(() => {
    return props.snapPoints;
  });

  const container = computed(() => {
    return props.container;
  });

  const snapToSequentialPoint = computed(() => {
    return props.snapToSequentialPoint ?? false;
  });

  const repositionInputs = computed(() => {
    return props.repositionInputs ?? true;
  });

  const disablePreventScroll = computed(() => {
    return props.disablePreventScroll ?? true;
  });

  const preventScrollRestoration = computed(() => {
    return props.preventScrollRestoration ?? false;
  });

  const nested = computed(() => {
    return props.nested ?? false;
  });

  const fixed = computed(() => {
    return props.fixed;
  });

  const fadeFromIndex = computed(() => {
    return props.fadeFromIndex ?? (props.snapPoints ? props.snapPoints.length - 1 : undefined);
  });

  // ----- state -----
  const hasBeenOpened = ref(false);
  const isDragging = ref(false);
  const justReleased = ref(false);
  const overlayRef = ref<HTMLElement | null>(null);
  const drawerRef = ref<HTMLElement | null>(null);
  const triggerRef = ref<HTMLElement | null>(null);
  const titleId = ref<string | undefined>(undefined);
  const descriptionId = ref<string | undefined>(undefined);

  const openTime = ref<Date | null>(null);
  const dragStartTime = ref<Date | null>(null);
  const dragEndTime = ref<Date | null>(null);
  const lastTimeDragPrevented = ref<Date | null>(null);
  const isAllowedToDrag = ref(false);
  const nestedOpenChangeTimer = ref<ReturnType<typeof setTimeout> | null>(null);
  const pointerStart = ref(0);
  const keyboardIsOpen = ref(false);
  const shouldAnimate = ref(!(props.defaultOpen ?? false));
  const previousDiffFromInitial = ref(0);
  const drawerHeightRef = ref(0);
  const drawerWidthRef = ref(0);
  const initialDrawerHeight = ref(0);

  let restorePositionSetting: () => void = () => {};

  // ----- controllable open state -----
  const isOpen = ref(props.open ?? props.defaultOpen ?? false);

  function setIsOpen(value: boolean) {
    const isControlled = props.open !== undefined;

    if (!isControlled) {
      isOpen.value = value;
    }

    onOpenChangeEffect(value);
    emit.updateOpen(value);
  }

  function onOpenChangeEffect(open: boolean) {
    if (!open && !nested.value) {
      restorePositionSetting();
    }

    setTimeout(() => {
      emit.animationEnd(open);
    }, TRANSITIONS.DURATION * 1000);

    if (open && !modal.value) {
      if (typeof window !== 'undefined') {
        window.requestAnimationFrame(() => {
          document.body.style.pointerEvents = 'auto';
        });
      }
    }

    if (!open) {
      document.body.style.pointerEvents = 'auto';
    }
  }

  // Keep internal open in sync when controlled.
  watch(
    () => props.open,
    (value) => {
      if (value === undefined) {
        return;
      }

      if (value) {
        hasBeenOpened.value = true;
      }

      isOpen.value = value;
    },
  );

  // ----- snap points -----
  function onSnapPointChange(activeSnapPointIndex: number) {
    // Change openTime when we reach the last snap point to prevent dragging for 500ms in case it's scrollable.
    if (snapPoints.value && activeSnapPointIndex === snapPointsOffset.value.length - 1) {
      openTime.value = new Date();
    }
  }

  function setActiveSnapPoint(snapPoint: number | string | null) {
    activeSnapPoint.value = snapPoint;
  }

  const {
    activeSnapPoint,
    activeSnapPointIndex,
    onRelease: onReleaseSnapPoints,
    snapPointsOffset,
    onDrag: onDragSnapPoints,
    shouldFade,
    getPercentageDragged: getSnapPointsPercentageDragged,
  } = useSnapPoints({
    snapPoints,
    activeSnapPointProp: () => props.activeSnapPoint,
    setActiveSnapPointProp: (value) => emit.updateActiveSnapPoint(value),
    drawerRef,
    fadeFromIndex,
    overlayRef,
    onSnapPointChange,
    direction,
    container,
    snapToSequentialPoint,
  });

  usePreventScroll(
    computed(
      () =>
        !isOpen.value ||
        isDragging.value ||
        !modal.value ||
        justReleased.value ||
        !hasBeenOpened.value ||
        !repositionInputs.value ||
        !disablePreventScroll.value,
    ),
  );

  const positionFixed = usePositionFixed({
    isOpen,
    modal,
    nested,
    hasBeenOpened,
    preventScrollRestoration,
    noBodyStyles,
  });
  restorePositionSetting = positionFixed.restorePositionSetting;

  function getScale() {
    return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth;
  }

  function onPress(event: PointerEvent) {
    if (!dismissible.value && !snapPoints.value) {
      return;
    }

    if (
      drawerRef.value &&
      event.target instanceof Node &&
      !drawerRef.value.contains(event.target)
    ) {
      return;
    }

    drawerHeightRef.value = drawerRef.value?.getBoundingClientRect().height || 0;
    drawerWidthRef.value = drawerRef.value?.getBoundingClientRect().width || 0;
    isDragging.value = true;
    dragStartTime.value = new Date();

    // iOS doesn't trigger mouseUp after scrolling so we need to listen to touched in order to disallow dragging
    if (isIOS()) {
      window.addEventListener('touchend', () => (isAllowedToDrag.value = false), { once: true });
    }

    // Ensure we maintain correct pointer capture even when going outside of the drawer
    // Vue/DOM: setPointerCapture requires HTMLElement; event.target is EventTarget
    if (event.target instanceof HTMLElement) {
      event.target.setPointerCapture(event.pointerId);
    }

    pointerStart.value = isVertical(direction.value) ? event.pageY : event.pageX;
  }

  function shouldDrag(eventTarget: EventTarget, isDraggingInDirection: boolean) {
    if (!(eventTarget instanceof HTMLElement)) {
      return false;
    }

    let element = eventTarget;
    const highlightedText = window.getSelection()?.toString();
    const swipeAmount = drawerRef.value ? getTranslate(drawerRef.value, direction.value) : null;
    const date = new Date();

    if (element.tagName === 'SELECT') {
      return false;
    }

    if (element.hasAttribute('data-vaul-no-drag') || element.closest('[data-vaul-no-drag]')) {
      return false;
    }

    if (direction.value === 'right' || direction.value === 'left') {
      return true;
    }

    // Allow scrolling when animating
    if (openTime.value && date.getTime() - openTime.value.getTime() < 500) {
      return false;
    }

    if (swipeAmount !== null) {
      if (direction.value === 'bottom') {
        if (swipeAmount > 0) {
          return true;
        }
      } else {
        if (swipeAmount < 0) {
          return true;
        }
      }
    }

    // Don't drag if there's highlighted text
    if (highlightedText && highlightedText.length > 0) {
      return false;
    }

    // Disallow dragging if drawer was scrolled within `scrollLockTimeout`
    if (
      lastTimeDragPrevented.value &&
      date.getTime() - lastTimeDragPrevented.value.getTime() < scrollLockTimeout.value &&
      swipeAmount === 0
    ) {
      lastTimeDragPrevented.value = date;

      return false;
    }

    if (isDraggingInDirection) {
      lastTimeDragPrevented.value = date;
      // We are dragging down so we should allow scrolling

      return false;
    }

    // Keep climbing up the DOM tree as long as there's a parent
    while (element) {
      // Check if the element is scrollable
      if (element.scrollHeight > element.clientHeight) {
        if (element.scrollTop !== 0) {
          lastTimeDragPrevented.value = new Date();
          // The element is scrollable and not scrolled to the top, so don't drag

          return false;
        }

        if (element.getAttribute('role') === 'dialog') {
          return true;
        }
      }

      element = element.parentNode as HTMLElement;
    }

    return true;
  }

  function onDrag(event: PointerEvent) {
    if (!drawerRef.value) {
      return;
    }

    if (isDragging.value) {
      let directionMultiplier: number;

      if (direction.value === 'bottom' || direction.value === 'right') {
        directionMultiplier = 1;
      } else {
        directionMultiplier = -1;
      }

      const draggedDistance =
        (pointerStart.value - (isVertical(direction.value) ? event.pageY : event.pageX)) *
        directionMultiplier;
      const isDraggingInDirection = draggedDistance > 0;

      // Pre condition for disallowing dragging in the close direction.
      const noCloseSnapPointsPreCondition =
        snapPoints.value && !dismissible.value && !isDraggingInDirection;

      // Disallow dragging down to close when first snap point is the active one and dismissible prop is set to false.
      if (noCloseSnapPointsPreCondition && activeSnapPointIndex.value === 0) {
        return;
      }

      const absDraggedDistance = Math.abs(draggedDistance);
      const wrapper = document.querySelector('[data-vaul-drawer-wrapper]');
      const drawerDimension =
        direction.value === 'bottom' || direction.value === 'top'
          ? drawerHeightRef.value
          : drawerWidthRef.value;

      // Calculate the percentage dragged, where 1 is the closed position
      let percentageDragged = absDraggedDistance / drawerDimension;
      const snapPointPercentageDragged = getSnapPointsPercentageDragged(
        absDraggedDistance,
        isDraggingInDirection,
      );

      if (snapPointPercentageDragged !== null) {
        percentageDragged = snapPointPercentageDragged;
      }

      // Disallow close dragging beyond the smallest snap point.
      if (noCloseSnapPointsPreCondition && percentageDragged >= 1) {
        return;
      }

      if (
        !isAllowedToDrag.value &&
        !shouldDrag(event.target as EventTarget, isDraggingInDirection)
      ) {
        return;
      }

      drawerRef.value.classList.add(DRAG_CLASS);
      isAllowedToDrag.value = true;
      set(drawerRef.value, { transition: 'none' });
      set(overlayRef.value, { transition: 'none' });

      if (snapPoints.value) {
        onDragSnapPoints({ draggedDistance });
      }

      // Run this only if snapPoints are not defined or if we are at the last snap point (highest one)
      if (isDraggingInDirection && !snapPoints.value) {
        const dampenedDraggedDistance = dampenValue(draggedDistance);
        const translateValue = Math.min(dampenedDraggedDistance * -1, 0) * directionMultiplier;

        let transform: string;

        if (isVertical(direction.value)) {
          transform = `translate3d(0, ${translateValue}px, 0)`;
        } else {
          transform = `translate3d(${translateValue}px, 0, 0)`;
        }

        set(drawerRef.value, { transform });

        return;
      }

      const opacityValue = 1 - percentageDragged;

      if (
        shouldFade.value ||
        (fadeFromIndex.value && activeSnapPointIndex.value === fadeFromIndex.value - 1)
      ) {
        emit.drag(event, percentageDragged);

        set(overlayRef.value, { opacity: `${opacityValue}`, transition: 'none' }, true);
      }

      if (wrapper && overlayRef.value && shouldScaleBackground.value) {
        const scaleValue = Math.min(getScale() + percentageDragged * (1 - getScale()), 1);
        const borderRadiusValue = 8 - percentageDragged * 8;
        const translateValue = Math.max(0, 14 - percentageDragged * 14);

        let wrapperTransform: string;

        if (isVertical(direction.value)) {
          wrapperTransform = `scale(${scaleValue}) translate3d(0, ${translateValue}px, 0)`;
        } else {
          wrapperTransform = `scale(${scaleValue}) translate3d(${translateValue}px, 0, 0)`;
        }

        set(
          wrapper,
          {
            borderRadius: `${borderRadiusValue}px`,
            transform: wrapperTransform,
            transition: 'none',
          },
          true,
        );
      }

      if (!snapPoints.value) {
        const translateValue = absDraggedDistance * directionMultiplier;

        let transform: string;

        if (isVertical(direction.value)) {
          transform = `translate3d(0, ${translateValue}px, 0)`;
        } else {
          transform = `translate3d(${translateValue}px, 0, 0)`;
        }

        set(drawerRef.value, { transform });
      }
    }
  }

  function resetDrawer() {
    if (!drawerRef.value) {
      return;
    }

    const wrapper = document.querySelector('[data-vaul-drawer-wrapper]');
    const currentSwipeAmount = getTranslate(drawerRef.value, direction.value);

    set(drawerRef.value, {
      transform: 'translate3d(0, 0, 0)',
      transition: `transform ${TRANSITIONS.DURATION}s ${TRANSITION_EASE}`,
    });

    set(overlayRef.value, {
      transition: `opacity ${TRANSITIONS.DURATION}s ${TRANSITION_EASE}`,
      opacity: '1',
    });

    // Don't reset background if swiped upwards
    if (
      shouldScaleBackground.value &&
      currentSwipeAmount &&
      currentSwipeAmount > 0 &&
      isOpen.value
    ) {
      let wrapperTransform: string;
      let wrapperTransformOrigin: string;

      if (isVertical(direction.value)) {
        wrapperTransform = `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`;
        wrapperTransformOrigin = 'top';
      } else {
        wrapperTransform = `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`;
        wrapperTransformOrigin = 'left';
      }

      set(
        wrapper,
        {
          borderRadius: `${BORDER_RADIUS}px`,
          overflow: 'hidden',
          transform: wrapperTransform,
          transformOrigin: wrapperTransformOrigin,
          transitionProperty: 'transform, border-radius',
          transitionDuration: `${TRANSITIONS.DURATION}s`,
          transitionTimingFunction: TRANSITION_EASE,
        },
        true,
      );
    }
  }

  function cancelDrag() {
    if (!isDragging.value || !drawerRef.value) {
      return;
    }

    drawerRef.value.classList.remove(DRAG_CLASS);
    isAllowedToDrag.value = false;
    isDragging.value = false;
    dragEndTime.value = new Date();
  }

  function closeDrawer(fromWithin?: boolean) {
    cancelDrag();
    emit.close();

    if (!fromWithin) {
      setIsOpen(false);
    }

    setTimeout(() => {
      if (snapPoints.value) {
        activeSnapPoint.value = snapPoints.value[0];
      }
    }, TRANSITIONS.DURATION * 1000);
  }

  function onRelease(event: PointerEvent | null) {
    if (!isDragging.value || !drawerRef.value) {
      return;
    }

    drawerRef.value.classList.remove(DRAG_CLASS);
    isAllowedToDrag.value = false;
    isDragging.value = false;
    dragEndTime.value = new Date();
    const swipeAmount = getTranslate(drawerRef.value, direction.value);

    if (
      !event ||
      !shouldDrag(event.target as EventTarget, false) ||
      !swipeAmount ||
      Number.isNaN(swipeAmount)
    ) {
      return;
    }

    if (dragStartTime.value === null) {
      return;
    }

    const timeTaken = dragEndTime.value.getTime() - dragStartTime.value.getTime();
    const distMoved =
      pointerStart.value - (isVertical(direction.value) ? event.pageY : event.pageX);
    const velocity = Math.abs(distMoved) / timeTaken;

    if (velocity > 0.05) {
      justReleased.value = true;

      setTimeout(() => {
        justReleased.value = false;
      }, 200);
    }

    if (snapPoints.value) {
      let directionMultiplier: number;

      if (direction.value === 'bottom' || direction.value === 'right') {
        directionMultiplier = 1;
      } else {
        directionMultiplier = -1;
      }

      onReleaseSnapPoints({
        draggedDistance: distMoved * directionMultiplier,
        closeDrawer,
        velocity,
        dismissible: dismissible.value,
      });
      emit.release(event, true);

      return;
    }

    // Moved upwards, don't do anything
    let movedInCloseDirection: boolean;

    if (direction.value === 'bottom' || direction.value === 'right') {
      movedInCloseDirection = distMoved > 0;
    } else {
      movedInCloseDirection = distMoved < 0;
    }

    if (movedInCloseDirection) {
      resetDrawer();
      emit.release(event, true);

      return;
    }

    if (velocity > VELOCITY_THRESHOLD) {
      closeDrawer();
      emit.release(event, false);

      return;
    }

    const visibleDrawerHeight = Math.min(
      drawerRef.value.getBoundingClientRect().height ?? 0,
      window.innerHeight,
    );
    const visibleDrawerWidth = Math.min(
      drawerRef.value.getBoundingClientRect().width ?? 0,
      window.innerWidth,
    );

    const isHorizontalSwipe = direction.value === 'left' || direction.value === 'right';

    if (
      Math.abs(swipeAmount) >=
      (isHorizontalSwipe ? visibleDrawerWidth : visibleDrawerHeight) * closeThreshold.value
    ) {
      closeDrawer();
      emit.release(event, false);

      return;
    }

    emit.release(event, true);
    resetDrawer();
  }

  // ----- nested drawer handlers -----
  function onNestedOpenChange(open: boolean) {
    let scale: number;

    if (open) {
      scale = (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth;
    } else {
      scale = 1;
    }

    let initialTranslate: number;

    if (open) {
      initialTranslate = -NESTED_DISPLACEMENT;
    } else {
      initialTranslate = 0;
    }

    if (nestedOpenChangeTimer.value) {
      window.clearTimeout(nestedOpenChangeTimer.value);
    }

    let nestedTransform: string;

    if (isVertical(direction.value)) {
      nestedTransform = `scale(${scale}) translate3d(0, ${initialTranslate}px, 0)`;
    } else {
      nestedTransform = `scale(${scale}) translate3d(${initialTranslate}px, 0, 0)`;
    }

    set(drawerRef.value, {
      transition: `transform ${TRANSITIONS.DURATION}s ${TRANSITION_EASE}`,
      transform: nestedTransform,
    });

    if (!open && drawerRef.value) {
      nestedOpenChangeTimer.value = setTimeout(() => {
        if (!drawerRef.value) {
          return;
        }

        const translateValue = getTranslate(drawerRef.value, direction.value);

        let delayedTransform: string;

        if (isVertical(direction.value)) {
          delayedTransform = `translate3d(0, ${translateValue}px, 0)`;
        } else {
          delayedTransform = `translate3d(${translateValue}px, 0, 0)`;
        }

        set(drawerRef.value, {
          transition: 'none',
          transform: delayedTransform,
        });
      }, 500);
    }
  }

  function onNestedDrag(_event: PointerEvent, percentageDragged: number) {
    if (percentageDragged < 0) {
      return;
    }

    const initialScale = (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth;
    const newScale = initialScale + percentageDragged * (1 - initialScale);
    const newTranslate = -NESTED_DISPLACEMENT + percentageDragged * NESTED_DISPLACEMENT;

    let nestedTransform: string;

    if (isVertical(direction.value)) {
      nestedTransform = `scale(${newScale}) translate3d(0, ${newTranslate}px, 0)`;
    } else {
      nestedTransform = `scale(${newScale}) translate3d(${newTranslate}px, 0, 0)`;
    }

    set(drawerRef.value, {
      transform: nestedTransform,
      transition: 'none',
    });
  }

  function onNestedRelease(_event: PointerEvent, open: boolean) {
    let dim: number;

    if (isVertical(direction.value)) {
      dim = window.innerHeight;
    } else {
      dim = window.innerWidth;
    }

    let scale: number;

    if (open) {
      scale = (dim - NESTED_DISPLACEMENT) / dim;
    } else {
      scale = 1;
    }

    let translate: number;

    if (open) {
      translate = -NESTED_DISPLACEMENT;
    } else {
      translate = 0;
    }

    if (open) {
      let releaseTransform: string;

      if (isVertical(direction.value)) {
        releaseTransform = `scale(${scale}) translate3d(0, ${translate}px, 0)`;
      } else {
        releaseTransform = `scale(${scale}) translate3d(${translate}px, 0, 0)`;
      }

      set(drawerRef.value, {
        transition: `transform ${TRANSITIONS.DURATION}s ${TRANSITION_EASE}`,
        transform: releaseTransform,
      });
    }
  }

  // ----- open/close orchestration (mirrors DialogPrimitive.Root onOpenChange) -----
  function handleOpenChange(open: boolean) {
    if (!dismissible.value && !open) {
      return;
    }

    if (open) {
      hasBeenOpened.value = true;
    } else {
      closeDrawer(true);
    }

    setIsOpen(open);
  }

  function openDrawer() {
    handleOpenChange(true);
  }

  // ----- effects -----
  onMounted(() => {
    window.requestAnimationFrame(() => {
      shouldAnimate.value = true;
    });
  });

  onMounted(() => {
    if (typeof window === 'undefined' || !window.visualViewport) {
      return;
    }

    function onVisualViewportChange() {
      if (!drawerRef.value || !repositionInputs.value) {
        return;
      }

      // Vue/DOM: document.activeElement is Element; cast to HTMLElement for isInput
      const focusedElement = document.activeElement as HTMLElement;

      if (isInput(focusedElement) || keyboardIsOpen.value) {
        const visualViewportHeight = window.visualViewport?.height || 0;
        const totalHeight = window.innerHeight;
        let diffFromInitial = totalHeight - visualViewportHeight;
        const drawerHeight = drawerRef.value.getBoundingClientRect().height || 0;
        const isTallEnough = drawerHeight > totalHeight * 0.8;

        if (!initialDrawerHeight.value) {
          initialDrawerHeight.value = drawerHeight;
        }

        const offsetFromTop = drawerRef.value.getBoundingClientRect().top;

        if (Math.abs(previousDiffFromInitial.value - diffFromInitial) > 60) {
          keyboardIsOpen.value = !keyboardIsOpen.value;
        }

        if (
          snapPoints.value &&
          snapPoints.value.length > 0 &&
          snapPointsOffset.value &&
          activeSnapPointIndex.value
        ) {
          const activeSnapPointHeight = snapPointsOffset.value[activeSnapPointIndex.value] || 0;
          diffFromInitial += activeSnapPointHeight;
        }

        previousDiffFromInitial.value = diffFromInitial;

        if (drawerHeight > visualViewportHeight || keyboardIsOpen.value) {
          const height = drawerRef.value.getBoundingClientRect().height;
          let newDrawerHeight = height;

          if (height > visualViewportHeight) {
            newDrawerHeight =
              visualViewportHeight - (isTallEnough ? offsetFromTop : WINDOW_TOP_OFFSET);
          }

          if (fixed.value) {
            drawerRef.value.style.height = `${height - Math.max(diffFromInitial, 0)}px`;
          } else {
            drawerRef.value.style.height = `${Math.max(newDrawerHeight, visualViewportHeight - offsetFromTop)}px`;
          }
        } else if (!isMobileFirefox()) {
          drawerRef.value.style.height = `${initialDrawerHeight.value}px`;
        }

        if (snapPoints.value && snapPoints.value.length > 0 && !keyboardIsOpen.value) {
          drawerRef.value.style.bottom = `0px`;
        } else {
          drawerRef.value.style.bottom = `${Math.max(diffFromInitial, 0)}px`;
        }
      }
    }

    window.visualViewport.addEventListener('resize', onVisualViewportChange);

    onScopeDispose(() =>
      window.visualViewport?.removeEventListener('resize', onVisualViewportChange),
    );
  });

  watch(
    isOpen,
    (value) => {
      if (value) {
        set(document.documentElement, { scrollBehavior: 'auto' });
        openTime.value = new Date();
      }
    },
    { immediate: true },
  );

  onScopeDispose(() => reset(document.documentElement, 'scrollBehavior'));

  watch(
    modal,
    (value) => {
      if (!value && typeof window !== 'undefined') {
        window.requestAnimationFrame(() => {
          document.body.style.pointerEvents = 'auto';
        });
      }
    },
    { immediate: true },
  );

  // ----- provide context -----
  provide(DRAWER_CONTEXT_KEY, {
    drawerRef,
    overlayRef,
    triggerRef,
    onPress,
    onRelease,
    onDrag,
    onNestedDrag,
    onNestedOpenChange,
    onNestedRelease,
    dismissible,
    isOpen,
    isDragging,
    keyboardIsOpen,
    snapPointsOffset,
    snapPoints,
    activeSnapPointIndex,
    modal,
    shouldFade,
    activeSnapPoint,
    setActiveSnapPoint,
    closeDrawer,
    openDrawer,
    handleOpenChange,
    direction,
    shouldScaleBackground,
    setBackgroundColorOnScale,
    noBodyStyles,
    handleOnly,
    container,
    autoFocus,
    shouldAnimate,
    titleId,
    descriptionId,
    emitDrag: emit.drag,
    emitRelease: emit.release,
  });

  return {
    isOpen,
    modal,
    direction,
    snapPoints,
    activeSnapPoint,
    openDrawer,
    closeDrawer,
    handleOpenChange,
  };
}
