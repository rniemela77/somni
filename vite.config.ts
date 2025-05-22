import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';

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
}); 