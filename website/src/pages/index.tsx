import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CodeBlock from '@theme/CodeBlock';
import Layout from '@theme/Layout';
import catalogue from '@site/src/generated/catalogue.json';
import { ShadowPreview, ThemeSelect, usePreviewTheme } from '@site/src/components/docs';
import * as BannerStories from '@lib/components/PatientBanner/PatientBanner.stories';
import * as ButtonStories from '@lib/components/Button/Button.stories';
import type { ReactNode } from 'react';

type StoryMod = Record<string, unknown> & { default: { args?: Record<string, unknown>; component?: (p: Record<string, unknown>) => ReactNode } };
function first(mod: StoryMod, name: string): ReactNode {
  const s = mod[name] as { render?: (a: Record<string, unknown>, c: unknown) => ReactNode; args?: Record<string, unknown> } | undefined;
  if (!s) return null;
  const args = { ...(mod.default.args ?? {}), ...(s.args ?? {}) };
  if (s.render) return s.render(args, { args });
  const C = mod.default.component;
  return C ? <C {...args} /> : null;
}
function pickStory(mod: StoryMod): string {
  return Object.keys(mod).find((k) => k !== 'default' && k !== 'Playground') ?? 'Playground';
}

function Showcase() {
  const { theme } = usePreviewTheme();
  return (
    <div className="docs-example">
      <div className="docs-example-bar">
        <ThemeSelect />
        <span>Live components, real props</span>
      </div>
      <ShadowPreview theme={theme}>
        {first(BannerStories as unknown as StoryMod, pickStory(BannerStories as unknown as StoryMod))}
        {first(ButtonStories as unknown as StoryMod, 'Variants')}
      </ShadowPreview>
    </div>
  );
}

const features = [
  {
    title: `${(catalogue as unknown[]).length} components, two layers`,
    body: 'Basic controls with every variant and state, and Complex healthcare parts: patient banner, allergy list, ICD-10 picker, claim form, ERA posting, break-the-glass.',
  },
  {
    title: 'React and Angular',
    body: 'Typed React components for React 18 and 19, and the same components as custom elements for Angular, Vue and plain HTML.',
  },
  {
    title: 'Five themes, one token file',
    body: 'Classic, Clinical Sidebar, Focus Rail, Command Bar and Dark from a single tokens.json, as scoped --co-* CSS variables.',
  },
  {
    title: 'Accessible by default',
    body: 'WAI-ARIA keyboard patterns, focus management in overlays, and every story checked with axe in CI.',
  },
];

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="Healthcare UI components" description={siteConfig.tagline}>
      <header className="hero-careos">
        <div className="container">
          <h1>CareOS</h1>
          <p>
            The building blocks for healthcare EHRs: tokens and components for clinical, scheduling, revenue cycle and patient apps.
          </p>
          <div className="hero-actions">
            <Link className="button button--secondary button--lg" to="/docs/">
              Get started
            </Link>
            <Link className="button button--outline button--lg" style={{ color: '#fff', borderColor: '#fff' }} to="/docs/components/">
              Browse components
            </Link>
            <a className="button button--outline button--lg" style={{ color: '#fff', borderColor: '#fff' }} href={String(siteConfig.customFields?.storybookUrl)}>
              Storybook
            </a>
          </div>
        </div>
      </header>
      <main className="container">
        <section className="home-features">
          {features.map((f) => (
            <div key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </section>
        <section className="home-preview">
          <h2>Install</h2>
          <CodeBlock language="bash">npm install health-components</CodeBlock>
          <CodeBlock language="tsx">{`import 'health-components/styles.css';
import { ThemeProvider, PatientBanner, Button } from 'health-components';`}</CodeBlock>
          <h2>See it</h2>
          <Showcase />
        </section>
      </main>
    </Layout>
  );
}
