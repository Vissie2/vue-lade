# vue-lade

A drawer/sheet/vaul component for Vue. — A port of [vaul](https://github.com/emilkowalski/vaul) created by Emil Kowalski.

- **Zero dependencies** — Uses Vue as a peer dependency;
- **Tiny** — 9.7 kB JS + 1.1 kB CSS, gzipped;
- **Faithful port** — The same API and behaviour as the React original.

## Install

```bash
npm install vue-lade
```

> [!IMPORTANT]
> `vue@^3.5` is required as a peer dependency.<br/>
> <sub>This is the minimum version because `useId()` is used for SSR-safe ARIA attribute wiring.</sub>

## Usage

Import the stylesheet once:

```ts
import "vue-lade/style.css";
```

Usage of the components:

```vue
<template>
  <DrawerRoot v-model:open="open">
    <DrawerPortal>
      <DrawerOverlay />

      <DrawerContent>
        <DrawerHandle />

        <h2>Title</h2>

        <p>Description</p>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<script setup lang="ts">
import {
  DrawerRoot,
  DrawerPortal,
  DrawerOverlay,
  // ...
} from "vue-lade";
</script>
```

If prefered, the `Drawer.*` namespace can be used instead:

```vue
<template>
  <Drawer.Root>
    <Drawer.Trigger>Open</Drawer.Trigger>

    <Drawer.Portal>
      <Drawer.Overlay />

      <Drawer.Content>
        <Drawer.Handle />

        <Drawer.Title>Title</Drawer.Title>

        <Drawer.Description>Description</Drawer.Description>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
</template>

<script setup lang="ts">
import { Drawer } from "vue-lade";
</script>
```

The components are without styles. It sets `data-vaul-*`
attributes and `--snap-point-height` / `--initial-transform` CSS variables; see
[`playground/drawer.css`](./playground/drawer.css) for an example set of styles per direction.

### Controlled open state

```vue
<DrawerRoot v-model:open="open"> … </DrawerRoot>
```

### Snap points

```vue
<DrawerRoot
  v-model:active-snap-point="snap"
  :snap-points="[0.35, 0.7, 1]"
  :fade-from-index="0"
> … </DrawerRoot>
```

## Props (`DrawerRoot`)

Mirrors React Vaul. Callbacks are emited. `open` and `activeSnapPoint` both support `v-model`.

| Prop                        | Type                                     | Default          |
| --------------------------- | ---------------------------------------- | ---------------- |
| `open` / `defaultOpen`      | `boolean`                                | — / `false`      |
| `snapPoints`                | `(number \| string)[]`                   | —                |
| `activeSnapPoint`           | `number \| string \| null`               | first snap point |
| `fadeFromIndex`             | `number`                                 | last snap point  |
| `snapToSequentialPoint`     | `boolean`                                | `false`          |
| `direction`                 | `'bottom' \| 'top' \| 'left' \| 'right'` | `'bottom'`       |
| `dismissible`               | `boolean`                                | `true`           |
| `modal`                     | `boolean`                                | `true`           |
| `handleOnly`                | `boolean`                                | `false`          |
| `closeThreshold`            | `number`                                 | `0.25`           |
| `scrollLockTimeout`         | `number`                                 | `100`            |
| `shouldScaleBackground`     | `boolean`                                | `false`          |
| `setBackgroundColorOnScale` | `boolean`                                | `true`           |
| `noBodyStyles`              | `boolean`                                | `false`          |
| `repositionInputs`          | `boolean`                                | `true`           |
| `disablePreventScroll`      | `boolean`                                | `true`           |
| `preventScrollRestoration`  | `boolean`                                | `false`          |
| `fixed`                     | `boolean`                                | `false`          |
| `nested`                    | `boolean`                                | `false`          |
| `autoFocus`                 | `boolean`                                | `false`          |
| `container`                 | `HTMLElement \| null`                    | `body`           |

## Emits (`DrawerRoot`)

| Event                    | Payload                         | Description                                                                     |
| ------------------------ | ------------------------------- | ------------------------------------------------------------------------------- |
| `update:open`            | `boolean`                       | Fired when the drawer opens or closes. Use with `v-model:open`.                 |
| `update:activeSnapPoint` | `number \| string \| null`      | Fired when the active snap point changes. Use with `v-model:active-snap-point`. |
| `drag`                   | `{ percentageDragged: number }` | Fired continuously while the user drags the drawer.                             |
| `release`                | `{ open: boolean }`             | Fired when the user releases the drag gesture.                                  |
| `close`                  | —                               | Fired after the drawer has fully closed.                                        |
| `animationEnd`           | `{ open: boolean }`             | Fired when the open/close CSS animation completes.                              |

> [!IMPORTANT]
> `shouldScaleBackground` requires a `data-vaul-drawer-wrapper` attribute on the element wrapping your app content (not the `#app` mount point itself). See [`playground/index.html`](./playground/index.html) for an example.

> [!NOTE]
> `disablePreventScroll` is inverted: the default `true` **enables** iOS scroll prevention, and `false` disables it. The name and default mirror React Vaul. It has no effect outside iOS Safari.

> [!NOTE]
> `as-child` is supported on the visual components (`Drawer.Trigger`, `Drawer.Overlay`, `Drawer.Content`, `Drawer.Close`). It delegates rendering and all props/attrs to a single child element instead of wrapping it.

## Alternatives

Two other Vue ports of the original [vaul](https://github.com/emilkowalski/vaul) exist:

- [**unovue/vaul-vue**](https://github.com/unovue/vaul-vue) — Unmaintained. Requires installing `reka-ui` library.
- [**unovue/reka-ui**](https://github.com/unovue/reka-ui) — Maintained. Requires installing the `reka-ui` library.

This package has no runtime dependencies and ships only what you need.

## License

[MIT](./LICENSE) © Vissie2
