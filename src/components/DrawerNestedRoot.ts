// npm
import { defineComponent, h } from 'vue';

// core
import { DrawerRoot } from '~/components/DrawerRoot';
import { useDrawerContext } from '~/context';

type DragFn = (event: PointerEvent, percentageDragged: number) => void;
type ReleaseFn = (event: PointerEvent | null, open: boolean) => void;
type OpenFn = (open: boolean) => void;
type CloseFn = () => void;

/**
 * A `Drawer.Root` variant to be rendered inside another drawer. Wires the child's
 * drag/open/release events to the parent's nested-transform handlers so the parent
 * scales back as the child opens. Must be placed within another `Drawer.Root`.
 */
export const DrawerNestedRoot = defineComponent({
  name: 'DrawerNestedRoot',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const { onNestedDrag, onNestedOpenChange, onNestedRelease } = useDrawerContext();

    return () => {
      const {
        onDrag: rawDrag,
        onRelease: rawRelease,
        onClose: rawClose,
        'onUpdate:open': rawUpdateOpen,
        ...rest
        // attrs is typed as Record<string, unknown> by Vue — cast required to destructure event keys
      } = attrs as Record<string, unknown>;

      const userDrag = rawDrag as DragFn | undefined;
      const userRelease = rawRelease as ReleaseFn | undefined;
      const userClose = rawClose as CloseFn | undefined;
      const userUpdateOpen = rawUpdateOpen as OpenFn | undefined;

      function onDragHandler(event: PointerEvent, percentageDragged: number) {
        onNestedDrag(event, percentageDragged);
        userDrag?.(event, percentageDragged);
      }

      function onReleaseHandler(event: PointerEvent | null, open: boolean) {
        if (event) {
          onNestedRelease(event, open);
        }

        userRelease?.(event, open);
      }

      function onUpdateOpen(open: boolean) {
        if (open) {
          onNestedOpenChange(open);
        }

        userUpdateOpen?.(open);
      }

      function onCloseHandler() {
        onNestedOpenChange(false);
        userClose?.();
      }

      return h(
        DrawerRoot,
        {
          ...rest,
          nested: true,
          onDrag: onDragHandler,
          onRelease: onReleaseHandler,
          'onUpdate:open': onUpdateOpen,
          onClose: onCloseHandler,
        },
        slots,
      );
    };
  },
});
