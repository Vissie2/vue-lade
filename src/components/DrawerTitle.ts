// npm
import { defineComponent, h, onMounted, useId } from 'vue';

// core
import { useDrawerContext } from '~/context';
import { Primitive } from '~/primitive';

export const DrawerTitle = defineComponent({
  name: 'DrawerTitle',
  inheritAttrs: false,
  props: {
    asChild: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const { titleId } = useDrawerContext();
    const id = useId();

    onMounted(() => {
      titleId.value = id;
    });

    return () =>
      h(
        Primitive,
        {
          ...attrs,
          as: 'h2',
          asChild: props.asChild,
          id,
          'data-vaul-drawer-title': '',
        },
        { default: () => slots.default?.() },
      );
  },
});
