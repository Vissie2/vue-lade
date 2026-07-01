// npm
import { createApp } from "vue";

// components
import App from "./App.vue";

// Demo playground styles (layout, buttons, typography).
import "./main.css";

// Required vue-lade styles (animations, snap-point transforms, overlay opacity).
import "../src/style.css";

// Example drawer styles — copy and adapt these in your own project.
import "./drawer.css";

createApp(App).mount("#app");
