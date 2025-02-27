import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    outDir: "dist",
    assetsInlineLimit: 4096,
  },
  server: {
    proxy: {
      "/api": {
        target: import.meta.env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
        withCredentials: true,
      },
    },
  },
});
