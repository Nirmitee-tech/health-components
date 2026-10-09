import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:http';
import { afterEach, expect, it } from 'vitest';
// @ts-expect-error The deploy helper is also invoked directly by Node in Actions.
import { retainPagesAssets } from '../scripts/retain-pages-assets.mjs';
const folders: string[] = [];
afterEach(() => { folders.forEach(folder => rmSync(folder, { recursive: true, force: true })); folders.length = 0; });
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'careos-pages-')); folders.push(root);
  const current = join(root,'current'), previous = join(root,'previous');
  for (const base of [current,previous]) mkdirSync(join(base,'storybook/assets'),{recursive:true});
  writeFileSync(join(current,'storybook/assets/current.js'),'export const current = true;');
  writeFileSync(join(previous,'storybook/assets/old.js'),'export const old = true;');
  writeFileSync(join(previous,'storybook/assets/expired.js'),'expired');
  writeFileSync(join(previous,'storybook/assets-current.json'),JSON.stringify(['old.js','../private.txt']));
  writeFileSync(join(previous,'storybook/assets-retained.json'),'{}');
  return {current,previous};
}
it('retains only the previous generation without replacing the current build', () => {
  const {current,previous}=fixture();
  expect(retainPagesAssets(current,previous)).toBe(1);
  expect(readFileSync(join(current,'storybook/assets/old.js'),'utf8')).toContain('old = true');
  expect(existsSync(join(current,'storybook/assets/expired.js'))).toBe(false);
  expect(JSON.parse(readFileSync(join(current,'storybook/assets-current.json'),'utf8'))).toEqual(['current.js']);
});
it('serves the stale browser bundle URL and the new bundle from the same deployment', async () => {
  const {current,previous}=fixture(); retainPagesAssets(current,previous);
  const server=createServer((request,response) => {
    const file=join(current, request.url!.replace(/^\//,''));
    if(!existsSync(file)){response.writeHead(404);response.end();return;}
    response.setHeader('Content-Type','text/javascript');response.end(readFileSync(file));
  });
  await new Promise<void>(resolve => server.listen(0,'127.0.0.1',resolve));
  try {
    const address=server.address(); if(!address || typeof address==='string') throw new Error('No test server port');
    for(const file of ['old.js','current.js']) {
      const result=await fetch(`http://127.0.0.1:${address.port}/storybook/assets/${file}`);
      expect(result.status).toBe(200); expect(await result.text()).toContain('export const');
    }
  } finally { await new Promise<void>((resolve,reject)=>server.close(error => error ? reject(error) : resolve())); }
});
it('keeps a cached bundle through consecutive deployments within the retention window', () => {
  const {current,previous}=fixture(); retainPagesAssets(current,previous,0);
  const next=join(current,'..','next'); mkdirSync(join(next,'storybook/assets'),{recursive:true});
  writeFileSync(join(next,'storybook/assets/next.js'),'next');
  retainPagesAssets(next,current,1000);
  expect(existsSync(join(next,'storybook/assets/old.js'))).toBe(true);
});
it('drops expired retained bundles from the next clean deployment', () => {
  const {current,previous}=fixture(); retainPagesAssets(current,previous,0);
  const next=join(current,'..','next'); mkdirSync(join(next,'storybook/assets'),{recursive:true});
  writeFileSync(join(next,'storybook/assets/next.js'),'next');
  retainPagesAssets(next,current,60*60*1000+1);
  expect(existsSync(join(next,'storybook/assets/old.js'))).toBe(false);
  expect(existsSync(join(next,'storybook/assets/current.js'))).toBe(true);
});
it('recovers bundles from deployments created before expiry manifests existed', () => {
  const {current,previous}=fixture();
  rmSync(join(previous,'storybook/assets-retained.json'));
  retainPagesAssets(current,previous,0);
  expect(existsSync(join(current,'storybook/assets/expired.js'))).toBe(true);
});
