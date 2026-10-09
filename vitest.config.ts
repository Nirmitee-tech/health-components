import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
// @ts-expect-error plain ESM helper without types
import { careosCssVitePlugin } from './scripts/css-utils.mjs';

export default defineConfig({
  resolve: { dedupe: ['react', 'react-dom'] },
  plugins: [react(), careosCssVitePlugin(process.cwd())],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'test/**/*.test.{ts,tsx}'],
    css: false,
    coverage: { provider: 'v8', include: ['src/**/*.{ts,tsx}'], exclude: ['src/**/*.stories.tsx', 'src/**/*.test.tsx'] },
  },
});
