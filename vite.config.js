import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true, // Nettoyer le dossier dist avant chaque build
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
    chunkSizeWarningLimit: 2000,
    minify: 'terser', // Minification pour la production
    sourcemap: false // Pas de sourcemaps en production
  },
  server: {
    port: 5173,
    host: true
  },
  resolve: {
    alias: {
      phaser: 'phaser/dist/phaser.esm.js'
    }
  },
  define: {
    CANVAS_RENDERER: JSON.stringify(true),
    WEBGL_RENDERER: JSON.stringify(true)
  }
});