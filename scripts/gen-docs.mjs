#!/usr/bin/env node
/**
 * Generates the component reference of the docs site (website/docs/components/**) from the source:
 *   - src/components/<Name>/README.md          guidelines (when to use, variants, accessibility, do and don't)
 *   - src/components/<Name>/<Name>.stories.tsx  live examples, with code extracted from each story
 *   - the components' TypeScript props          props tables (website/src/generated/props.json)
 *   - src/elements/manifest.generated.json      Web Component API (attributes, properties, events, slots)
 * Output is generated on every docs build; edit the sources above, never the generated pages.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';
import { flattenCss } from './css-utils.mjs';
import { components, root } from './lib/components-meta.mjs';

const site = resolve(root, 'website');
const outDir = resolve(site, 'docs/components');
const genDir = resolve(site, 'src/generated');
const compDir = resolve(root, 'src/components');

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
mkdirSync(genDir, { recursive: true });

const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
/** Storybook's id for a story: sanitize(title)--sanitize(storyNameFromExport(exportName)). */
const sbSanitize = (s) =>
  s
    .toLowerCase()
    .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
const storyName = (exp) => exp.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
const storyId = (title, exp) => `${sbSanitize(title)}--${sbSanitize(storyName(exp))}`;

/** Escape markdown prose for MDX: `{`, `}` and `<` outside code are literal text. */
function mdxSafe(md) {
  const out = [];
  let inFence = false;
  for (const line of md.split('\n')) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }
    out.push(
      line
        .split(/(`[^`]*`)/)
        .map((part, i) => (i % 2 ? part : part.replace(/[{}]/g, (c) => '\\' + c).replace(/</g, '&lt;')))
        .join('')
    );
  }
  return out.join('\n');
}

function parseReadme(md) {
  const lines = md.split('\n');
  const title = (lines[0] ?? '').replace(/^#\s*/, '').trim();
  const sections = [];
  let intro = [];
  let current = null;
  for (const line of lines.slice(1)) {
    const m = /^##\s+(.*)$/.exec(line);
    if (m) {
      current = { heading: m[1].trim(), body: [] };
      sections.push(current);
    } else if (current) current.body.push(line);
    else intro.push(line);
  }
  intro = intro.join('\n').trim();
  const summary = intro.split('\n\n')[0]?.trim() ?? '';
  const fromScreens = intro.split('\n\n').slice(1).join('\n\n').trim();
  return { title, summary, fromScreens, sections: sections.map((s) => ({ ...s, body: s.body.join('\n').trim() })) };
}

/* ---------- stories ---------- */
function dedent(text) {
  const lines = text.replace(/\t/g, '  ').split('\n');
  const indents = lines.slice(1).filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return [lines[0], ...lines.slice(1).map((l) => l.slice(min))].join('\n').trim();
}
function jsxFromArgs(componentName, argsObjects, src) {
  const attrs = new Map();
  let children = null;
  for (const obj of argsObjects) {
    if (!obj || !ts.isObjectLiteralExpression(obj)) continue;
    for (const p of obj.properties) {
      if (!ts.isPropertyAssignment(p)) continue;
      const name = p.name.getText(src).replace(/['"]/g, '');
      const init = p.initializer;
      if (ts.isCallExpression(init) && init.expression.getText(src) === 'fn') {
        attrs.delete(name);
        continue;
      }
      if (name === 'children') {
        children = ts.isStringLiteralLike(init) ? init.text : `{${init.getText(src)}}`;
        continue;
      }
      if (ts.isStringLiteralLike(init)) attrs.set(name, `${name}=${JSON.stringify(init.text)}`);
      else if (init.kind === ts.SyntaxKind.TrueKeyword) attrs.set(name, name);
      else attrs.set(name, `${name}={${init.getText(src)}}`);
    }
  }
  const a = [...attrs.values()];
  const open = a.length > 3 ? `<${componentName}\n  ${a.join('\n  ')}\n` : `<${componentName}${a.length ? ' ' + a.join(' ') : ''}`;
  if (children == null) return `${open}${a.length > 3 ? '' : ' '}/>`;
  return `${open}>${children}</${componentName}>`;
}
function parseStories(file, componentName) {
  const text = readFileSync(file, 'utf8');
  const src = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let title = '';
  let metaArgs = null;
  let metaComponent = componentName;
  const stories = [];
  const metaObject = (node) => {
    let n = node;
    while (n && (ts.isSatisfiesExpression(n) || ts.isAsExpression(n) || ts.isParenthesizedExpression(n))) n = n.expression;
    return n && ts.isObjectLiteralExpression(n) ? n : null;
  };
  const prop = (obj, name) => obj?.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText(src) === name)?.initializer;
  // The meta object is whatever `export default` points at (a variable name or an inline object).
  const defaultExport = src.statements.find(ts.isExportAssignment);
  const metaName = defaultExport && ts.isIdentifier(defaultExport.expression) ? defaultExport.expression.text : null;
  for (const st of src.statements) {
    if (ts.isVariableStatement(st)) {
      for (const d of st.declarationList.declarations) {
        const obj = metaObject(d.initializer);
        const exported = st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
        if (!exported && obj && d.name.getText(src) === metaName) {
          const t = prop(obj, 'title');
          title = t && ts.isStringLiteralLike(t) ? t.text : title;
          metaArgs = prop(obj, 'args') ?? null;
          const c = prop(obj, 'component');
          if (c) metaComponent = c.getText(src);
        } else if (exported && obj) {
          const name = d.name.getText(src);
          const render = prop(obj, 'render');
          const args = prop(obj, 'args');
          let code;
          if (render && (ts.isArrowFunction(render) || ts.isFunctionExpression(render))) {
            const body = render.body;
            if (ts.isParenthesizedExpression(body)) code = dedent(body.expression.getText(src));
            else if (!ts.isBlock(body)) code = dedent(body.getText(src));
            else code = dedent(render.getText(src));
          } else {
            code = jsxFromArgs(metaComponent, [metaArgs, args], src);
          }
          const nameProp = prop(obj, 'name');
          stories.push({
            exportName: name,
            label: nameProp && ts.isStringLiteralLike(nameProp) ? nameProp.text : storyName(name),
            code,
          });
        }
      }
    } else if (ts.isExportAssignment(st)) {
      const obj = metaObject(st.expression);
      if (obj && prop(obj, 'title')) {
        const t = prop(obj, 'title');
        title = t && ts.isStringLiteralLike(t) ? t.text : title;
        metaArgs = prop(obj, 'args') ?? metaArgs;
      }
    }
  }
  return { title, stories };
}

/* ---------- props.json and elements.json ---------- */
const parseDefault = (doc) => {
  const m = /;?\s*default:?\s+(.+?)\.?\s*$/i.exec(doc.split('\n')[0] ?? '');
  return m ? m[1].trim() : '';
};
const props = {};
for (const c of components) {
  props[c.name] = Object.entries(c.props).map(([name, p]) => ({
    name,
    type: p.type,
    required: !p.optional,
    default: parseDefault(p.doc),
    description: p.doc.replace(/;?\s*default:?\s+.+$/i, '').trim(),
    native: p.inherited,
  }));
}
// The full CareOS stylesheet as text, adopted into each preview's shadow root.
writeFileSync(
  resolve(genDir, 'careos-css.ts'),
  `/* GENERATED by scripts/gen-docs.mjs. */\nexport default ${JSON.stringify(flattenCss(resolve(root, 'src/styles/index.css')))};\n`
);
writeFileSync(resolve(genDir, 'props.json'), JSON.stringify(props, null, 2) + '\n');
const manifestPath = resolve(root, 'src/elements/manifest.generated.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : [];
writeFileSync(resolve(genDir, 'elements.json'), JSON.stringify(manifest, null, 2) + '\n');

/* ---------- pages ---------- */
const folders = readdirSync(compDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
const catalogue = [];
const groups = new Map();
for (const folder of folders.sort()) {
  const readmePath = resolve(compDir, folder, 'README.md');
  const storiesPath = resolve(compDir, folder, `${folder}.stories.tsx`);
  if (!existsSync(readmePath) || !existsSync(storiesPath)) continue;
  const readme = parseReadme(readFileSync(readmePath, 'utf8'));
  const { title, stories } = parseStories(storiesPath, folder);
  if (!title) continue;
  const [layer, group] = title.split('/');
  const groupSlug = slug(`${layer} ${group}`);
  const dir = resolve(outDir, groupSlug);
  mkdirSync(dir, { recursive: true });
  if (!groups.has(groupSlug)) groups.set(groupSlug, { label: `${group}`, layer, items: [] });
  groups.get(groupSlug).items.push(folder);

  const hasProps = Boolean(props[folder]);
  const element = manifest.find((m) => m.component === folder || m.aliases?.includes(folder));
  const guide = readme.sections.filter((s) => !/^(props|usage)$/i.test(s.heading));
  const usage = readme.sections.find((s) => /^usage$/i.test(s.heading));
  const firstStory = stories.find((s) => s.exportName !== 'Playground') ?? stories[0];
  const examples = stories.filter((s) => s.exportName !== 'Playground');
  const playground = stories.find((s) => s.exportName === 'Playground');

  const esc = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  const mdx = `---
title: ${folder}
sidebar_label: ${folder}
description: ${JSON.stringify(readme.summary)}
custom_edit_url: https://github.com/Nirmitee-tech/health-components/edit/main/src/components/${folder}/README.md
---

import * as stories from '@lib/components/${folder}/${folder}.stories';
import { ComponentHeader, StoryExample, PropsTable, ElementApi } from '@site/src/components/docs';

<ComponentHeader
  name="${folder}"
  layer="${layer}"
  group="${group}"
  summary={${JSON.stringify(readme.summary)}}
  storyId="${firstStory ? storyId(title, firstStory.exportName) : ''}"
  playgroundId="${playground ? storyId(title, playground.exportName) : ''}"
  tag="${element?.tag ?? ''}"
/>

${readme.fromScreens ? mdxSafe(readme.fromScreens) + '\n' : ''}
## Examples

${examples
  .map(
    (s) => `### ${s.label}

<StoryExample stories={stories} story="${s.exportName}" storyId="${storyId(title, s.exportName)}" code={\`${esc(s.code)}\`} />
`
  )
  .join('\n')}
${usage ? `## Usage\n\n${mdxSafe(usage.body)}\n` : ''}
${guide.map((s) => `## ${mdxSafe(s.heading)}\n\n${mdxSafe(s.body)}\n`).join('\n')}
## Props

${hasProps ? `<PropsTable component="${folder}" />` : 'See the related component for its props.'}

## Angular, Vue and HTML

${element ? `<ElementApi component="${element.component}" />` : 'This component is React-only.'}
`;
  writeFileSync(resolve(dir, `${folder}.mdx`), mdx);
  catalogue.push({ name: folder, layer, group, groupSlug, summary: readme.summary, tag: element?.tag ?? null });
}

let pos = 1;
const groupOrder = [...groups.entries()].sort(([a, ga], [b, gb]) =>
  ga.layer === gb.layer ? a.localeCompare(b) : ga.layer === 'Basic' ? -1 : 1
);
for (const [groupSlug, g] of groupOrder) {
  writeFileSync(
    resolve(outDir, groupSlug, '_category_.json'),
    JSON.stringify({ label: `${g.layer} · ${g.label}`, position: ++pos, collapsed: true }, null, 2) + '\n'
  );
}
writeFileSync(resolve(genDir, 'catalogue.json'), JSON.stringify(catalogue, null, 2) + '\n');
writeFileSync(
  resolve(outDir, 'index.mdx'),
  `---
title: Components
sidebar_position: 1
description: All ${catalogue.length} CareOS components, Basic and Complex.
---

import { Catalogue } from '@site/src/components/docs';

CareOS has **${catalogue.filter((c) => c.layer === 'Basic').length} Basic** components (generic controls with every variant, size and state) and
**${catalogue.filter((c) => c.layer === 'Complex').length} Complex** components (healthcare parts built only from the basic ones). Use the highest layer that fits:
build a claim screen from \`ClaimForm\`, not from \`TextField\`s in a table.

Every component is a React component (\`import { Button } from 'health-components'\`) and a custom element
(\`<co-button>\`) for Angular, Vue and plain HTML.

<Catalogue />
`
);
console.log(`docs: ${catalogue.length} component pages in ${groups.size} groups`);
