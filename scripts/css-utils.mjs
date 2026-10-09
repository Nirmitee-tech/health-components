/** Flattens local `@import './x.css';` statements into one stylesheet (no external tooling needed). */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export function flattenCss(file, seen = new Set()) {
  const abs = resolve(file);
  if (seen.has(abs)) return '';
  seen.add(abs);
  const text = readFileSync(abs, 'utf8');
  return text.replace(/@import\s+['"](\.{1,2}\/[^'"]+)['"]\s*;/g, (_, rel) => flattenCss(resolve(dirname(abs), rel), seen));
}

/** Component CSS for shadow roots: everything except the token definitions (custom properties inherit into shadow DOM). */
export function elementCss(root) {
  const seen = new Set([resolve(root, 'src/styles/tokens.css')]);
  return flattenCss(resolve(root, 'src/styles/index.css'), seen);
}

const virtualModules = (root) => ({
  'virtual:careos-element-css': () => elementCss(root),
  'virtual:careos-tokens-css': () => flattenCss(resolve(root, 'src/styles/tokens.css')),
});

/** esbuild plugin (tsup) serving the virtual CSS-text modules used by src/elements. */
export function careosCssEsbuildPlugin(root) {
  const mods = virtualModules(root);
  return {
    name: 'careos-css-text',
    setup(build) {
      build.onResolve({ filter: /^virtual:careos-/ }, (args) => ({ path: args.path, namespace: 'careos' }));
      build.onLoad({ filter: /.*/, namespace: 'careos' }, (args) => ({
        contents: `export default ${JSON.stringify(mods[args.path]())};`,
        loader: 'js',
      }));
    },
  };
}

/** Vite plugin (Vitest, Storybook, docs) serving the same virtual modules. */
export function careosCssVitePlugin(root) {
  const mods = virtualModules(root);
  return {
    name: 'careos-css-text',
    resolveId: (id) => (id in mods ? '\0' + id : null),
    load: (id) => (id.startsWith('\0virtual:careos-') ? `export default ${JSON.stringify(mods[id.slice(1)]())};` : null),
  };
}
