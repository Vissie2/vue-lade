// npm
import { defineComponent, h, Teleport } from 'vue';
import type { PropType } from 'vue';

// core
import { useDrawerContext } from '~/context';

export const DrawerPortal = defineComponent({
  name: 'DrawerPortal',
  props: {
    to: {
      type: [String, Object] as PropType<string | HTMLElement>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const { container } = useDrawerContext();

    return () =>
      // Vue's h() type does not accept Teleport directly
      // @typescript-eslint/no-explicit-any
      h(Teleport as any, { to: props.to ?? container.value ?? 'body' }, slots.default?.());
  },
});
