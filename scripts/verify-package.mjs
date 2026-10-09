#!/usr/bin/env node
/** Checks the built package: every export path exists, and the ESM, CJS, tokens and elements entries load in Node. */
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const errors = [];
const files = new Set();
const walk = (v) => (typeof v === 'string' ? files.add(v) : v && typeof v === 'object' && Object.values(v).forEach(walk));
walk(pkg.exports);
for (const f of files) if (!existsSync(resolve(root, f))) errors.push(`missing export target ${f}`);

const esm = await import(pathToFileURL(resolve(root, 'dist/index.js')).href);
const cjs = createRequire(import.meta.url)(resolve(root, 'dist/index.cjs'));
for (const name of ['Button', 'ThemeProvider', 'Icon', 'tokens']) {
  if (!esm[name]) errors.push(`ESM export ${name} missing`);
  if (!cjs[name]) errors.push(`CJS export ${name} missing`);
}
const esmCount = Object.keys(esm).length;
if (Object.keys(cjs).length !== esmCount) errors.push(`ESM (${esmCount}) and CJS (${Object.keys(cjs).length}) export different names`);
const tokens = await import(pathToFileURL(resolve(root, 'dist/tokens/index.js')).href);
if (tokens.colorValue('primary', 'rail') !== '#3B4FD8') errors.push('tokens.colorValue is wrong');
const elements = await import(pathToFileURL(resolve(root, 'dist/elements/index.js')).href);
if (!elements.elementSpecs?.length) errors.push('no element specs');
const css = readFileSync(resolve(root, 'dist/styles.css'), 'utf8');
if (/@import\s+['"]\./.test(css)) errors.push('styles.css still has local @import');
if (!css.includes('--co-primary') || !css.includes('.co-btn')) errors.push('styles.css incomplete');

if (errors.length) {
  console.error('verify-package failed:\n  ' + errors.join('\n  '));
  process.exit(1);
}
console.log(`verify-package: ok (${esmCount} exports, ${elements.elementSpecs.length} elements, ${files.size} export files)`);
