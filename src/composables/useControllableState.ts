// npm
import type { WritableComputedRef } from 'vue';
import { computed, ref } from 'vue';

interface UseControllableStateParams<T> {
  /** Reactive getter for the controlled prop. Return `undefined` for uncontrolled. */
  prop: () => T | undefined;
  defaultValue?: T | undefined;
  onChange?: (value: T) => void;
}

/**
 * Vue port of Radix's `useControllableState`. Lets a component be either controlled
 * (when `prop()` is defined) or uncontrolled (internal `ref`), emitting `onChange`
 * whenever the value changes. Backs `v-model:open` / `v-model:activeSnapPoint`.
 */
export function useControllableState<T>({
  prop,
  defaultValue,
  onChange = () => {},
}: UseControllableStateParams<T>): WritableComputedRef<T | undefined> {
  const uncontrolled = ref(defaultValue) as { value: T | undefined };

  return computed<T | undefined>({
    get() {
      const controlled = prop();

      if (controlled !== undefined) {
        return controlled;
      }

      return uncontrolled.value;
    },
    set(next) {
      const isControlled = prop() !== undefined;

      if (isControlled) {
        if (next !== prop()) {
          // next is T | undefined here; onChange expects T. The controllable
          // state contract guarantees next matches T when the prop is defined.
          onChange(next as T); // unavoidable cast: WritableComputedRef<T|undefined>.set receives T|undefined
        }
      } else {
        if (next !== uncontrolled.value) {
          uncontrolled.value = next;
          onChange(next as T); // unavoidable cast: same reason as above
        }
      }
    },
  });
}
