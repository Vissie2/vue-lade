// npm
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

// composables
import { useDrawer } from '~/composables/useDrawer';
// core
import { CLOSE_THRESHOLD, SCROLL_LOCK_TIMEOUT } from '~/constants';
import type { DrawerDirection } from '~/types';

export const DrawerRoot = defineComponent({
  name: 'DrawerRoot',
  props: {
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    activeSnapPoint: {
      type: [String, Number] as PropType<string | number | null>,
      default: undefined,
    },
    snapPoints: {
      type: Array as PropType<Array<number | string>>,
      default: undefined,
    },
    fadeFromIndex: { type: Number, default: undefined },
    closeThreshold: { type: Number, default: CLOSE_THRESHOLD },
    scrollLockTimeout: { type: Number, default: SCROLL_LOCK_TIMEOUT },
    dismissible: { type: Boolean, default: true },
    handleOnly: { type: Boolean, default: false },
    modal: { type: Boolean, default: true },
    nested: { type: Boolean, default: false },
    direction: { type: String as PropType<DrawerDirection>, default: 'bottom' },
    noBodyStyles: { type: Boolean, default: false },
    shouldScaleBackground: { type: Boolean, default: false },
    setBackgroundColorOnScale: { type: Boolean, default: true },
    fixed: { type: Boolean, default: false },
    disablePreventScroll: { type: Boolean, default: true },
    repositionInputs: { type: Boolean, default: true },
    snapToSequentialPoint: { type: Boolean, default: false },
    preventScrollRestoration: { type: Boolean, default: false },
    autoFocus: { type: Boolean, default: false },
    container: {
      type: null as unknown as PropType<HTMLElement | null>,
      default: undefined,
    },
  },
  emits: ['update:open', 'update:activeSnapPoint', 'drag', 'release', 'close', 'animationEnd'],
  setup(props, { slots, emit }) {
    function onUpdateOpen(open: boolean) {
      emit('update:open', open);
    }

    function onUpdateActiveSnapPoint(value: number | string | null) {
      emit('update:activeSnapPoint', value);
    }

    function onDrag(event: PointerEvent, percentageDragged: number) {
      emit('drag', event, percentageDragged);
    }

    function onRelease(event: PointerEvent | null, open: boolean) {
      emit('release', event, open);
    }

    function onClose() {
      emit('close');
    }

    function onAnimationEnd(open: boolean) {
      emit('animationEnd', open);
    }

    useDrawer(props, {
      updateOpen: onUpdateOpen,
      updateActiveSnapPoint: onUpdateActiveSnapPoint,
      drag: onDrag,
      release: onRelease,
      close: onClose,
      animationEnd: onAnimationEnd,
    });

    return () => slots.default?.();
  },
});
