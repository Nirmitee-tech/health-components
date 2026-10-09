#!/usr/bin/env node
/**
 * dist/cdn/careos-elements.js: one self-contained, minified script (React included) that registers every
 * CareOS custom element. For plain HTML pages, CMS templates and quick prototypes:
 *   <script src="https://cdn.jsdelivr.net/npm/health-components@1/dist/cdn/careos-elements.js"></script>
 */
import { build } from 'esbuild';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { careosCssEsbuildPlugin } from './css-utils.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
await build({
  entryPoints: [resolve(root, 'src/elements/register.ts')],
  outfile: resolve(root, 'dist/cdn/careos-elements.js'),
  bundle: true,
  format: 'iife',
  minify: true,
  sourcemap: true,
  target: 'es2020',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'none',
  banner: { js: '/*! health-components (CareOS) custom elements | MIT | includes React (MIT) */' },
  plugins: [careosCssEsbuildPlugin(root)],
  logLevel: 'warning',
});
console.log('cdn: dist/cdn/careos-elements.js');
