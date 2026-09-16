<template>
  <!--
    `:fade-from-index="0"` dims the backdrop at every snap point.
    Omit it (default = last index) to only dim at full height.
  -->
  <DrawerRoot :snap-points="[0.35, 0.7, 1]" :fade-from-index="0">
    <DrawerTrigger class="trigger">Snap points</DrawerTrigger>

    <DrawerPortal>
      <DrawerOverlay />

      <DrawerContent>
        <DrawerHandle />
        <div class="drawer-inner">
          <DrawerTitle>Snap points</DrawerTitle>

          <DrawerDescription>
            Drag between 35% / 70% / 100%. Tap the handle to cycle.
          </DrawerDescription>

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
</script>
