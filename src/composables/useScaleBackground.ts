// npm
import { onScopeDispose, watch } from 'vue';

// core
import { BORDER_RADIUS, TRANSITIONS, TRANSITION_EASE, WINDOW_TOP_OFFSET } from '~/constants';
import { useDrawerContext } from '~/context';
import { assignStyle, isVertical } from '~/helpers';

/**
 * Port of Vaul's `useScaleBackground`. Scales/insets the `[data-vaul-drawer-wrapper]`
 * element when the drawer opens (the iOS-style "card behind a sheet" effect).
 */
export function useScaleBackground() {
  const { direction, isOpen, shouldScaleBackground, setBackgroundColorOnScale, noBodyStyles } =
    useDrawerContext();
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const initialBackgroundColor =
    typeof document !== 'undefined' ? document.body.style.backgroundColor : '';

  function getScale() {
    return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth;
  }

  watch(
    [isOpen, shouldScaleBackground],
    (_value, _prev, onCleanup) => {
      if (!(isOpen.value && shouldScaleBackground.value)) {
        return;
      }

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const wrapperElement =
        document.querySelector('[data-vaul-drawer-wrapper]') ||
        document.querySelector('[vaul-drawer-wrapper]');

      if (!(wrapperElement instanceof HTMLElement)) {
        return;
      }

      const wrapper = wrapperElement;

      if (setBackgroundColorOnScale.value && !noBodyStyles.value) {
        assignStyle(document.body, { background: 'black' });
      }

      assignStyle(wrapper, {
        transformOrigin: isVertical(direction.value) ? 'top' : 'left',
        transitionProperty: 'transform, border-radius',
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: TRANSITION_EASE,
      });

      let transformStyle: { transform: string };

      if (isVertical(direction.value)) {
        transformStyle = {
          transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
        };
      } else {
        transformStyle = {
          transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
        };
      }

      const wrapperStylesCleanup = assignStyle(wrapper, {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: 'hidden',
        ...transformStyle,
      });

      onCleanup(function cleanupScaleBackground() {
        wrapperStylesCleanup();
        timeoutId = setTimeout(() => {
          if (initialBackgroundColor) {
            document.body.style.background = initialBackgroundColor;
          } else {
            document.body.style.removeProperty('background');
          }
        }, TRANSITIONS.DURATION * 1000);
      });
    },
    { immediate: true },
  );

  onScopeDispose(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });
}
