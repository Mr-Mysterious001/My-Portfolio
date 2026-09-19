import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2022",
    cssMinify: "lightningcss",
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 700
  },
  server: {\n    port: 5173,\n    strictPort: true,\n    proxy: { "/api": "http://localhost:3000" }\n  },
  preview: { port: 4173, strictPort: true }
});
