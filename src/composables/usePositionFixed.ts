// npm
import type { Ref } from 'vue';
import { onMounted, onScopeDispose, ref, watch } from 'vue';

// composables
import { isSafari } from '~/browser';

let previousBodyPosition: Record<string, string> | null = null;

interface UsePositionFixedOptions {
  isOpen: Ref<boolean>;
  modal: Ref<boolean>;
  nested: Ref<boolean>;
  hasBeenOpened: Ref<boolean>;
  preventScrollRestoration: Ref<boolean>;
  noBodyStyles: Ref<boolean>;
}

/**
 * Port of Vaul's `usePositionFixed`. Prevents buggy scroll behaviour on iOS Safari
 * by setting `position: fixed` on the body while the drawer is open, then restoring.
 */
export function usePositionFixed(options: UsePositionFixedOptions) {
  const { isOpen, modal, nested, hasBeenOpened, preventScrollRestoration, noBodyStyles } = options;

  const activeUrl = ref(typeof window !== 'undefined' ? window.location.href : '');
  const scrollPos = ref(0);

  function setPositionFixed() {
    // All browsers on iOS will return true here.
    if (!isSafari()) {
      return;
    }

    if (previousBodyPosition === null && isOpen.value && !noBodyStyles.value) {
      previousBodyPosition = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        height: document.body.style.height,
        right: 'unset',
      };

      const { scrollX, innerHeight } = window;

      document.body.style.setProperty('position', 'fixed', 'important');
      Object.assign(document.body.style, {
        top: `${-scrollPos.value}px`,
        left: `${-scrollX}px`,
        right: '0px',
        height: 'auto',
      });

      window.setTimeout(
        () =>
          window.requestAnimationFrame(() => {
            // Attempt to check if the bottom bar appeared due to the position change
            const bottomBarHeight = innerHeight - window.innerHeight;

            if (bottomBarHeight && scrollPos.value >= innerHeight) {
              // Move the content further up so that the bottom bar doesn't hide it
              document.body.style.top = `${-(scrollPos.value + bottomBarHeight)}px`;
            }
          }),
        300,
      );
    }
  }

  function restorePositionSetting() {
    // All browsers on iOS will return true here.
    if (!isSafari()) {
      return;
    }

    if (previousBodyPosition !== null && !noBodyStyles.value) {
      // Convert the position from "px" to Int
      const y = -parseInt(document.body.style.top, 10);
      const x = -parseInt(document.body.style.left, 10);

      // Restore styles
      Object.assign(document.body.style, previousBodyPosition);

      window.requestAnimationFrame(() => {
        if (preventScrollRestoration.value && activeUrl.value !== window.location.href) {
          activeUrl.value = window.location.href;

          return;
        }

        window.scrollTo(x, y);
      });

      previousBodyPosition = null;
    }
  }

  onMounted(() => {
    if (typeof window === 'undefined') {
      return;
    }

    function onScroll() {
      scrollPos.value = window.scrollY;
    }

    onScroll();
    window.addEventListener('scroll', onScroll);
    onScopeDispose(() => window.removeEventListener('scroll', onScroll));
  });

  watch(
    [isOpen, hasBeenOpened, activeUrl, modal, nested],
    () => {
      if (nested.value || !hasBeenOpened.value) {
        return;
      }

      if (isOpen.value) {
        // avoid for standalone mode (PWA)
        const isStandalone =
          typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;

        if (!isStandalone) {
          setPositionFixed();
        }

        if (!modal.value) {
          window.setTimeout(() => {
            restorePositionSetting();
          }, 500);
        }
      } else {
        restorePositionSetting();
      }
    },
    { immediate: true },
  );

  onScopeDispose(() => {
    if (!modal.value || typeof document === 'undefined') {
      return;
    }

    // Another drawer is opened, safe to ignore the execution
    const hasDrawerOpened = !!document.querySelector('[data-vaul-drawer]');

    if (hasDrawerOpened) {
      return;
    }

    restorePositionSetting();
  });

  return { restorePositionSetting };
}
