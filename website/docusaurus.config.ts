import path from 'node:path';
import type * as Preset from '@docusaurus/preset-classic';
import type { Config, Plugin } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const repoRoot = path.resolve(__dirname, '..');
const storybookUrl = process.env.STORYBOOK_URL ?? '/health-components/storybook/';
// Storybook is deployed next to the docs, outside Docusaurus routes: `pathname://` skips the broken-link check.
const storybookHref = storybookUrl.startsWith('/') ? `pathname://${storybookUrl}` : storybookUrl;

/** Resolves `health-components` to the library source so the docs always show the current code. */
function libraryAliasPlugin(): Plugin {
  return {
    name: 'health-components-alias',
    configureWebpack() {
      return {
        resolve: {
          alias: {
            'health-components$': path.join(repoRoot, 'src/index.ts'),
            'health-components/styles.css$': path.join(repoRoot, 'src/styles/index.css'),
            'health-components/fonts.css$': path.join(repoRoot, 'src/styles/fonts.css'),
            'health-components/tokens$': path.join(repoRoot, 'src/tokens/index.ts'),
            '@lib': path.join(repoRoot, 'src'),
            // Stories import `fn` for Storybook actions; the docs only need a no-op.
            'storybook/test$': path.join(__dirname, 'src/shims/storybook-test.ts'),
            // The library source must use the site's React, never a second copy from the repo root.
            react: path.join(__dirname, 'node_modules/react'),
            'react-dom': path.join(__dirname, 'node_modules/react-dom'),
          },
        },
      };
    },
  };
}

const config: Config = {
  title: 'CareOS',
  tagline: 'Production React components, Web Components and design tokens for healthcare EHRs',
  favicon: 'img/favicon.svg',
  url: process.env.DOCS_URL ?? 'https://nirmitee-tech.github.io',
  baseUrl: process.env.DOCS_BASE_URL ?? '/health-components/',
  organizationName: 'Nirmitee-tech',
  projectName: 'health-components',
  trailingSlash: true,
  onBrokenLinks: 'throw',
  markdown: { hooks: { onBrokenMarkdownLinks: 'warn' } },
  i18n: { defaultLocale: 'en', locales: ['en'] },
  customFields: { storybookUrl },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          editUrl: 'https://github.com/Nirmitee-tech/health-components/tree/main/website/',
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [libraryAliasPlugin],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      { hashed: true, docsRouteBasePath: 'docs', indexBlog: false, highlightSearchTermsOnTargetPage: true },
    ],
  ],

  themeConfig: {
    colorMode: { defaultMode: 'light', respectPrefersColorScheme: true },
    navbar: {
      title: 'CareOS',
      logo: { alt: 'CareOS', src: 'img/logo.svg' },
      items: [
        { type: 'docSidebar', sidebarId: 'guides', position: 'left', label: 'Get started' },
        { type: 'docSidebar', sidebarId: 'foundations', position: 'left', label: 'Foundations' },
        { type: 'docSidebar', sidebarId: 'components', position: 'left', label: 'Components' },
        { to: '/demo/', label: 'Live demo', position: 'left' },
        { href: storybookHref, label: 'Storybook', position: 'right' },
        { href: 'https://www.npmjs.com/package/health-components', label: 'npm', position: 'right' },
        { href: 'https://github.com/Nirmitee-tech/health-components', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Install', to: '/docs/' },
            { label: 'React', to: '/docs/getting-started/react/' },
            { label: 'Angular', to: '/docs/getting-started/angular/' },
            { label: 'Components', to: '/docs/components/' },
          ],
        },
        {
          title: 'Design',
          items: [
            { label: 'Colour and themes', to: '/docs/foundations/color/' },
            { label: 'Accessibility', to: '/docs/foundations/accessibility/' },
            { label: 'Storybook', href: storybookHref },
          ],
        },
        {
          title: 'Project',
          items: [
            { label: 'GitHub', href: 'https://github.com/Nirmitee-tech/health-components' },
            { label: 'npm', href: 'https://www.npmjs.com/package/health-components' },
          ],
        },
      ],
      copyright: `CareOS design system by Nirmitee. MIT licensed.`,
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula, additionalLanguages: ['bash', 'typescript', 'json'] },
  } satisfies Preset.ThemeConfig,
};

export default config;
