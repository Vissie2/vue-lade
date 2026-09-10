// npm
import { cloneVNode, computed, defineComponent, h, ref, watch } from 'vue';

// composables
import { useAriaHidden } from '~/composables/useAriaHidden';
import { useEscapeKeydown } from '~/composables/useEscapeKeydown';
import { useFocusTrap } from '~/composables/useFocusTrap';
import { usePointerDownOutside } from '~/composables/usePointerDownOutside';
import { usePresence } from '~/composables/usePresence';
import { useScaleBackground } from '~/composables/useScaleBackground';
// core
import { useDrawerContext } from '~/context';
import { getSingleChild } from '~/primitive';
import type { DrawerDirection } from '~/types';

interface PointerPosition {
  x: number;
  y: number;
}

export const DrawerContent = defineComponent({
  name: 'DrawerContent',
  inheritAttrs: false,
  props: {
    asChild: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots, attrs }) {
    const ctx = useDrawerContext();
    const {
      drawerRef,
      onPress,
      onRelease,
      onDrag,
      snapPointsOffset,
      activeSnapPointIndex,
      modal,
      isOpen,
      direction,
      snapPoints,
      container,
      handleOnly,
      shouldAnimate,
      titleId,
      descriptionId,
      dismissible,
      triggerRef,
      handleOpenChange,
    } = ctx;

    useScaleBackground();

    const { isPresent, state } = usePresence(isOpen, drawerRef);

    const delayedSnapPoints = ref(false);
    const lastKnownPointerEventRef = ref<PointerEvent | null>(null);
    const pointerStartRef = ref<PointerPosition | null>(null);
    const wasBeyondThePointRef = ref(false);

    const hasSnapPoints = computed(() => {
      return snapPoints.value && snapPoints.value.length > 0;
    });

    const trapEnabled = computed(() => {
      return isOpen.value && modal.value;
    });

    useFocusTrap(drawerRef, {
      enabled: trapEnabled,
      autoFocus: ctx.autoFocus,
      restoreFocusTo: triggerRef,
    });

    function onEscape() {
      if (dismissible.value) {
        handleOpenChange(false);
      }
    }

    function onPointerDownOutside() {
      if (dismissible.value) {
        handleOpenChange(false);
      }
    }

    useEscapeKeydown(isOpen, onEscape);

    usePointerDownOutside(trapEnabled, drawerRef, [triggerRef], onPointerDownOutside);

    useAriaHidden(trapEnabled, drawerRef);

    function isDeltaInDirection(delta: PointerPosition, dir: DrawerDirection, threshold = 0) {
      if (wasBeyondThePointRef.value) {
        return true;
      }

      const deltaY = Math.abs(delta.y);
      const deltaX = Math.abs(delta.x);
      const isDeltaX = deltaX > deltaY;
      let dFactor = -1;

      if (['bottom', 'right'].includes(dir)) {
        dFactor = 1;
      }

      if (dir === 'left' || dir === 'right') {
        const isReverseDirection = delta.x * dFactor < 0;

        if (!isReverseDirection && deltaX >= 0 && deltaX <= threshold) {
          return isDeltaX;
        }
      } else {
        const isReverseDirection = delta.y * dFactor < 0;

        if (!isReverseDirection && deltaY >= 0 && deltaY <= threshold) {
          return !isDeltaX;
        }
      }

      wasBeyondThePointRef.value = true;

      return true;
    }

    // The snap-point enter animation is a CSS transition from `--initial-transform`
    // (off-screen) to the active snap offset, switched on by `data-vaul-delayed-snap-points`.
    // Because this component stays mounted across open/close (only the element is
    // toggled), reset the flag on each open so the element first renders off-screen,
    // then flip it after a frame so the transition actually runs.
    watch(
      isPresent,
      (present) => {
        if (present && hasSnapPoints.value) {
          delayedSnapPoints.value = false;

          window.requestAnimationFrame(() => {
            delayedSnapPoints.value = true;
          });
        } else {
          delayedSnapPoints.value = false;
        }
      },
      { immediate: true },
    );

    function handleOnPointerUp(event: PointerEvent | null) {
      pointerStartRef.value = null;
      wasBeyondThePointRef.value = false;
      onRelease(event);
    }

    function setRef(element: unknown) {
      if (element instanceof HTMLElement) {
        drawerRef.value = element;
      } else {
        drawerRef.value = null;
      }
    }

    function onPointerdown(event: PointerEvent) {
      if (handleOnly.value) {
        return;
      }

      pointerStartRef.value = { x: event.pageX, y: event.pageY };
      onPress(event);
    }

    function onPointermove(event: PointerEvent) {
      lastKnownPointerEventRef.value = event;

      if (handleOnly.value) {
        return;
      }

      if (!pointerStartRef.value) {
        return;
      }

      const yPosition = event.pageY - pointerStartRef.value.y;
      const xPosition = event.pageX - pointerStartRef.value.x;

      let swipeStartThreshold: number;

      if (event.pointerType === 'touch') {
        swipeStartThreshold = 10;
      } else {
        swipeStartThreshold = 2;
      }

      const delta = {
        x: xPosition,
        y: yPosition,
      };

      const isAllowedToSwipe = isDeltaInDirection(delta, direction.value, swipeStartThreshold);

      if (isAllowedToSwipe) {
        onDrag(event);
      } else if (
        Math.abs(xPosition) > swipeStartThreshold ||
        Math.abs(yPosition) > swipeStartThreshold
      ) {
        pointerStartRef.value = null;
      }
    }

    function onPointerup(event: PointerEvent) {
      pointerStartRef.value = null;
      wasBeyondThePointRef.value = false;
      onRelease(event);
    }

    function onPointerout() {
      handleOnPointerUp(lastKnownPointerEventRef.value);
    }

    function onContextmenu() {
      if (lastKnownPointerEventRef.value) {
        handleOnPointerUp(lastKnownPointerEventRef.value);
      }
    }

    return () => {
      if (!isPresent.value) {
        return null;
      }

      let snapStyle: Record<string, string> = {};

      if (snapPointsOffset.value && snapPointsOffset.value.length > 0) {
        snapStyle = {
          '--snap-point-height': `${snapPointsOffset.value[activeSnapPointIndex.value ?? 0]}px`,
        };
      }

      let ariaModal: string | undefined;

      if (modal.value) {
        ariaModal = 'true';
      }

      let delayedSnapPointsValue: string;

      if (delayedSnapPoints.value) {
        delayedSnapPointsValue = 'true';
      } else {
        delayedSnapPointsValue = 'false';
      }

      let snapPointsValue: string;

      if (isOpen.value && hasSnapPoints.value) {
        snapPointsValue = 'true';
      } else {
        snapPointsValue = 'false';
      }

      let customContainerValue: string;

      if (container.value) {
        customContainerValue = 'true';
      } else {
        customContainerValue = 'false';
      }

      let animateValue: string;

      if (shouldAnimate.value) {
        animateValue = 'true';
      } else {
        animateValue = 'false';
      }

      const elProps = {
        ...attrs,
        ref: setRef,
        role: 'dialog',
        'aria-modal': ariaModal,
        'aria-labelledby': titleId.value,
        'aria-describedby': descriptionId.value,
        tabindex: -1,
        'data-vaul-drawer-direction': direction.value,
        'data-vaul-drawer': '',
        'data-vaul-has-snap-points': hasSnapPoints.value ? 'true' : 'false',
        'data-vaul-delayed-snap-points': delayedSnapPointsValue,
        'data-vaul-snap-points': snapPointsValue,
        'data-vaul-custom-container': customContainerValue,
        'data-vaul-animate': animateValue,
        'data-state': state.value,
        style: [snapStyle, attrs.style],
        onPointerdown,
        onPointermove,
        onPointerup,
        onPointerout,
        onContextmenu,
      };

      if (props.asChild) {
        const child = getSingleChild(slots.default?.());

        if (child) {
          return cloneVNode(child, elProps);
        }

        return null;
      }

      return h('div', elProps, slots.default?.());
    };
  },
});
