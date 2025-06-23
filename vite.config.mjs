import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://localhost:5001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.VITE_APP_VERSION || process.env.npm_package_version || '0.5.0'),
    __BUILD_DATE__: JSON.stringify(process.env.VITE_BUILD_DATE || new Date().toISOString()),
    __COMMIT_HASH__: JSON.stringify(process.env.VITE_COMMIT_HASH || ''),
  },
  envPrefix: ['VITE_', 'npm_package_']
});
