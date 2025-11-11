import type { Preview } from '@storybook/react';
import '../src/styles/components.css';
// import '../src/styles/components.css';
import '../dist/styles/components.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;