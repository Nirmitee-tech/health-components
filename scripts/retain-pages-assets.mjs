import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

/** Retains prior original assets so an open browser can finish loading its hashed bundles. */
export function retainPagesAssets(current, previous) {
  let retained = 0;
  for (const directory of ['assets', 'storybook/assets']) {
    const destination = join(current, directory);
    if (!existsSync(destination)) continue;
    const currentManifest = join(current, directory.replace(/assets$/, 'assets-current.json'));
    const currentFiles = existsSync(currentManifest) ? JSON.parse(readFileSync(currentManifest, 'utf8')) : readdirSync(destination).filter(file => /\.(js|css|woff2?|svg|png|jpg|webp)$/.test(file));
    const oldDirectory = join(previous, directory);
    const manifest = join(previous, directory.replace(/assets$/, 'assets-current.json'));
    const oldFiles = existsSync(manifest) ? JSON.parse(readFileSync(manifest, 'utf8')) : existsSync(oldDirectory) ? readdirSync(oldDirectory) : [];
    if (!Array.isArray(oldFiles)) throw new Error('Invalid previous asset manifest');
    mkdirSync(destination, { recursive: true });
    for (const file of oldFiles) {
      // The manifest may only name files directly inside the known asset directory.
      if (typeof file !== 'string' || basename(file) !== file || !/\.(js|css|woff2?|svg|png|jpg|webp)$/.test(file)) continue;
      const source = join(oldDirectory, file);
      const target = join(destination, file);
      if (!existsSync(target) && existsSync(source)) { copyFileSync(source, target); retained++; }
    }
    writeFileSync(join(current, directory.replace(/assets$/, 'assets-current.json')), JSON.stringify(currentFiles));
  }
  return retained;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [current, previous] = process.argv.slice(2);
  if (!current || !previous) throw new Error('Usage: retain-pages-assets.mjs <current-build> <previous-build>');
  console.log(`Retained ${retainPagesAssets(current, previous)} prior assets`);
}
