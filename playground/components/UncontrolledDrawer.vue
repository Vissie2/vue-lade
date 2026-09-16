<template>
  <DrawerRoot :direction="direction" :should-scale-background="shouldScaleBackground">
    <DrawerTrigger class="trigger">Open drawer</DrawerTrigger>

    <DrawerPortal>
      <DrawerOverlay />

      <DrawerContent>
        <DrawerHandle v-if="direction === 'bottom' || direction === 'top'" />

        <div class="drawer-inner">
          <DrawerTitle>Unstyled drawer</DrawerTitle>

          <DrawerDescription>
            Drag me down to dismiss, or use the buttons below.
          </DrawerDescription>

          <p>Focus is trapped here. Try Tab / Shift+Tab. Escape closes.</p>

          <input
            placeholder="a focusable input"
            style="padding: 8px; width: 100%; margin-bottom: 12px"
          />

          <DrawerClose class="close">Close</DrawerClose>
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<script setup lang="ts">
// npm
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from 'vue-lade';

defineProps<{
  direction?: 'bottom' | 'top' | 'left' | 'right';
  shouldScaleBackground?: boolean;
}>();
</script>
