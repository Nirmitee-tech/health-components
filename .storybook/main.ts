import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "!../src/components/OLD_Button/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-docs",
    "@storybook/addon-interactions"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  "docs": {
    "autodocs": "tag"
  },
  "typescript": {
    "check": false,
    "reactDocgen": "react-docgen-typescript",
    "reactDocgenTypescriptOptions": {
      "shouldExtractLiteralValuesFromEnum": true,
      "propFilter": (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  async viteFinal(config) {
    // Enable CSS modules and regular CSS
    if (config.css) {
      config.css.modules = {
        localsConvention: 'camelCase'
      };
    }

    config.define = {
      ...config.define,
      global: 'globalThis',
      'process.env': '{}',
      process: JSON.stringify({
        env: {},
        version: '',
        platform: 'browser',
        nextTick: 'setTimeout'
      }),
    };
    return config;
  }
};
export default config;