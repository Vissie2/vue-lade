// npm
import type { ComputedRef, InjectionKey, Ref } from 'vue';
import { inject } from 'vue';

// core
import type { DrawerDirection } from '~/types';

export interface DrawerContext {
  drawerRef: Ref<HTMLElement | null>;
  overlayRef: Ref<HTMLElement | null>;
  onPress: (event: PointerEvent) => void;
  onRelease: (event: PointerEvent | null) => void;
  onDrag: (event: PointerEvent) => void;
  onNestedDrag: (event: PointerEvent, percentageDragged: number) => void;
  onNestedOpenChange: (open: boolean) => void;
  onNestedRelease: (event: PointerEvent, open: boolean) => void;
  dismissible: ComputedRef<boolean> | Ref<boolean>;
  isOpen: Ref<boolean>;
  isDragging: Ref<boolean>;
  keyboardIsOpen: Ref<boolean>;
  snapPointsOffset: ComputedRef<number[]> | Ref<number[]>;
  snapPoints:
    | Ref<Array<number | string> | undefined>
    | ComputedRef<Array<number | string> | undefined>;
  activeSnapPointIndex: ComputedRef<number | null> | Ref<number | null>;
  modal: ComputedRef<boolean> | Ref<boolean>;
  shouldFade: ComputedRef<boolean> | Ref<boolean>;
  activeSnapPoint: Ref<number | string | null> | ComputedRef<number | string | null | undefined>;
  setActiveSnapPoint: (open: number | string | null) => void;
  closeDrawer: (fromWithin?: boolean) => void;
  openDrawer: () => void;
  handleOpenChange: (open: boolean) => void;
  direction: ComputedRef<DrawerDirection> | Ref<DrawerDirection>;
  shouldScaleBackground: ComputedRef<boolean> | Ref<boolean>;
  setBackgroundColorOnScale: ComputedRef<boolean> | Ref<boolean>;
  noBodyStyles: ComputedRef<boolean> | Ref<boolean>;
  handleOnly: ComputedRef<boolean> | Ref<boolean>;
  container: Ref<HTMLElement | null | undefined> | ComputedRef<HTMLElement | null | undefined>;
  autoFocus: ComputedRef<boolean> | Ref<boolean>;
  shouldAnimate: Ref<boolean>;
  // accessibility ids registered by Title / Description
  titleId: Ref<string | undefined>;
  descriptionId: Ref<string | undefined>;
  // trigger element, used to restore focus on close
  triggerRef: Ref<HTMLElement | null>;
  emitDrag: (event: PointerEvent, percentageDragged: number) => void;
  emitRelease: (event: PointerEvent | null, open: boolean) => void;
}

export const DRAWER_CONTEXT_KEY: InjectionKey<DrawerContext> = Symbol('VaulDrawerContext');

export function useDrawerContext(): DrawerContext {
  const context = inject(DRAWER_CONTEXT_KEY, null);

  if (!context) {
    throw new Error('useDrawerContext must be used within a Drawer.Root');
  }

  return context;
}
