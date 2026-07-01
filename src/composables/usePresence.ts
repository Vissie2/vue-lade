// npm
import type { Ref } from 'vue';
import { onScopeDispose, ref, watch } from 'vue';

// core
import { TRANSITIONS } from '~/constants';

type Cleanup = () => void;

/**
 * Keeps an element mounted while its exit animation plays. Replaces the "presence"
 * behavior Radix's Dialog gives Content/Overlay: when `present` flips to false we
 * keep `isPresent` true and set `state` to `'closed'`, then unmount once the CSS
 * animation/transition on `element` finishes (falling back to a timeout). Unmounting
 * on the animation end — rather than a fixed timer — avoids a one-frame flash where
 * the element reverts to its base transform before it is removed.
 */
export function usePresence(
  present: Ref<boolean>,
  element: Ref<HTMLElement | null>,
): {
  isPresent: Ref<boolean>;
  state: Ref<'open' | 'closed'>;
} {
  const isPresent = ref(present.value);

  let initialState: 'open' | 'closed';

  if (present.value) {
    initialState = 'open';
  } else {
    initialState = 'closed';
  }

  const state = ref<'open' | 'closed'>(initialState);
  let cleanup: Cleanup | null = null;

  function clear() {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
  }

  watch(
    present,
    (value) => {
      clear();

      if (value) {
        isPresent.value = true;
        state.value = 'open';

        return;
      }

      // Closing: play the exit animation, then unmount when it ends.
      state.value = 'closed';
      const node = element.value;

      if (!node) {
        isPresent.value = false;

        return;
      }

      let done = false;

      function finish() {
        if (done) {
          return;
        }

        done = true;
        clear();
        isPresent.value = false;
      }

      function onEnd(event: Event) {
        // Ignore bubbled child animations/transitions.
        if (event.target === node) {
          finish();
        }
      }

      node.addEventListener('animationend', onEnd);
      node.addEventListener('animationcancel', onEnd);
      node.addEventListener('transitionend', onEnd);
      // Fallback in case no animation/transition runs on the element.
      const timer = setTimeout(finish, TRANSITIONS.DURATION * 1000 + 50);

      cleanup = () => {
        node.removeEventListener('animationend', onEnd);
        node.removeEventListener('animationcancel', onEnd);
        node.removeEventListener('transitionend', onEnd);
        clearTimeout(timer);
      };
    },
    { immediate: true, flush: 'post' },
  );

  onScopeDispose(clear);

  return { isPresent, state };
}
