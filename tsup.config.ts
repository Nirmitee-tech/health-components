import { defineConfig, type Options } from 'tsup';
// @ts-expect-error plain ESM helper without types
import { careosCssEsbuildPlugin } from './scripts/css-utils.mjs';

const shared: Options = {
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: false,
  treeshake: true,
  target: 'es2020',
  external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.js' }),
  esbuildPlugins: [careosCssEsbuildPlugin(process.cwd())],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
};

export default defineConfig([
  // React components and tokens: shared chunks so `health-components` and `health-components/tokens` share code.
  { ...shared, entry: { index: 'src/index.ts', 'tokens/index': 'src/tokens/index.ts' }, splitting: true },
  // Custom elements: one self-contained module (React stays external), so Angular/Vue bundlers see no bare chunk imports.
  { ...shared, entry: { 'elements/index': 'src/elements/index.ts' }, splitting: false },
  // `register` is a one-line side effect that imports the elements module above.
  {
    ...shared,
    entry: { 'elements/register': 'src/elements/register.ts' },
    dts: true,
    splitting: false,
    esbuildPlugins: [
      ...shared.esbuildPlugins!,
      {
        name: 'register-external-index',
        setup(build) {
          build.onResolve({ filter: /^\.\/index$/ }, (args) => ({
            path: args.kind === 'require-call' ? './index.cjs' : './index.js',
            external: true,
          }));
        },
      },
    ],
  },
]);
