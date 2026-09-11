import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    build: {
      rollupOptions: {
        external: ["@qvac/sdk"]
      },
      rolldownOptions: {
        external: ["@qvac/sdk"]
      }
    }
  },
  nitro: {
    preset: 'node-server'
  }
});
