import { fileURLToPath } from "node:url"
import { defineConfig } from "tsdown"

export default defineConfig({
  entry: "src/index.ts",
  format: "esm",
  platform: "browser",
  dts: true,
  minify: true,
  sourcemap: true,
  // vue is a peer dependency and is auto-externalized by tsdown.
  // Resolve the `~` alias in both the JS output and the generated .d.ts.
  alias: {
    "~": fileURLToPath(new URL("./src", import.meta.url)),
  },
  // Ship the stylesheet, which isn't imported by any .ts module.
  // `to` is a directory, so this produces dist/style.css.
  copy: [{ from: "src/style.css", to: "dist" }],
})
