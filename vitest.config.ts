import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setupTests.ts'],
    css: true,
    coverage: {
      reporter: ['text', 'lcov'],
      provider: 'v8'
    }
  }
});
