// npm
import type { Ref } from 'vue';
import { computed, onScopeDispose, ref, watch } from 'vue';

// composables
import { useControllableState } from '~/composables/useControllableState';

// core
import { TRANSITIONS, TRANSITION_EASE, VELOCITY_THRESHOLD } from '~/constants';
import { isVertical, set } from '~/helpers';
import type { DrawerDirection } from '~/types';

interface UseSnapPointsOptions {
  activeSnapPointProp: () => number | string | null | undefined;
  setActiveSnapPointProp?: (snapPoint: number | string | null) => void;
  snapPoints: Ref<Array<number | string> | undefined>;
  fadeFromIndex: Ref<number | undefined>;
  drawerRef: Ref<HTMLElement | null>;
  overlayRef: Ref<HTMLElement | null>;
  onSnapPointChange: (activeSnapPointIndex: number) => void;
  direction: Ref<DrawerDirection>;
  container: Ref<HTMLElement | null | undefined>;
  snapToSequentialPoint: Ref<boolean>;
}

export function useSnapPoints(options: UseSnapPointsOptions) {
  const {
    activeSnapPointProp,
    setActiveSnapPointProp,
    snapPoints,
    fadeFromIndex,
    drawerRef,
    overlayRef,
    onSnapPointChange,
    direction,
    container,
    snapToSequentialPoint,
  } = options;

  const activeSnapPoint = useControllableState<number | string | null>({
    prop: () => activeSnapPointProp() ?? undefined,
    defaultValue: snapPoints.value?.[0] ?? null,
    onChange: (value) => setActiveSnapPointProp?.(value),
  });

  const windowDimensions = ref(
    typeof window !== 'undefined'
      ? { innerWidth: window.innerWidth, innerHeight: window.innerHeight }
      : undefined,
  );

  function onResize() {
    windowDimensions.value = {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    };
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', onResize);
    onScopeDispose(() => window.removeEventListener('resize', onResize));
  }

  const isLastSnapPoint = computed(() => {
    return activeSnapPoint.value === snapPoints.value?.[snapPoints.value.length - 1] || null;
  });

  const activeSnapPointIndex = computed(() => {
    return snapPoints.value?.findIndex((snapPoint) => snapPoint === activeSnapPoint.value) ?? null;
  });

  const shouldFade = computed(() => {
    return (
      (snapPoints.value &&
        snapPoints.value.length > 0 &&
        (fadeFromIndex.value || fadeFromIndex.value === 0) &&
        !Number.isNaN(fadeFromIndex.value) &&
        snapPoints.value[fadeFromIndex.value as number] === activeSnapPoint.value) ||
      !snapPoints.value
    );
  });

  const snapPointsOffset = computed<number[]>(() => {
    let containerSize: { width: number; height: number };

    if (container.value) {
      containerSize = {
        width: container.value.getBoundingClientRect().width,
        height: container.value.getBoundingClientRect().height,
      };
    } else if (typeof window !== 'undefined') {
      containerSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    } else {
      containerSize = {
        width: 0,
        height: 0,
      };
    }

    return (
      snapPoints.value?.map((snapPoint) => {
        const isPx = typeof snapPoint === 'string';
        let snapPointAsNumber = 0;

        if (isPx) {
          snapPointAsNumber = parseInt(snapPoint, 10);
        }

        if (isVertical(direction.value)) {
          let height: number;

          if (isPx) {
            height = snapPointAsNumber;
          } else if (windowDimensions.value) {
            height = (snapPoint as number) * containerSize.height;
          } else {
            height = 0;
          }

          if (windowDimensions.value) {
            if (direction.value === 'bottom') {
              return containerSize.height - height;
            }

            return -containerSize.height + height;
          }

          return height;
        }

        let width: number;

        if (isPx) {
          width = snapPointAsNumber;
        } else if (windowDimensions.value) {
          width = (snapPoint as number) * containerSize.width;
        } else {
          width = 0;
        }

        if (windowDimensions.value) {
          if (direction.value === 'right') {
            return containerSize.width - width;
          }

          return -containerSize.width + width;
        }

        return width;
      }) ?? []
    );
  });

  const activeSnapPointOffset = computed(() => {
    if (activeSnapPointIndex.value !== null) {
      return snapPointsOffset.value?.[activeSnapPointIndex.value] ?? null;
    }

    return null;
  });

  function snapToPoint(dimension: number) {
    const newSnapPointIndex =
      snapPointsOffset.value?.findIndex((snapPointDim) => snapPointDim === dimension) ?? null;

    if (newSnapPointIndex !== null) {
      onSnapPointChange(newSnapPointIndex);
    }

    let transformValue: string;

    if (isVertical(direction.value)) {
      transformValue = `translate3d(0, ${dimension}px, 0)`;
    } else {
      transformValue = `translate3d(${dimension}px, 0, 0)`;
    }

    set(drawerRef.value, {
      transition: `transform ${TRANSITIONS.DURATION}s ${TRANSITION_EASE}`,
      transform: transformValue,
    });

    if (
      snapPointsOffset.value &&
      newSnapPointIndex !== snapPointsOffset.value.length - 1 &&
      fadeFromIndex.value !== undefined &&
      newSnapPointIndex !== fadeFromIndex.value &&
      newSnapPointIndex !== null &&
      newSnapPointIndex < fadeFromIndex.value
    ) {
      set(overlayRef.value, {
        transition: `opacity ${TRANSITIONS.DURATION}s ${TRANSITION_EASE}`,
        opacity: '0',
      });
    } else {
      set(overlayRef.value, {
        transition: `opacity ${TRANSITIONS.DURATION}s ${TRANSITION_EASE}`,
        opacity: '1',
      });
    }

    if (newSnapPointIndex !== null) {
      activeSnapPoint.value = snapPoints.value?.[Math.max(newSnapPointIndex, 0)] ?? null;
    }
  }

  // When the active snap point changes (e.g. tapping the handle, or a controlled
  // change), animate the drawer to that point. Port of Vaul's snap-point effect.
  watch(
    [activeSnapPoint, snapPointsOffset],
    () => {
      const prop = activeSnapPointProp();

      if (activeSnapPoint.value || prop) {
        const newIndex =
          snapPoints.value?.findIndex(
            (snapPoint) => snapPoint === prop || snapPoint === activeSnapPoint.value,
          ) ?? -1;

        if (
          snapPointsOffset.value &&
          newIndex !== -1 &&
          typeof snapPointsOffset.value[newIndex] === 'number'
        ) {
          snapToPoint(snapPointsOffset.value[newIndex]);
        }
      }
    },
    // Not immediate: the initial position is CSS-driven, and running synchronously
    // during setup would touch `snapPointsOffset` before useSnapPoints() returns.
    { flush: 'post' },
  );

  function onRelease({
    draggedDistance,
    closeDrawer,
    velocity,
    dismissible,
  }: {
    draggedDistance: number;
    closeDrawer: () => void;
    velocity: number;
    dismissible: boolean;
  }) {
    if (fadeFromIndex.value === undefined) {
      return;
    }

    let currentPosition: number;

    if (direction.value === 'bottom' || direction.value === 'right') {
      currentPosition = (activeSnapPointOffset.value ?? 0) - draggedDistance;
    } else {
      currentPosition = (activeSnapPointOffset.value ?? 0) + draggedDistance;
    }

    const isOverlaySnapPoint = activeSnapPointIndex.value === fadeFromIndex.value - 1;
    const isFirst = activeSnapPointIndex.value === 0;
    const hasDraggedUp = draggedDistance > 0;

    if (isOverlaySnapPoint) {
      set(overlayRef.value, {
        transition: `opacity ${TRANSITIONS.DURATION}s ${TRANSITION_EASE}`,
      });
    }

    if (!snapToSequentialPoint.value && velocity > 2 && !hasDraggedUp) {
      if (dismissible) {
        closeDrawer();
      } else {
        snapToPoint(snapPointsOffset.value[0]); // snap to initial point
      }

      return;
    }

    if (
      !snapToSequentialPoint.value &&
      velocity > 2 &&
      hasDraggedUp &&
      snapPointsOffset.value &&
      snapPoints.value
    ) {
      snapToPoint(snapPointsOffset.value[snapPoints.value.length - 1]);

      return;
    }

    // Find the closest snap point to the current position
    const closestSnapPoint = snapPointsOffset.value?.reduce((prev, curr) => {
      if (typeof prev !== 'number' || typeof curr !== 'number') {
        return prev;
      }

      return Math.abs(curr - currentPosition) < Math.abs(prev - currentPosition) ? curr : prev;
    });

    const dim = isVertical(direction.value) ? window.innerHeight : window.innerWidth;

    if (velocity > VELOCITY_THRESHOLD && Math.abs(draggedDistance) < dim * 0.4) {
      let dragDirection: number;

      if (hasDraggedUp) {
        dragDirection = 1; // up
      } else {
        dragDirection = -1; // down
      }

      // Don't do anything if we swipe upwards while being on the last snap point
      if (dragDirection > 0 && isLastSnapPoint.value && snapPoints.value) {
        snapToPoint(snapPointsOffset.value[snapPoints.value.length - 1]);

        return;
      }

      if (isFirst && dragDirection < 0 && dismissible) {
        closeDrawer();
      }

      if (activeSnapPointIndex.value === null) {
        return;
      }

      snapToPoint(snapPointsOffset.value[activeSnapPointIndex.value + dragDirection]);

      return;
    }

    if (typeof closestSnapPoint === 'number') {
      snapToPoint(closestSnapPoint);
    }
  }

  function onDrag({ draggedDistance }: { draggedDistance: number }) {
    if (activeSnapPointOffset.value === null) {
      return;
    }

    let newValue: number;

    if (direction.value === 'bottom' || direction.value === 'right') {
      newValue = activeSnapPointOffset.value - draggedDistance;
    } else {
      newValue = activeSnapPointOffset.value + draggedDistance;
    }

    // Don't do anything if we exceed the last (biggest) snap point
    if (
      (direction.value === 'bottom' || direction.value === 'right') &&
      newValue < snapPointsOffset.value[snapPointsOffset.value.length - 1]
    ) {
      return;
    }

    if (
      (direction.value === 'top' || direction.value === 'left') &&
      newValue > snapPointsOffset.value[snapPointsOffset.value.length - 1]
    ) {
      return;
    }

    let dragTransform: string;

    if (isVertical(direction.value)) {
      dragTransform = `translate3d(0, ${newValue}px, 0)`;
    } else {
      dragTransform = `translate3d(${newValue}px, 0, 0)`;
    }

    set(drawerRef.value, {
      transform: dragTransform,
    });
  }

  function getPercentageDragged(absDraggedDistance: number, isDraggingDown: boolean) {
    if (
      !snapPoints.value ||
      typeof activeSnapPointIndex.value !== 'number' ||
      !snapPointsOffset.value ||
      fadeFromIndex.value === undefined
    ) {
      return null;
    }

    // If this is true we are dragging to a snap point that is supposed to have an overlay
    const isOverlaySnapPoint = activeSnapPointIndex.value === fadeFromIndex.value - 1;
    const isOverlaySnapPointOrHigher = activeSnapPointIndex.value >= fadeFromIndex.value;

    if (isOverlaySnapPointOrHigher && isDraggingDown) {
      return 0;
    }

    // Don't animate, but still use this one if we are dragging away from the overlaySnapPoint
    if (isOverlaySnapPoint && !isDraggingDown) {
      return 1;
    }

    if (!shouldFade.value && !isOverlaySnapPoint) {
      return null;
    }

    // Either fadeFrom index or the one before
    const targetSnapPointIndex = isOverlaySnapPoint
      ? activeSnapPointIndex.value + 1
      : activeSnapPointIndex.value - 1;

    // Get the distance from overlaySnapPoint to the one before or vice-versa to calculate the opacity percentage accordingly
    const snapPointDistance = isOverlaySnapPoint
      ? snapPointsOffset.value[targetSnapPointIndex] -
        snapPointsOffset.value[targetSnapPointIndex - 1]
      : snapPointsOffset.value[targetSnapPointIndex + 1] -
        snapPointsOffset.value[targetSnapPointIndex];

    const percentageDragged = absDraggedDistance / Math.abs(snapPointDistance);

    if (isOverlaySnapPoint) {
      return 1 - percentageDragged;
    } else {
      return percentageDragged;
    }
  }

  return {
    isLastSnapPoint,
    activeSnapPoint,
    shouldFade,
    getPercentageDragged,
    activeSnapPointIndex,
    onRelease,
    onDrag,
    snapPointsOffset,
    snapToPoint,
  };
}
