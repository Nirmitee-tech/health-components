#!/usr/bin/env node
/** Writes the distributable stylesheets and token files into dist/. */
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { flattenCss } from './css-utils.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
mkdirSync(dist, { recursive: true });

const banner = (what) => `/*! health-components (CareOS) ${what} | MIT */\n`;
writeFileSync(resolve(dist, 'styles.css'), banner('tokens + components') + flattenCss(resolve(root, 'src/styles/index.css')));
writeFileSync(resolve(dist, 'tokens.css'), banner('tokens') + flattenCss(resolve(root, 'src/styles/tokens.css')));
writeFileSync(
  resolve(dist, 'components.css'),
  banner('components without tokens') +
    flattenCss(resolve(root, 'src/styles/index.css'), new Set([resolve(root, 'src/styles/tokens.css')]))
);
copyFileSync(resolve(root, 'src/styles/fonts.css'), resolve(dist, 'fonts.css'));
copyFileSync(resolve(root, 'src/tokens/tokens.json'), resolve(dist, 'tokens.json'));
console.log('css: dist/styles.css, dist/tokens.css, dist/components.css, dist/fonts.css, dist/tokens.json');
