// npm
import type { Ref } from 'vue';
import { watch } from 'vue';

/**
 * Invokes `onOutside` when a pointer-down occurs outside `container` (and outside
 * any `ignore` elements such as the trigger). Mirrors Radix DismissableLayer's
 * `onPointerDownOutside`.
 */
export function usePointerDownOutside(
  enabled: Ref<boolean>,
  container: Ref<HTMLElement | null>,
  ignore: Ref<HTMLElement | null>[],
  onOutside: (event: PointerEvent) => void,
) {
  function handlePointerDown(event: PointerEvent) {
    if (!(event.target instanceof Node)) {
      return;
    }

    if (container.value && container.value.contains(event.target)) {
      return;
    }

    for (const ignoredRef of ignore) {
      if (ignoredRef.value && ignoredRef.value.contains(event.target)) {
        return;
      }
    }

    onOutside(event);
  }

  watch(
    enabled,
    (isEnabled, _prev, onCleanup) => {
      if (!isEnabled || typeof document === 'undefined') {
        return;
      }

      // Defer attaching so the opening click doesn't immediately dismiss.
      const raf = window.requestAnimationFrame(() => {
        document.addEventListener('pointerdown', handlePointerDown, true);
      });

      function removePointerDown() {
        window.cancelAnimationFrame(raf);
        document.removeEventListener('pointerdown', handlePointerDown, true);
      }

      onCleanup(removePointerDown);
    },
    { immediate: true },
  );
}
