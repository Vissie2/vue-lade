<template>
  <main>
    <h1>Playground</h1>
    <p>
      vue-lade is a zero-dependency Vue 3 port of vaul. Drag the drawer, flick it, press Escape,
      click the overlay, or tab through it.
    </p>

    <div class="section">
      <label>
        Direction

        <select v-model="direction">
          <option>bottom</option>
          <option>top</option>
          <option>left</option>
          <option>right</option>
        </select>
      </label>

      <label class="checkbox-label">
        <input type="checkbox" v-model="shouldScaleBackground" />

        Scale background
      </label>
    </div>

    <div class="row">
      <UncontrolledDrawer :direction="direction" :should-scale-background="shouldScaleBackground" />

      <SnapPointsDrawer />

      <ControlledDrawer :direction="direction" :should-scale-background="shouldScaleBackground" />

      <NamedImportsDrawer :direction="direction" :should-scale-background="shouldScaleBackground" />
    </div>
  </main>
</template>

<script setup lang="ts">
// npm
import { ref } from 'vue';

// components
import ControlledDrawer from './components/ControlledDrawer.vue';
import NamedImportsDrawer from './components/NamedImportsDrawer.vue';
import SnapPointsDrawer from './components/SnapPointsDrawer.vue';
import UncontrolledDrawer from './components/UncontrolledDrawer.vue';

const direction = ref<'bottom' | 'top' | 'left' | 'right'>('bottom');
const shouldScaleBackground = ref(true);
</script>
