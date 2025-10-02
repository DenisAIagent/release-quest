import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        manualChunks: {
          phaser: ['phaser']
        }
      }
    },
    chunkSizeWarningLimit: 2000
  },
  server: {
    port: 5173,
    host: true
  },
  resolve: {
    alias: {
      phaser: 'phaser/dist/phaser.esm.js'
    }
  }
});