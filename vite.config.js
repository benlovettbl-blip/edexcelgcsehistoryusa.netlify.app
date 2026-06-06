import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('questions.js')) {
            return 'questions-db';
          }
          if (id.includes('src/views.js')) {
            return 'views-logic';
          }
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
