// npm
import type { Ref } from 'vue';
import { nextTick, watch } from 'vue';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement,
  );
}

interface UseFocusTrapOptions {
  enabled: Ref<boolean>;
  /** When false, focus is not moved into the container on open (Vaul's default). */
  autoFocus: Ref<boolean>;
  /** Element to restore focus to when the trap deactivates. */
  restoreFocusTo: Ref<HTMLElement | null>;
}

/**
 * Zero-dependency focus trap. Loops Tab / Shift+Tab within `container` while
 * `enabled`, optionally focuses the first element on open, and restores focus to
 * `restoreFocusTo` on close. Replaces Radix's FocusScope.
 */
export function useFocusTrap(container: Ref<HTMLElement | null>, options: UseFocusTrapOptions) {
  const { enabled, autoFocus, restoreFocusTo } = options;

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab' || !container.value) {
      return;
    }

    const focusables = getFocusableElements(container.value);

    if (focusables.length === 0) {
      event.preventDefault();

      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (!container.value.contains(active)) {
      event.preventDefault();

      if (event.shiftKey) {
        last.focus();
      } else {
        first.focus();
      }

      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    }
  }

  watch(
    enabled,
    (isEnabled, _prev, onCleanup) => {
      if (typeof document === 'undefined') {
        return;
      }

      if (isEnabled) {
        document.addEventListener('keydown', handleKeyDown, true);

        if (autoFocus.value) {
          nextTick(() => {
            if (!container.value) {
              return;
            }

            const focusables = getFocusableElements(container.value);
            const focusTarget = focusables[0];

            if (focusTarget) {
              focusTarget.focus();
            } else {
              container.value.focus();
            }
          });
        }

        function removeKeyDown() {
          document.removeEventListener('keydown', handleKeyDown, true);
          // Restore focus to the trigger (or whatever opened the drawer).
          const target = restoreFocusTo.value;

          if (target && typeof target.focus === 'function') {
            target.focus();
          }
        }

        onCleanup(removeKeyDown);
      }
    },
    { immediate: true },
  );
}
