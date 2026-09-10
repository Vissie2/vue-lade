export type DrawerDirection = 'top' | 'bottom' | 'left' | 'right';

export interface SnapPoint {
  fraction: number;
  height: number;
}

// @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any) => any;
