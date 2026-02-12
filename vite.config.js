import { resolve } from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/vanilla-js-amazon/" : "/",
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        home: resolve(__dirname, "src/pages/home/index.html"),
        product: resolve(__dirname, "src/pages/product/index.html"),
        checkout: resolve(__dirname, "src/pages/checkout/index.html"),
      },
    },
  },
}));
