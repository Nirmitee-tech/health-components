#!/usr/bin/env node
/**
 * Writes dist/manifest.agents.json: one machine-readable entry per component for AI coding agents and tooling.
 * Built from the real sources: TypeScript props (names, types, required, defaults, docs), each README (summary, when to
 * use and not use, accessibility), the story title (layer and group) and the custom-element registry (tag, events, slots).
 * Usage: node scripts/gen-agents-manifest.mjs [outFile]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { components, root } from './lib/components-meta.mjs';

const out = resolve(root, process.argv[2] ?? 'dist/manifest.agents.json');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const elements = JSON.parse(readFileSync(resolve(root, 'src/elements/manifest.generated.json'), 'utf8'));

function readme(name) {
  const p = resolve(root, 'src/components', name, 'README.md');
  if (!existsSync(p)) return null;
  const md = readFileSync(p, 'utf8');
  const sections = {};
  let cur = '_intro';
  for (const line of md.split('\n').slice(1)) {
    const m = /^##\s+(.*)$/.exec(line);
    if (m) cur = m[1].trim().toLowerCase();
    else (sections[cur] ??= []).push(line);
  }
  const text = (k) => (sections[k] ?? []).join('\n').trim();
  const bullets = (k) =>
    text(k)
      .split('\n')
      .filter((l) => /^\s*-\s+/.test(l))
      .map((l) => l.replace(/^\s*-\s+/, '').trim());
  const intro = text('_intro');
  return {
    summary: intro.split('\n\n')[0]?.trim() ?? '',
    whenToUse: bullets('when to use'),
    whenNotToUse: bullets('when not to use'),
    accessibility: bullets('accessibility'),
    usage: (/```(?:jsx|tsx)?\n([\s\S]*?)```/.exec(text('usage')) ?? [])[1]?.trim() ?? null,
  };
}

function storyTitle(name) {
  const p = resolve(root, 'src/components', name, `${name}.stories.tsx`);
  if (!existsSync(p)) return null;
  return /title:\s*['"]([^'"]+)['"]/.exec(readFileSync(p, 'utf8'))?.[1] ?? null;
}

const parseDefault = (doc) => /;?\s*default:?\s+(.+?)\.?\s*$/i.exec(doc.split('\n')[0] ?? '')?.[1]?.trim() ?? null;
const allowed = (type) => {
  const parts = type.split('|').map((s) => s.trim());
  return parts.length > 1 && parts.every((p) => /^'[^']*'$/.test(p)) ? parts.map((p) => p.slice(1, -1)) : null;
};

const entries = [];
for (const c of components) {
  const title = storyTitle(c.name);
  const doc = readme(c.name);
  if (!title && !doc) continue; // helpers exported alongside a component (KebabMenu, StatusTag...) are listed as related below
  const [layer = null, group = null] = title ? title.split('/') : [];
  const el = elements.find((e) => e.component === c.name);
  entries.push({
    name: c.name,
    layer: layer?.toLowerCase() ?? null,
    group,
    summary: doc?.summary || c.description,
    import: `import { ${c.name} } from '${pkg.name}';`,
    element: el ? { tag: el.tag, events: el.events.map((e) => e.name), slots: el.slots.map((s) => s.name) } : null,
    aliases: c.aliases,
    props: Object.entries(c.props)
      .filter(([, p]) => !p.inherited)
      .map(([name, p]) => ({
        name,
        type: p.type,
        required: !p.optional,
        default: parseDefault(p.doc),
        allowedValues: p.values ?? allowed(p.type),
        description: p.doc.replace(/;?\s*default:?\s+.+$/i, '').trim(),
        callback: p.kind === 'event',
      })),
    whenToUse: doc?.whenToUse ?? [],
    whenNotToUse: doc?.whenNotToUse ?? [],
    accessibility: doc?.accessibility ?? [],
    example: doc?.usage ?? null,
    readme: `src/components/${c.name}/README.md`,
    storybook: title ? `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}--docs` : null,
  });
}

const manifest = {
  name: 'CareOS',
  package: pkg.name,
  version: pkg.version,
  generated: 'scripts/gen-agents-manifest.mjs from the TypeScript props, READMEs, stories and the element registry',
  rules: [
    "Import React components from 'health-components' and load 'health-components/styles.css' once.",
    "In Angular, Vue or HTML call defineCareOSElements() from 'health-components/elements' and use the <co-*> tags.",
    'Format every clinical number with fmt or render it with ClinicalValue, DoseDisplay, DateTimeClinical, IdentifierDisplay, CodeDisplay or MoneyDisplay; never toFixed or a hand-written unit.',
    'Use tokens by name (var(--co-primary)), never hex. Theme with data-co-theme on any ancestor or <ThemeProvider>.',
    'Pick the highest layer that fits (complex before basic) and check whenNotToUse before choosing a component.',
  ],
  count: entries.length,
  components: entries,
};
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(manifest, null, 2) + '\n');
console.log(`agents manifest: ${entries.length} components -> ${out}`);
