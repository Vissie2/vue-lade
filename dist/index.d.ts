import { ComputedRef, PropType, Ref, VNode } from "vue";

//#region src/types.d.ts
type DrawerDirection = 'top' | 'bottom' | 'left' | 'right';
interface SnapPoint {
  fraction: number;
  height: number;
}
//#endregion
//#region src/components/DrawerClose.d.ts
declare const DrawerClose: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  asChild: {
    type: BooleanConstructor;
    default: boolean;
  };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
  [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  asChild: {
    type: BooleanConstructor;
    default: boolean;
  };
}>> & Readonly<{}>, {
  asChild: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
//#region src/components/DrawerContent.d.ts
declare const DrawerContent: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  asChild: {
    type: BooleanConstructor;
    default: boolean;
  };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
  [key: string]: any;
}> | null, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  asChild: {
    type: BooleanConstructor;
    default: boolean;
  };
}>> & Readonly<{}>, {
  asChild: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
//#region src/components/DrawerDescription.d.ts
declare const DrawerDescription: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  asChild: {
    type: BooleanConstructor;
    default: boolean;
  };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
  [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  asChild: {
    type: BooleanConstructor;
    default: boolean;
  };
}>> & Readonly<{}>, {
  asChild: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
//#region src/components/DrawerHandle.d.ts
declare const DrawerHandle: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  preventCycle: {
    type: BooleanConstructor;
    default: boolean;
  };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
  [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  preventCycle: {
    type: BooleanConstructor;
    default: boolean;
  };
}>> & Readonly<{}>, {
  preventCycle: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
//#region src/components/DrawerNestedRoot.d.ts
/**
 * A `Drawer.Root` variant to be rendered inside another drawer. Wires the child's
 * drag/open/release events to the parent's nested-transform handlers so the parent
 * scales back as the child opens. Must be placed within another `Drawer.Root`.
 */
declare const DrawerNestedRoot: import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
  [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
//#region src/components/DrawerOverlay.d.ts
declare const DrawerOverlay: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  asChild: {
    type: BooleanConstructor;
    default: boolean;
  };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
  [key: string]: any;
}> | null, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  asChild: {
    type: BooleanConstructor;
    default: boolean;
  };
}>> & Readonly<{}>, {
  asChild: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
//#region src/components/DrawerPortal.d.ts
declare const DrawerPortal: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  to: {
    type: PropType<string | HTMLElement>;
    default: undefined;
  };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
  [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  to: {
    type: PropType<string | HTMLElement>;
    default: undefined;
  };
}>> & Readonly<{}>, {
  to: string | HTMLElement;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
//#region src/components/DrawerRoot.d.ts
declare const DrawerRoot: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  open: {
    type: BooleanConstructor;
    default: undefined;
  };
  defaultOpen: {
    type: BooleanConstructor;
    default: boolean;
  };
  activeSnapPoint: {
    type: PropType<string | number | null>;
    default: undefined;
  };
  snapPoints: {
    type: PropType<Array<number | string>>;
    default: undefined;
  };
  fadeFromIndex: {
    type: NumberConstructor;
    default: undefined;
  };
  closeThreshold: {
    type: NumberConstructor;
    default: number;
  };
  scrollLockTimeout: {
    type: NumberConstructor;
    default: number;
  };
  dismissible: {
    type: BooleanConstructor;
    default: boolean;
  };
  handleOnly: {
    type: BooleanConstructor;
    default: boolean;
  };
  modal: {
    type: BooleanConstructor;
    default: boolean;
  };
  nested: {
    type: BooleanConstructor;
    default: boolean;
  };
  direction: {
    type: PropType<DrawerDirection>;
    default: string;
  };
  noBodyStyles: {
    type: BooleanConstructor;
    default: boolean;
  };
  shouldScaleBackground: {
    type: BooleanConstructor;
    default: boolean;
  };
  setBackgroundColorOnScale: {
    type: BooleanConstructor;
    default: boolean;
  };
  fixed: {
    type: BooleanConstructor;
    default: boolean;
  };
  disablePreventScroll: {
    type: BooleanConstructor;
    default: boolean;
  };
  repositionInputs: {
    type: BooleanConstructor;
    default: boolean;
  };
  snapToSequentialPoint: {
    type: BooleanConstructor;
    default: boolean;
  };
  preventScrollRestoration: {
    type: BooleanConstructor;
    default: boolean;
  };
  autoFocus: {
    type: BooleanConstructor;
    default: boolean;
  };
  container: {
    type: PropType<HTMLElement | null>;
    default: undefined;
  };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
  [key: string]: any;
}>[] | undefined, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:open" | "update:activeSnapPoint" | "drag" | "release" | "close" | "animationEnd")[], "update:open" | "update:activeSnapPoint" | "drag" | "release" | "close" | "animationEnd", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  open: {
    type: BooleanConstructor;
    default: undefined;
  };
  defaultOpen: {
    type: BooleanConstructor;
    default: boolean;
  };
  activeSnapPoint: {
    type: PropType<string | number | null>;
    default: undefined;
  };
  snapPoints: {
    type: PropType<Array<number | string>>;
    default: undefined;
  };
  fadeFromIndex: {
    type: NumberConstructor;
    default: undefined;
  };
  closeThreshold: {
    type: NumberConstructor;
    default: number;
  };
  scrollLockTimeout: {
    type: NumberConstructor;
    default: number;
  };
  dismissible: {
    type: BooleanConstructor;
    default: boolean;
  };
  handleOnly: {
    type: BooleanConstructor;
    default: boolean;
  };
  modal: {
    type: BooleanConstructor;
    default: boolean;
  };
  nested: {
    type: BooleanConstructor;
    default: boolean;
  };
  direction: {
    type: PropType<DrawerDirection>;
    default: string;
  };
  noBodyStyles: {
    type: BooleanConstructor;
    default: boolean;
  };
  shouldScaleBackground: {
    type: BooleanConstructor;
    default: boolean;
  };
  setBackgroundColorOnScale: {
    type: BooleanConstructor;
    default: boolean;
  };
  fixed: {
    type: BooleanConstructor;
    default: boolean;
  };
  disablePreventScroll: {
    type: BooleanConstructor;
    default: boolean;
  };
  repositionInputs: {
    type: BooleanConstructor;
    default: boolean;
  };
  snapToSequentialPoint: {
    type: BooleanConstructor;
    default: boolean;
  };
  preventScrollRestoration: {
    type: BooleanConstructor;
    default: boolean;
  };
  autoFocus: {
    type: BooleanConstructor;
    default: boolean;
  };
  container: {
    type: PropType<HTMLElement | null>;
    default: undefined;
  };
}>> & Readonly<{
  "onUpdate:open"?: ((...args: any[]) => any) | undefined;
  "onUpdate:activeSnapPoint"?: ((...args: any[]) => any) | undefined;
  onDrag?: ((...args: any[]) => any) | undefined;
  onRelease?: ((...args: any[]) => any) | undefined;
  onClose?: ((...args: any[]) => any) | undefined;
  onAnimationEnd?: ((...args: any[]) => any) | undefined;
}>, {
  open: boolean;
  defaultOpen: boolean;
  activeSnapPoint: string | number | null;
  snapPoints: (string | number)[];
  fadeFromIndex: number;
  closeThreshold: number;
  scrollLockTimeout: number;
  dismissible: boolean;
  handleOnly: boolean;
  modal: boolean;
  nested: boolean;
  direction: DrawerDirection;
  noBodyStyles: boolean;
  shouldScaleBackground: boolean;
  setBackgroundColorOnScale: boolean;
  fixed: boolean;
  disablePreventScroll: boolean;
  repositionInputs: boolean;
  snapToSequentialPoint: boolean;
  preventScrollRestoration: boolean;
  autoFocus: boolean;
  container: HTMLElement | null;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
//#region src/components/DrawerTitle.d.ts
declare const DrawerTitle: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  asChild: {
    type: BooleanConstructor;
    default: boolean;
  };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
  [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  asChild: {
    type: BooleanConstructor;
    default: boolean;
  };
}>> & Readonly<{}>, {
  asChild: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
//#region src/components/DrawerTrigger.d.ts
declare const DrawerTrigger: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  asChild: {
    type: BooleanConstructor;
    default: boolean;
  };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
  [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  asChild: {
    type: BooleanConstructor;
    default: boolean;
  };
}>> & Readonly<{}>, {
  asChild: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
//#region src/context.d.ts
interface DrawerContext {
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
  snapPoints: Ref<Array<number | string> | undefined> | ComputedRef<Array<number | string> | undefined>;
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
  titleId: Ref<string | undefined>;
  descriptionId: Ref<string | undefined>;
  triggerRef: Ref<HTMLElement | null>;
  emitDrag: (event: PointerEvent, percentageDragged: number) => void;
  emitRelease: (event: PointerEvent | null, open: boolean) => void;
}
declare function useDrawerContext(): DrawerContext;
//#endregion
//#region src/composables/useDrawer.d.ts
interface DrawerRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  activeSnapPoint?: number | string | null;
  snapPoints?: Array<number | string>;
  fadeFromIndex?: number;
  closeThreshold?: number;
  scrollLockTimeout?: number;
  dismissible?: boolean;
  handleOnly?: boolean;
  modal?: boolean;
  nested?: boolean;
  direction?: DrawerDirection;
  noBodyStyles?: boolean;
  shouldScaleBackground?: boolean;
  setBackgroundColorOnScale?: boolean;
  fixed?: boolean;
  disablePreventScroll?: boolean;
  repositionInputs?: boolean;
  snapToSequentialPoint?: boolean;
  preventScrollRestoration?: boolean;
  autoFocus?: boolean;
  container?: HTMLElement | null;
}
//#endregion
//#region src/primitive.d.ts
/**
 * Minimal render-delegation primitive. With `as-child`, it merges its attrs/handlers
 * onto the single child VNode (Vue's `cloneVNode` merges class/style/`on*`); otherwise
 * it renders `as` (default `div`). Equivalent to Radix's `asChild` / reka-ui Primitive.
 */
declare const Primitive: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  asChild: {
    type: BooleanConstructor;
    default: boolean;
  };
  as: {
    type: PropType<string | object>;
    default: string;
  };
}>, () => VNode<import("vue").RendererNode, import("vue").RendererElement, {
  [key: string]: any;
}> | null, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  asChild: {
    type: BooleanConstructor;
    default: boolean;
  };
  as: {
    type: PropType<string | object>;
    default: string;
  };
}>> & Readonly<{}>, {
  asChild: boolean;
  as: string | object;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
//#region src/index.d.ts
/**
 * Compound-component namespace, mirroring React Vaul's `Drawer.*` API.
 *
 * ```ts
 * import { Drawer } from 'vue-lade'
 * // <Drawer.Root> <Drawer.Trigger/> <Drawer.Portal> ... </Drawer.Portal> </Drawer.Root>
 * ```
 */
declare const Drawer: {
  Root: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    open: {
      type: BooleanConstructor;
      default: undefined;
    };
    defaultOpen: {
      type: BooleanConstructor;
      default: boolean;
    };
    activeSnapPoint: {
      type: import("vue").PropType<string | number | null>;
      default: undefined;
    };
    snapPoints: {
      type: import("vue").PropType<Array<number | string>>;
      default: undefined;
    };
    fadeFromIndex: {
      type: NumberConstructor;
      default: undefined;
    };
    closeThreshold: {
      type: NumberConstructor;
      default: number;
    };
    scrollLockTimeout: {
      type: NumberConstructor;
      default: number;
    };
    dismissible: {
      type: BooleanConstructor;
      default: boolean;
    };
    handleOnly: {
      type: BooleanConstructor;
      default: boolean;
    };
    modal: {
      type: BooleanConstructor;
      default: boolean;
    };
    nested: {
      type: BooleanConstructor;
      default: boolean;
    };
    direction: {
      type: import("vue").PropType<DrawerDirection>;
      default: string;
    };
    noBodyStyles: {
      type: BooleanConstructor;
      default: boolean;
    };
    shouldScaleBackground: {
      type: BooleanConstructor;
      default: boolean;
    };
    setBackgroundColorOnScale: {
      type: BooleanConstructor;
      default: boolean;
    };
    fixed: {
      type: BooleanConstructor;
      default: boolean;
    };
    disablePreventScroll: {
      type: BooleanConstructor;
      default: boolean;
    };
    repositionInputs: {
      type: BooleanConstructor;
      default: boolean;
    };
    snapToSequentialPoint: {
      type: BooleanConstructor;
      default: boolean;
    };
    preventScrollRestoration: {
      type: BooleanConstructor;
      default: boolean;
    };
    autoFocus: {
      type: BooleanConstructor;
      default: boolean;
    };
    container: {
      type: import("vue").PropType<HTMLElement | null>;
      default: undefined;
    };
  }>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
  }>[] | undefined, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:open" | "update:activeSnapPoint" | "drag" | "release" | "close" | "animationEnd")[], "update:open" | "update:activeSnapPoint" | "drag" | "release" | "close" | "animationEnd", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    open: {
      type: BooleanConstructor;
      default: undefined;
    };
    defaultOpen: {
      type: BooleanConstructor;
      default: boolean;
    };
    activeSnapPoint: {
      type: import("vue").PropType<string | number | null>;
      default: undefined;
    };
    snapPoints: {
      type: import("vue").PropType<Array<number | string>>;
      default: undefined;
    };
    fadeFromIndex: {
      type: NumberConstructor;
      default: undefined;
    };
    closeThreshold: {
      type: NumberConstructor;
      default: number;
    };
    scrollLockTimeout: {
      type: NumberConstructor;
      default: number;
    };
    dismissible: {
      type: BooleanConstructor;
      default: boolean;
    };
    handleOnly: {
      type: BooleanConstructor;
      default: boolean;
    };
    modal: {
      type: BooleanConstructor;
      default: boolean;
    };
    nested: {
      type: BooleanConstructor;
      default: boolean;
    };
    direction: {
      type: import("vue").PropType<DrawerDirection>;
      default: string;
    };
    noBodyStyles: {
      type: BooleanConstructor;
      default: boolean;
    };
    shouldScaleBackground: {
      type: BooleanConstructor;
      default: boolean;
    };
    setBackgroundColorOnScale: {
      type: BooleanConstructor;
      default: boolean;
    };
    fixed: {
      type: BooleanConstructor;
      default: boolean;
    };
    disablePreventScroll: {
      type: BooleanConstructor;
      default: boolean;
    };
    repositionInputs: {
      type: BooleanConstructor;
      default: boolean;
    };
    snapToSequentialPoint: {
      type: BooleanConstructor;
      default: boolean;
    };
    preventScrollRestoration: {
      type: BooleanConstructor;
      default: boolean;
    };
    autoFocus: {
      type: BooleanConstructor;
      default: boolean;
    };
    container: {
      type: import("vue").PropType<HTMLElement | null>;
      default: undefined;
    };
  }>> & Readonly<{
    "onUpdate:open"?: ((...args: any[]) => any) | undefined;
    "onUpdate:activeSnapPoint"?: ((...args: any[]) => any) | undefined;
    onDrag?: ((...args: any[]) => any) | undefined;
    onRelease?: ((...args: any[]) => any) | undefined;
    onClose?: ((...args: any[]) => any) | undefined;
    onAnimationEnd?: ((...args: any[]) => any) | undefined;
  }>, {
    open: boolean;
    defaultOpen: boolean;
    activeSnapPoint: string | number | null;
    snapPoints: (string | number)[];
    fadeFromIndex: number;
    closeThreshold: number;
    scrollLockTimeout: number;
    dismissible: boolean;
    handleOnly: boolean;
    modal: boolean;
    nested: boolean;
    direction: DrawerDirection;
    noBodyStyles: boolean;
    shouldScaleBackground: boolean;
    setBackgroundColorOnScale: boolean;
    fixed: boolean;
    disablePreventScroll: boolean;
    repositionInputs: boolean;
    snapToSequentialPoint: boolean;
    preventScrollRestoration: boolean;
    autoFocus: boolean;
    container: HTMLElement | null;
  }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
  NestedRoot: import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
  }>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
  Trigger: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    asChild: {
      type: BooleanConstructor;
      default: boolean;
    };
  }>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
  }>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    asChild: {
      type: BooleanConstructor;
      default: boolean;
    };
  }>> & Readonly<{}>, {
    asChild: boolean;
  }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
  Portal: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    to: {
      type: import("vue").PropType<string | HTMLElement>;
      default: undefined;
    };
  }>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
  }>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    to: {
      type: import("vue").PropType<string | HTMLElement>;
      default: undefined;
    };
  }>> & Readonly<{}>, {
    to: string | HTMLElement;
  }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
  Overlay: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    asChild: {
      type: BooleanConstructor;
      default: boolean;
    };
  }>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
  }> | null, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    asChild: {
      type: BooleanConstructor;
      default: boolean;
    };
  }>> & Readonly<{}>, {
    asChild: boolean;
  }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
  Content: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    asChild: {
      type: BooleanConstructor;
      default: boolean;
    };
  }>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
  }> | null, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    asChild: {
      type: BooleanConstructor;
      default: boolean;
    };
  }>> & Readonly<{}>, {
    asChild: boolean;
  }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
  Handle: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    preventCycle: {
      type: BooleanConstructor;
      default: boolean;
    };
  }>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
  }>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    preventCycle: {
      type: BooleanConstructor;
      default: boolean;
    };
  }>> & Readonly<{}>, {
    preventCycle: boolean;
  }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
  Title: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    asChild: {
      type: BooleanConstructor;
      default: boolean;
    };
  }>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
  }>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    asChild: {
      type: BooleanConstructor;
      default: boolean;
    };
  }>> & Readonly<{}>, {
    asChild: boolean;
  }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
  Description: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    asChild: {
      type: BooleanConstructor;
      default: boolean;
    };
  }>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
  }>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    asChild: {
      type: BooleanConstructor;
      default: boolean;
    };
  }>> & Readonly<{}>, {
    asChild: boolean;
  }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
  Close: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    asChild: {
      type: BooleanConstructor;
      default: boolean;
    };
  }>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
  }>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    asChild: {
      type: BooleanConstructor;
      default: boolean;
    };
  }>> & Readonly<{}>, {
    asChild: boolean;
  }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
};
//#endregion
export { Drawer, DrawerClose, DrawerContent, type DrawerContext, DrawerDescription, type DrawerDirection, DrawerHandle, DrawerNestedRoot, DrawerOverlay, DrawerPortal, DrawerRoot, type DrawerRootProps, DrawerTitle, DrawerTrigger, Primitive, type SnapPoint, useDrawerContext };
//# sourceMappingURL=index.d.ts.map