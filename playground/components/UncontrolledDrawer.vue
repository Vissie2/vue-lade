<template>
  <Drawer.Root :direction="direction" :should-scale-background="shouldScaleBackground">
    <Drawer.Trigger class="trigger">Open drawer</Drawer.Trigger>

    <Drawer.Portal>
      <Drawer.Overlay />

      <Drawer.Content>
        <Drawer.Handle v-if="direction === 'bottom' || direction === 'top'" />

        <div class="drawer-inner">
          <Drawer.Title>Unstyled drawer</Drawer.Title>

          <Drawer.Description>
            Drag me down to dismiss, or use the buttons below.
          </Drawer.Description>

          <p>Focus is trapped here. Try Tab / Shift+Tab. Escape closes.</p>

          <input
            placeholder="a focusable input"
            style="padding: 8px; width: 100%; margin-bottom: 12px"
          />

          <Drawer.Close class="close">Close</Drawer.Close>
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
</template>

<script setup lang="ts">
// npm
import { Drawer } from 'vue-lade';

defineProps<{
  direction?: 'bottom' | 'top' | 'left' | 'right';
  shouldScaleBackground?: boolean;
}>();
</script>
