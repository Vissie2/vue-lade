<template>
  <button class="trigger" @click="open = true">Open controlled</button>

  <DrawerRoot
    v-model:open="open"
    :direction="direction"
    :should-scale-background="shouldScaleBackground"
  >
    <DrawerPortal>
      <DrawerOverlay />

      <DrawerContent>
        <DrawerHandle />

        <div class="drawer-inner">
          <DrawerTitle>Controlled via v-model:open</DrawerTitle>

          <DrawerDescription>open = {{ open }}</DrawerDescription>

          <DrawerClose class="close">Close</DrawerClose>
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<script setup lang="ts">
// npm
import { ref } from 'vue';
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
} from 'vue-lade';

defineProps<{
  direction?: 'bottom' | 'top' | 'left' | 'right';
  shouldScaleBackground?: boolean;
}>();

const open = ref(false);
</script>
