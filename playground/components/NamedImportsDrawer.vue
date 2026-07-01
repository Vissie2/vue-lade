<template>
  <DrawerRoot
    :direction="direction"
    :should-scale-background="shouldScaleBackground"
  >
    <DrawerTrigger class="trigger">Named imports</DrawerTrigger>

    <DrawerPortal>
      <DrawerOverlay />

      <DrawerContent>
        <DrawerHandle />

        <div class="drawer-inner">
          <h2>Named imports</h2>

          <p>
            This drawer uses named imports instead of the
            <code>Drawer.*</code> namespace. Both styles are equivalent.
          </p>

          <DrawerClose class="close">Close</DrawerClose>
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<script setup lang="ts">
defineProps<{
  direction?: "bottom" | "top" | "left" | "right";
  shouldScaleBackground?: boolean;
}>();

// npm
import {
  DrawerClose,
  DrawerContent,
  DrawerHandle,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTrigger,
} from "vue-lade";
</script>
