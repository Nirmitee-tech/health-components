import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CodeBlock from '@theme/CodeBlock';
import { Component, useState, type ComponentType, type ErrorInfo, type ReactNode } from 'react';
import catalogue from '@site/src/generated/catalogue.json';
import elements from '@site/src/generated/elements.json';
import propsData from '@site/src/generated/props.json';
import { ShadowPreview } from './ShadowPreview';
import { ThemeSelect, usePreviewTheme } from './PreviewTheme';

export { ShadowPreview } from './ShadowPreview';
export { ThemeSelect, usePreviewTheme } from './PreviewTheme';

function useStorybookUrl(): string {
  const { siteConfig } = useDocusaurusContext();
  return String(siteConfig.customFields?.storybookUrl ?? '/storybook/');
}

/* ---------- header ---------- */
export function ComponentHeader(props: {
  name: string;
  layer: string;
  group: string;
  summary: string;
  storyId?: string;
  playgroundId?: string;
  tag?: string;
}) {
  const sb = useStorybookUrl();
  return (
    <div className="docs-comp-header">
      <div className="docs-pills">
        <span className="docs-pill">{props.layer}</span>
        <span className="docs-pill docs-pill-soft">{props.group}</span>
        {props.tag ? <code className="docs-pill docs-pill-code">&lt;{props.tag}&gt;</code> : null}
      </div>
      <p className="docs-lead">{props.summary}</p>
      <CodeBlock language="tsx">{`import { ${props.name} } from 'health-components';`}</CodeBlock>
      <div className="docs-links">
        {props.playgroundId ? (
          <a className="button button--primary button--sm" href={`${sb}?path=/story/${props.playgroundId}`} target="_blank" rel="noreferrer">
            Open playground in Storybook
          </a>
        ) : null}
        {props.storyId ? (
          <a className="button button--secondary button--sm" href={`${sb}?path=/docs/${props.storyId.split('--')[0]}--docs`} target="_blank" rel="noreferrer">
            Storybook docs
          </a>
        ) : null}
        <a
          className="button button--secondary button--sm"
          href={`https://github.com/Nirmitee-tech/health-components/tree/main/src/components/${props.name}`}
          target="_blank"
          rel="noreferrer"
        >
          Source
        </a>
      </div>
    </div>
  );
}

/* ---------- live examples ---------- */
type StoryObject = { render?: (args: Record<string, unknown>, ctx: unknown) => ReactNode; args?: Record<string, unknown> };
export type StoriesModule = Record<string, unknown> & {
  default: { component?: ComponentType<Record<string, unknown>>; args?: Record<string, unknown>; render?: StoryObject['render'] };
};

export function renderStory(mod: StoriesModule, name: string): ReactNode {
  const meta = mod.default;
  const story = mod[name] as StoryObject | undefined;
  if (!story) return <p>Missing story {name}</p>;
  const args = { ...(meta.args ?? {}), ...(story.args ?? {}) };
  const render = story.render ?? meta.render;
  if (render) return render(args, { args, argTypes: {}, globals: {}, parameters: {}, viewMode: 'docs' });
  const C = meta.component;
  return C ? <C {...args} /> : null;
}

class PreviewBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }
  render() {
    return this.state.error ? <pre className="docs-preview-error">{String(this.state.error)}</pre> : this.props.children;
  }
}

function StoryCanvas({ stories, story }: { stories: StoriesModule; story: string }) {
  // Rendering as a component keeps the story's hooks inside a component boundary.
  return <>{renderStory(stories, story)}</>;
}

export function StoryExample({ stories, story, code, storyId }: { stories: StoriesModule; story: string; code: string; storyId: string }) {
  const { theme } = usePreviewTheme();
  const [showCode, setShowCode] = useState(false);
  const sb = useStorybookUrl();
  return (
    <div className="docs-example">
      <div className="docs-example-bar">
        <ThemeSelect />
        <span className="docs-example-actions">
          <button type="button" className="docs-link-btn" aria-expanded={showCode} onClick={() => setShowCode(!showCode)}>
            {showCode ? 'Hide code' : 'Show code'}
          </button>
          <a href={`${sb}?path=/story/${storyId}`} target="_blank" rel="noreferrer">
            Storybook
          </a>
        </span>
      </div>
      <ShadowPreview theme={theme} className="docs-example-canvas">
        <PreviewBoundary>
          <StoryCanvas stories={stories} story={story} />
        </PreviewBoundary>
      </ShadowPreview>
      {showCode ? (
        <CodeBlock language="tsx" className="docs-example-code">
          {code}
        </CodeBlock>
      ) : null}
    </div>
  );
}

/* ---------- props ---------- */
type PropRow = { name: string; type: string; required: boolean; default: string; description: string; native: boolean };

