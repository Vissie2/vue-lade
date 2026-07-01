// npm
import type { Ref } from 'vue';
import { watch } from 'vue';

type InertElement = HTMLElement & { inert: boolean };

interface ChangedEl {
  element: Element;
  ariaHidden: string | null;
}

/**
 * While `enabled`, marks every sibling of `target` (within `<body>`) as `inert` +
 * `aria-hidden`, hiding the rest of the page from assistive tech and pointer events.
 * Restores them when disabled. Replaces Radix's `aria-hidden` management.
 */
export function useAriaHidden(enabled: Ref<boolean>, target: Ref<HTMLElement | null>) {
  watch(
    enabled,
    (isEnabled, _prev, onCleanup) => {
      if (!isEnabled || typeof document === 'undefined') {
        return;
      }

      // The portalled drawer lives at the end of <body>; walk up to the child of body.
      let topLevel = target.value;

      while (topLevel && topLevel.parentElement && topLevel.parentElement !== document.body) {
        topLevel = topLevel.parentElement;
      }

      const changed: ChangedEl[] = [];

      for (const child of Array.from(document.body.children)) {
        if (child === topLevel) {
          continue;
        }

        if (child.hasAttribute('aria-live')) {
          continue;
        }

        changed.push({ element: child, ariaHidden: child.getAttribute('aria-hidden') });
        child.setAttribute('aria-hidden', 'true');

        // `inert` is a standard HTMLElement property; narrowing to HTMLElement
        // avoids operating on non-HTML elements (e.g. SVGElement).
        if (child instanceof HTMLElement) {
          (child as InertElement).inert = true; // InertElement cast needed: TS does not always include `inert` in its HTMLElement lib typings
        }
      }

      onCleanup(() => {
        for (const { element, ariaHidden } of changed) {
          if (ariaHidden === null) {
            element.removeAttribute('aria-hidden');
          } else {
            element.setAttribute('aria-hidden', ariaHidden);
          }

          if (element instanceof HTMLElement) {
            (element as InertElement).inert = false; // same cast reason as above
          }
        }
      });
    },
    { immediate: true },
  );
}
