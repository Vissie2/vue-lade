// npm
import type { AnyFunction, DrawerDirection } from '~/types';

interface Style {
  [key: string]: string;
}

const cache = new WeakMap<HTMLElement, Style>();

export function isInView(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();

  if (!window.visualViewport) {
    return false;
  }

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    // Need + 40 for safari detection
    rect.bottom <= window.visualViewport.height - 40 &&
    rect.right <= window.visualViewport.width
  );
}

function applyStyleEntry(element: HTMLElement, key: string, value: string, originalStyles: Style) {
  if (key.startsWith('--')) {
    element.style.setProperty(key, value);

    return;
  }

  originalStyles[key] = element.style.getPropertyValue(key);
  element.style.setProperty(key, value);
}

export function set(
  element: Element | HTMLElement | null | undefined,
  styles: Style,
  ignoreCache = false,
) {
  if (!element || !(element instanceof HTMLElement)) {
    return;
  }

  const originalStyles: Style = {};

  Object.entries(styles).forEach(([key, value]: [string, string]) => {
    applyStyleEntry(element, key, value, originalStyles);
  });

  if (ignoreCache) {
    return;
  }

  cache.set(element, originalStyles);
}

export function reset(element: Element | HTMLElement | null, property?: string) {
  if (!element || !(element instanceof HTMLElement)) {
    return;
  }

  const originalStyles = cache.get(element);

  if (!originalStyles) {
    return;
  }

  if (property) {
    element.style.setProperty(property, originalStyles[property]);
  } else {
    Object.entries(originalStyles).forEach(([key, value]) => {
      element.style.setProperty(key, value);
    });
  }
}

export function isVertical(direction: DrawerDirection): boolean {
  switch (direction) {
    case 'top':
    case 'bottom':
      return true;
    case 'left':
    case 'right':
      return false;
    default:
      return direction satisfies never;
  }
}

export function getTranslate(element: HTMLElement, direction: DrawerDirection): number | null {
  if (!element) {
    return null;
  }

  const style = window.getComputedStyle(element);
  const transform =
    style.transform ||
    style.getPropertyValue('-webkit-transform') ||
    style.getPropertyValue('-moz-transform');

  let matrix = transform.match(/^matrix3d\((.+)\)$/);

  if (matrix) {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d
    let index: number;

    if (isVertical(direction)) {
      index = 13;
    } else {
      index = 12;
    }

    return parseFloat(matrix[1].split(', ')[index]);
  }

  // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
  matrix = transform.match(/^matrix\((.+)\)$/);

  if (matrix) {
    let index: number;

    if (isVertical(direction)) {
      index = 5;
    } else {
      index = 4;
    }

    return parseFloat(matrix[1].split(', ')[index]);
  }

  return null;
}

export function dampenValue(value: number) {
  return 8 * (Math.log(value + 1) - 2);
}

export function assignStyle(
  element: HTMLElement | null | undefined,
  style: Partial<CSSStyleDeclaration>,
) {
  if (!element) {
    return function cleanup() {};
  }

  const previousStyle = element.style.cssText;
  Object.assign(element.style, style);

  return function cleanup() {
    element.style.cssText = previousStyle;
  };
}

/**
 * Receives functions as arguments and returns a new function that calls all.
 */
export function chain(...fns: AnyFunction[]) {
  return function (...args: unknown[]) {
    for (const currentFunction of fns) {
      if (typeof currentFunction === 'function') {
        currentFunction(...args);
      }
    }
  };
}
