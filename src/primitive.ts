// npm
import type { PropType, VNode } from 'vue';
import { cloneVNode, Comment, defineComponent, Fragment, h, Text } from 'vue';

function isRenderableVNode(vnode: VNode): boolean {
  if (vnode.type === Comment) {
    return false;
  }

  if (vnode.type === Text && typeof vnode.children === 'string' && vnode.children.trim() === '') {
    return false;
  }

  return true;
}

export function getSingleChild(nodes: VNode[] | undefined): VNode | null {
  if (!nodes) {
    return null;
  }

  const renderable = nodes.filter(isRenderableVNode);

  // Unwrap a single <template>/Fragment wrapper.
  if (renderable.length === 1 && renderable[0].type === Fragment) {
    return getSingleChild(renderable[0].children as VNode[]);
  }

  if (renderable.length === 1) {
    return renderable[0];
  } else {
    return null;
  }
}

/**
 * Minimal render-delegation primitive. With `as-child`, it merges its attrs/handlers
 * onto the single child VNode (Vue's `cloneVNode` merges class/style/`on*`); otherwise
 * it renders `as` (default `div`). Equivalent to Radix's `asChild` / reka-ui Primitive.
 */
export const Primitive = defineComponent({
  name: 'Primitive',
  inheritAttrs: false,
  props: {
    asChild: {
      type: Boolean,
      default: false,
    },
    as: {
      type: [String, Object, Function] as PropType<string | object>,
      default: 'div',
    },
  },
  setup(props, { slots, attrs }) {
    return () => {
      const children = slots.default?.();

      if (props.asChild) {
        const child = getSingleChild(children);

        if (!child) {
          if (children && children.filter(isRenderableVNode).length > 1) {
            console.warn(
              '[vue-lade] `as-child` expects a single child element. Received multiple children; rendering nothing.',
            );
          }

          return null;
        }

        return cloneVNode(child, attrs);
      }

      // Vue h() requires a cast for dynamic component types
      // @typescript-eslint/no-explicit-any
      return h(props.as as any, attrs, slots.default ? slots.default() : undefined);
    };
  },
});
