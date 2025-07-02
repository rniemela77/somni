import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
import type { UserConfig } from 'vite';

export default defineConfig({
  plugins: [
    vue(),
    vueJsx()
  ],
  server: {
    port: 5173, // Customize the port if needed
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // Type-safe alias resolution
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia'],
  },
} satisfies UserConfig); 