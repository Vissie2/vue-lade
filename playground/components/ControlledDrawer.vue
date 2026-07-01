<template>
  <button class="trigger" @click="open = true">Open controlled</button>

  <Drawer.Root v-model:open="open" :direction="direction" :should-scale-background="shouldScaleBackground">
    <Drawer.Portal>
      <Drawer.Overlay />

      <Drawer.Content>
        <Drawer.Handle />

        <div class="drawer-inner">
          <Drawer.Title>Controlled via v-model:open</Drawer.Title>
          
          <Drawer.Description>open = {{ open }}</Drawer.Description>
          
          <Drawer.Close class="close">Close</Drawer.Close>
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
</template>

<script setup lang="ts">
// npm
import { ref } from "vue";
import { Drawer } from "vue-lade";

defineProps<{
  direction?: 'bottom' | 'top' | 'left' | 'right';
  shouldScaleBackground?: boolean;
}>();

const open = ref(false);
</script>
