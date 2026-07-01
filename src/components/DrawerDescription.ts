// npm
import { defineComponent, h, onMounted, useId } from 'vue';

// core
import { useDrawerContext } from '~/context';
import { Primitive } from '~/primitive';

export const DrawerDescription = defineComponent({
  name: 'DrawerDescription',
  inheritAttrs: false,
  props: {
    asChild: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const { descriptionId } = useDrawerContext();
    const id = useId();

    onMounted(function () {
      descriptionId.value = id;
    });

    return () =>
      h(
        Primitive,
        {
          ...attrs,
          as: 'p',
          asChild: props.asChild,
          id,
          'data-vaul-drawer-description': '',
        },
        { default: () => slots.default?.() },
      );
  },
});
