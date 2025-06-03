import { defineConfig } from 'vite';

export default defineConfig({
  // tu configuración existente
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'DYNAMIC_IMPORT') return;
        warn(warning);
      }
    }
  }
});