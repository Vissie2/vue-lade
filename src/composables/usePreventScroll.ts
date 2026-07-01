// Ported from Vaul, which adapted it from
// https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/overlays/src/usePreventScroll.ts

import type { Ref } from "vue"
import { watch } from "vue"
import { isIOS } from "../browser.js"

const KEYBOARD_BUFFER = 24

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function chain(...callbacks: any[]): (...args: any[]) => void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    for (const callback of callbacks) {
      if (typeof callback === "function") {
        callback(...args)
      }
    }
  }
}

const visualViewport =
  typeof document !== "undefined" ? window.visualViewport : null

export function isScrollable(node: Element): boolean {
  const style = window.getComputedStyle(node)
  return /(auto|scroll)/.test(
    style.overflow + style.overflowX + style.overflowY,
  )
}

export function getScrollParent(node: Element): Element {
  if (isScrollable(node)) {
    node = (node.parentElement as HTMLElement)
  }

  while (node && !isScrollable(node)) {
    node = (node.parentElement as HTMLElement)
  }

  return node || document.scrollingElement || document.documentElement
}

// HTML input types that do not cause the software keyboard to appear.
const nonTextInputTypes = new Set([
  "checkbox",
  "radio",
  "range",
  "color",
  "file",
  "image",
  "button",
  "submit",
  "reset",
])

// The number of active usePreventScroll calls. Used to determine whether to revert
// back to the original page style/scroll position.
let preventScrollCount = 0
let restore: () => void | undefined

/**
 * Prevents scrolling on the document body while enabled, and on iOS repositions
 * focused inputs above the software keyboard rather than letting Safari scroll the
 * whole page. Port of Vaul's `usePreventScroll`.
 */
export function usePreventScroll(isDisabled: Ref<boolean>) {
  watch(
    isDisabled,
    (disabled, _prev, onCleanup) => {
      if (disabled) return

      preventScrollCount++
      if (preventScrollCount === 1) {
        if (isIOS()) {
          restore = preventScrollMobileSafari()
        }
      }

      onCleanup(() => {
        preventScrollCount--
        if (preventScrollCount === 0) {
          restore?.()
        }
      })
    },
    { immediate: true },
  )
}

function preventScrollMobileSafari() {
  let scrollable: Element
  let lastY = 0

  const onTouchStart = (e: TouchEvent) => {
    scrollable = getScrollParent(e.target as Element)
    if (
      scrollable === document.documentElement &&
      scrollable === document.body
    ) {
      return
    }
    lastY = e.changedTouches[0].pageY
  }

  const onTouchMove = (e: TouchEvent) => {
    if (
      !scrollable ||
      scrollable === document.documentElement ||
      scrollable === document.body
    ) {
      e.preventDefault()
      return
    }

    const y = e.changedTouches[0].pageY
    const scrollTop = scrollable.scrollTop
    const bottom = scrollable.scrollHeight - scrollable.clientHeight

    if (bottom === 0) {
      return
    }

    if ((scrollTop <= 0 && y > lastY) || (scrollTop >= bottom && y < lastY)) {
      e.preventDefault()
    }

    lastY = y
  }

  const onTouchEnd = (e: TouchEvent) => {
    const target = e.target as HTMLElement

    if (isInput(target) && target !== document.activeElement) {
      e.preventDefault()

      target.style.transform = "translateY(-2000px)"
      target.focus()
      requestAnimationFrame(() => {
        target.style.transform = ""
      })
    }
  }

  const onFocus = (e: FocusEvent) => {
    const target = e.target as HTMLElement
    if (isInput(target)) {
      target.style.transform = "translateY(-2000px)"
      requestAnimationFrame(() => {
        target.style.transform = ""

        if (visualViewport) {
          if (visualViewport.height < window.innerHeight) {
            requestAnimationFrame(() => {
              scrollIntoView(target)
            })
          } else {
            visualViewport.addEventListener(
              "resize",
              () => scrollIntoView(target),
              { once: true },
            )
          }
        }
      })
    }
  }

  const onWindowScroll = () => {
    window.scrollTo(0, 0)
  }

  const scrollX = window.pageXOffset
  const scrollY = window.pageYOffset

  const restoreStyles = chain(
    setStyle(
      document.documentElement,
      "paddingRight",
      `${window.innerWidth - document.documentElement.clientWidth}px`,
    ),
  )

  window.scrollTo(0, 0)

  const removeEvents = chain(
    addEvent(document, "touchstart", onTouchStart, {
      passive: false,
      capture: true,
    }),
    addEvent(document, "touchmove", onTouchMove, {
      passive: false,
      capture: true,
    }),
    addEvent(document, "touchend", onTouchEnd, {
      passive: false,
      capture: true,
    }),
    addEvent(document, "focus", onFocus, true),
    addEvent(window, "scroll", onWindowScroll),
  )

  return () => {
    restoreStyles()
    removeEvents()
    window.scrollTo(scrollX, scrollY)
  }
}

function setStyle(element: HTMLElement, style: string, value: string) {
  const cur = (element.style as unknown as Record<string, string>)[style]
  ;(element.style as unknown as Record<string, string>)[style] = value

  return () => {
    ;(element.style as unknown as Record<string, string>)[style] = cur
  }
}

function addEvent(
  target: EventTarget,
  event: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (ev: any) => any,
  options?: boolean | AddEventListenerOptions,
) {
  target.addEventListener(event, handler as EventListener, options)

  return () => {
    target.removeEventListener(event, handler as EventListener, options)
  }
}

function scrollIntoView(target: Element) {
  const root = document.scrollingElement || document.documentElement
  let node: Element | null = target
  while (node && node !== root) {
    const scrollable = getScrollParent(node)
    if (
      scrollable !== document.documentElement &&
      scrollable !== document.body &&
      scrollable !== node
    ) {
      const scrollableTop = scrollable.getBoundingClientRect().top
      const targetTop = node.getBoundingClientRect().top
      const targetBottom = node.getBoundingClientRect().bottom
      const keyboardHeight =
        scrollable.getBoundingClientRect().bottom + KEYBOARD_BUFFER

      if (targetBottom > keyboardHeight) {
        scrollable.scrollTop += targetTop - scrollableTop
      }
    }

    node = scrollable.parentElement
  }
}

export function isInput(target: Element) {
  return (
    (target instanceof HTMLInputElement &&
      !nonTextInputTypes.has(target.type)) ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  )
}