export function PropsTable({ component }: { component: string }) {
  const rows = (propsData as Record<string, PropRow[]>)[component] ?? [];
  if (!rows.length) return <p>This component takes no props.</p>;
  const own = rows.filter((r) => !r.native);
  const native = rows.filter((r) => r.native);
  return (
    <>
      <div className="docs-table-wrap">
        <table className="docs-props">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {own.map((r) => (
              <tr key={r.name}>
                <td>
                  <code>{r.name}</code>
                  {r.required ? <span className="docs-req" title="Required"> *</span> : null}
                </td>
                <td>
                  <code className="docs-type">{r.type}</code>
                </td>
                <td>{r.default ? <code>{r.default}</code> : '—'}</td>
                <td>{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {native.length ? (
        <p className="docs-note">
          Also accepts native attributes, including {native.map((n) => <code key={n.name}>{n.name}</code>).reduce<ReactNode[]>((a, c, i) => (i ? [...a, ', ', c] : [c]), [])},
          plus <code>className</code> and event handlers on the root element.
        </p>
      ) : (
        <p className="docs-note">
          Every component also accepts <code>className</code>.
        </p>
      )}
    </>
  );
}

/* ---------- web component API ---------- */
type ElementEntry = {
  component: string;
  tag: string;
  aliases: string[];
  attributes: { name: string; property: string; kind: string; description: string }[];
  properties: { name: string; description: string }[];
  events: { name: string; prop: string; description: string }[];
  slots: { name: string; prop: string; description: string }[];
};

export function ElementApi({ component }: { component: string }) {
  const el = (elements as ElementEntry[]).find((e) => e.component === component);
  if (!el) return <p>This component is React-only.</p>;
  const jsonAttr = el.attributes.find((a) => a.kind === 'json');
  const simple = el.attributes.filter((a) => a.kind !== 'json').slice(0, 2);
  const ev = el.events[0];
  const slot = el.slots.find((s) => s.name === '(default)');
  const angular = `<${el.tag}${simple.map((a) => (a.kind === 'boolean' ? ` ${a.name}` : ` ${a.name}="…"`)).join('')}${
    jsonAttr ? ` [${jsonAttr.property}]="${jsonAttr.property}"` : ''
  }${ev ? ` (${ev.name})="on${ev.prop.slice(2)}($event.detail)"` : ''}>${slot ? '…' : ''}</${el.tag}>`;
  return (
    <>
      <p>
        Register the elements once (<Link to="/docs/getting-started/angular/">Angular guide</Link>), then use{' '}
        <code>&lt;{el.tag}&gt;</code>. Attributes take strings; arrays and objects are set as properties (Angular{' '}
        <code>[prop]</code>, Vue <code>:prop</code>) or as JSON attributes. Callbacks are DOM events with the value in{' '}
        <code>event.detail</code>.
      </p>
      <CodeBlock language="html" title="Angular template">
        {angular}
      </CodeBlock>
      <div className="docs-table-wrap">
        <table className="docs-props">
          <thead>
            <tr>
              <th>Kind</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {el.attributes.map((a) => (
              <tr key={'a' + a.name}>
                <td>{a.kind === 'json' ? 'property / JSON attribute' : 'attribute'}</td>
                <td>
                  <code>{a.name}</code>
                  {a.name !== a.property ? (
                    <>
                      {' '}
                      / <code>{a.property}</code>
                    </>
                  ) : null}
                </td>
                <td>{a.description}</td>
              </tr>
            ))}
            {el.properties.map((p) => (
              <tr key={'p' + p.name}>
                <td>property (function)</td>
                <td>
                  <code>{p.name}</code>
                </td>
                <td>{p.description}</td>
              </tr>
            ))}
            {el.events.map((e) => (
              <tr key={'e' + e.name}>
                <td>event</td>
                <td>
                  <code>{e.name}</code>
                </td>
                <td>
                  {e.description} <span className="docs-note">(React: <code>{e.prop}</code>)</span>
                </td>
              </tr>
            ))}
            {el.slots.map((s) => (
              <tr key={'s' + s.name}>
                <td>slot</td>
                <td>
                  <code>{s.name}</code>
                </td>
                <td>{s.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ---------- catalogue ---------- */
type CatalogueEntry = { name: string; layer: string; group: string; groupSlug: string; summary: string; tag: string | null };

export function Catalogue() {
  const base = useBaseUrl('/docs/components/');
  const byGroup = new Map<string, CatalogueEntry[]>();
  for (const c of catalogue as CatalogueEntry[]) {
    const key = `${c.layer} · ${c.group}`;
    byGroup.set(key, [...(byGroup.get(key) ?? []), c]);
  }
  const keys = [...byGroup.keys()].sort((a, b) => (a.startsWith('Basic') === b.startsWith('Basic') ? a.localeCompare(b) : a.startsWith('Basic') ? -1 : 1));
  return (
    <div>
      {keys.map((k) => (
        <section key={k} className="docs-cat-group">
          <h2 id={k.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>{k}</h2>
          <div className="docs-cat-grid">
            {byGroup.get(k)!.map((c) => (
              <Link key={c.name} className="docs-cat-card" to={`${base}${c.groupSlug}/${c.name}/`}>
                <strong>{c.name}</strong>
                <span>{c.summary}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
