// npm
import { defineComponent, h, ref } from 'vue';

// core
import { DOUBLE_TAP_TIMEOUT, LONG_HANDLE_PRESS_TIMEOUT } from '~/constants';
import { useDrawerContext } from '~/context';

export const DrawerHandle = defineComponent({
  name: 'DrawerHandle',
  inheritAttrs: false,
  props: {
    preventCycle: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const {
      closeDrawer,
      isDragging,
      snapPoints,
      activeSnapPoint,
      setActiveSnapPoint,
      dismissible,
      handleOnly,
      isOpen,
      onPress,
      onDrag,
    } = useDrawerContext();

    const closeTimeoutId = ref<number | null>(null);
    const shouldCancelInteraction = ref(false);

    function handleStartCycle() {
      // Stop if this is the second click of a double click
      if (shouldCancelInteraction.value) {
        handleCancelInteraction();
        return;
      }

      window.setTimeout(() => {
        handleCycleSnapPoints();
      }, DOUBLE_TAP_TIMEOUT);
    }

    function handleCycleSnapPoints() {
      // Prevent accidental taps while resizing drawer
      if (isDragging.value || props.preventCycle || shouldCancelInteraction.value) {
        handleCancelInteraction();
        return;
      }

      handleCancelInteraction();

      const points = snapPoints.value;

      if (!points || points.length === 0) {
        if (!dismissible.value) {
          closeDrawer();
        }

        return;
      }

      const isLastSnapPoint = activeSnapPoint.value === points[points.length - 1];

      if (isLastSnapPoint && dismissible.value) {
        closeDrawer();
        return;
      }

      const currentSnapIndex = points.findIndex((point) => point === activeSnapPoint.value);

      if (currentSnapIndex === -1) {
        return; // activeSnapPoint not found in snapPoints
      }

      const nextSnapPoint = points[currentSnapIndex + 1];
      setActiveSnapPoint(nextSnapPoint);
    }

    function handleStartInteraction() {
      closeTimeoutId.value = window.setTimeout(() => {
        // Cancel click interaction on a long press
        shouldCancelInteraction.value = true;
      }, LONG_HANDLE_PRESS_TIMEOUT);
    }

    function handleCancelInteraction() {
      if (closeTimeoutId.value) {
        window.clearTimeout(closeTimeoutId.value);
      }

      shouldCancelInteraction.value = false;
    }

    function onPointerdown(event: PointerEvent) {
      if (handleOnly.value) {
        onPress(event);
      }

      handleStartInteraction();
    }

    function onPointermove(event: PointerEvent) {
      if (handleOnly.value) {
        onDrag(event);
      }
    }

    return () => {
      let drawerVisible: string;

      if (isOpen.value) {
        drawerVisible = 'true';
      } else {
        drawerVisible = 'false';
      }

      return h(
        'div',
        {
          ...attrs,
          onClick: handleStartCycle,
          onPointercancel: handleCancelInteraction,
          onPointerdown,
          onPointermove,
          'data-vaul-drawer-visible': drawerVisible,
          'data-vaul-handle': '',
          'aria-hidden': 'true',
        },
        [h('span', { 'data-vaul-handle-hitarea': '', 'aria-hidden': 'true' }, slots.default?.())],
      );
    };
  },
});
