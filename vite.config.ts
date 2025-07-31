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
    host: '0.0.0.0', // Bind to all network interfaces
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // Type-safe alias resolution
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
  },
  build: {
    sourcemap: true,
    // Enable cache busting with content hashes
    rollupOptions: {
      output: {
        // Add content hash to chunk names for cache busting
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name || '')) {
            return `assets/css/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return `assets/fonts/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
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