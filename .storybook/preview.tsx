import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';
import '../src/styles/fonts.css';
import '../src/styles/index.css';
import './preview.css';

export const themes = {
  Classic: 'classic',
  'Clinical Sidebar': 'sidebar',
  'Focus Rail': 'rail',
  'Command Bar': 'command',
  Dark: 'dark',
};

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className="co-root sb-co-canvas">
        <Story />
      </div>
    ),
    withThemeByDataAttribute({
      themes,
      defaultTheme: 'Classic',
      attributeName: 'data-co-theme',
      parentSelector: 'html',
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst', matchers: { color: /(background|color)$/i, date: /Date$/ } },
    a11y: { test: 'todo' },
    options: {
      storySort: {
        order: ['Introduction', 'Foundations', 'Basic', 'Complex'],
      },
    },
  },
};

export default preview;
