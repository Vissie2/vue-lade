// npm
import { defineComponent, h } from 'vue';

// core
import { useDrawerContext } from '~/context';
import { Primitive } from '~/primitive';

export const DrawerClose = defineComponent({
  name: 'DrawerClose',
  inheritAttrs: false,
  props: {
    asChild: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots, attrs }) {
    const { closeDrawer } = useDrawerContext();

    function onClick() {
      closeDrawer();
    }

    return () => {
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
          onClick,
        },
        { default: () => slots.default?.() },
      );
    };
  },
});
