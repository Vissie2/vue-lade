// npm
import type { Ref } from 'vue';
import { watch } from 'vue';

/**
 * Calls `onEscape` when the Escape key is pressed while `enabled` is true.
 * Mirrors the Escape-to-dismiss behavior Radix's DismissableLayer provides.
 */
export function useEscapeKeydown(enabled: Ref<boolean>, onEscape: (event: KeyboardEvent) => void) {
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onEscape(event);
    }
  }

  watch(
    enabled,
    (isEnabled, _prev, onCleanup) => {
      if (!isEnabled || typeof document === 'undefined') {
        return;
      }

      document.addEventListener('keydown', handleKeyDown);

      function removeKeyDown() {
        document.removeEventListener('keydown', handleKeyDown);
      }

      onCleanup(removeKeyDown);
    },
    { immediate: true },
  );
}
