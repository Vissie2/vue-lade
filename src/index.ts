// components
import { DrawerClose } from "~/components/DrawerClose";
import { DrawerContent } from "~/components/DrawerContent";
import { DrawerDescription } from "~/components/DrawerDescription";
import { DrawerHandle } from "~/components/DrawerHandle";
import { DrawerNestedRoot } from "~/components/DrawerNestedRoot";
import { DrawerOverlay } from "~/components/DrawerOverlay";
import { DrawerPortal } from "~/components/DrawerPortal";
import { DrawerRoot } from "~/components/DrawerRoot";
import { DrawerTitle } from "~/components/DrawerTitle";
import { DrawerTrigger } from "~/components/DrawerTrigger";

export {
  DrawerRoot,
  DrawerNestedRoot,
  DrawerTrigger,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHandle,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
};

/**
 * Compound-component namespace, mirroring React Vaul's `Drawer.*` API.
 *
 * ```ts
 * import { Drawer } from 'vue-lade'
 * // <Drawer.Root> <Drawer.Trigger/> <Drawer.Portal> ... </Drawer.Portal> </Drawer.Root>
 * ```
 */
export const Drawer = {
  Root: DrawerRoot,
  NestedRoot: DrawerNestedRoot,
  Trigger: DrawerTrigger,
  Portal: DrawerPortal,
  Overlay: DrawerOverlay,
  Content: DrawerContent,
  Handle: DrawerHandle,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
};

export type { DrawerContext } from "~/context";
export type { DrawerDirection, SnapPoint } from "~/types";
export type { DrawerRootProps } from "~/composables/useDrawer";

export { useDrawerContext } from "~/context";
export { Primitive } from "~/primitive";
