import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
  plugins: [vue()],
  root: "playground",
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
      "vue-lade": fileURLToPath(new URL("./src/index.ts", import.meta.url)),
    },
  },
})
