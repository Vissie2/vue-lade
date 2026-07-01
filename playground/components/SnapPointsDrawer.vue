<template>
  <!--
    `:fade-from-index="0"` dims the backdrop at every snap point.
    Omit it (default = last index) to only dim at full height.
  -->
  <Drawer.Root :snap-points="[0.35, 0.7, 1]" :fade-from-index="0">
    <Drawer.Trigger class="trigger">Snap points</Drawer.Trigger>

    <Drawer.Portal>
      <Drawer.Overlay />

      <Drawer.Content>
        <Drawer.Handle />
        <div class="drawer-inner">
          <Drawer.Title>Snap points</Drawer.Title>

          <Drawer.Description>
            Drag between 35% / 70% / 100%. Tap the handle to cycle.
          </Drawer.Description>

          <Drawer.Close class="close">Close</Drawer.Close>
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
</template>

<script setup lang="ts">
// npm
import { Drawer } from "vue-lade";
</script>
