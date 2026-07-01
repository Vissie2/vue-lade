// npm
import { defineComponent, h } from 'vue';

// core
import { useDrawerContext } from '~/context';
import { Primitive } from '~/primitive';

export const DrawerTrigger = defineComponent({
  name: 'DrawerTrigger',
  inheritAttrs: false,
  props: {
    asChild: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const { isOpen, openDrawer, triggerRef } = useDrawerContext();

    function onClick(event: MouseEvent) {
      // Capture the trigger so focus can be restored to it on close.
      if (event.currentTarget instanceof HTMLElement) {
        triggerRef.value = event.currentTarget;
      }

      openDrawer();
    }

    return () => {
      let dataState: string;

      if (isOpen.value) {
        dataState = 'open';
      } else {
        dataState = 'closed';
      }

      const extraProps: Record<string, string> = {};

      if (!props.asChild) {
        extraProps.type = 'button';
      }

      return h(
        Primitive,
        {
          ...attrs,
          as: 'button',
          asChild: props.asChild,
          ...extraProps,
          'aria-haspopup': 'dialog',
          'aria-expanded': isOpen.value,
          'data-state': dataState,
          onClick,
        },
        { default: () => slots.default?.() },
      );
    };
  },
});
