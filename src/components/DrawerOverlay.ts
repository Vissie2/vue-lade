// npm
import { cloneVNode, computed, defineComponent, h } from 'vue';

// composables
import { usePresence } from '~/composables/usePresence';

// core
import { useDrawerContext } from '~/context';
import { getSingleChild } from '~/primitive';

export const DrawerOverlay = defineComponent({
  name: 'DrawerOverlay',
  inheritAttrs: false,
  props: {
    asChild: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const { overlayRef, snapPoints, onRelease, shouldFade, isOpen, modal, shouldAnimate } =
      useDrawerContext();
    const { isPresent, state } = usePresence(isOpen, overlayRef);
    const hasSnapPoints = computed(() => {
      return snapPoints.value && snapPoints.value.length > 0;
    });

    function setRef(element: unknown) {
      if (element instanceof HTMLElement) {
        overlayRef.value = element;
      } else {
        overlayRef.value = null;
      }
    }

    function onMouseUp(event: PointerEvent) {
      onRelease(event);
    }

    return () => {
      // Overlay locks scroll; only present in modal mode.
      if (!modal.value || !isPresent.value) {
        return null;
      }

      let snapPointsValue: string;

      if (isOpen.value && hasSnapPoints.value) {
        snapPointsValue = 'true';
      } else {
        snapPointsValue = 'false';
      }

      let snapPointsOverlayValue: string;

      if (isOpen.value && shouldFade.value) {
        snapPointsOverlayValue = 'true';
      } else {
        snapPointsOverlayValue = 'false';
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
        'data-vaul-overlay': '',
        'data-vaul-snap-points': snapPointsValue,
        'data-vaul-snap-points-overlay': snapPointsOverlayValue,
        'data-vaul-animate': animateValue,
        'data-state': state.value,
        onMouseup: onMouseUp,
      };

      if (props.asChild) {
        const child = getSingleChild(slots.default?.());

        if (child) {
          return cloneVNode(child, elProps);
        }

        return null;
      }

      return h('div', elProps);
    };
  },
});
