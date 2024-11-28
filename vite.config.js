import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173, // Customize the port if needed
  },
  resolve: {
    alias: {
      '@': '/src', // Optional: Simplify imports from the src folder
    },
  },
});
