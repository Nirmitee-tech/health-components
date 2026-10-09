import { defineConfig } from 'tsup';
// @ts-expect-error plain ESM helper without types
import { careosCssEsbuildPlugin } from './scripts/css-utils.mjs';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'elements/index': 'src/elements/index.ts',
    'elements/register': 'src/elements/register.ts',
    'tokens/index': 'src/tokens/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: false,
  splitting: true,
  treeshake: true,
  target: 'es2020',
  external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.js' }),
  esbuildPlugins: [careosCssEsbuildPlugin(process.cwd())],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
