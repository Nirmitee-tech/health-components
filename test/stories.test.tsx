/**
 * Renders every Storybook story in jsdom: catches runtime errors in every component and variant,
 * renders each to a string as a server would (SSR safety), and runs axe on each story for serious and
 * critical accessibility violations.
 */
import { composeStories, setProjectAnnotations } from '@storybook/react-vite';
import { act, render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import type { ComponentType } from 'react';

setProjectAnnotations({});

type StoryModule = Record<string, unknown> & { default: { title?: string } };
const modules = import.meta.glob<StoryModule>('../src/**/*.stories.tsx', { eager: true });

const AXE_RULES_OFF = {
  // Stories render fragments without a page landmark structure.
  region: { enabled: false },
  'landmark-one-main': { enabled: false },
  'page-has-heading-one': { enabled: false },
  // Colour pairs are kept from the source design and documented in the README accessibility notes.
  'color-contrast': { enabled: false },
};

for (const [path, mod] of Object.entries(modules)) {
  const stories = composeStories(mod as never) as Record<string, ComponentType & { storyName?: string; parameters?: { a11y?: { disable?: boolean } } }>;
  describe(mod.default.title ?? path, () => {
    for (const [name, Story] of Object.entries(stories)) {
      it(`${name} renders on the server`, () => {
        expect(() => renderToString(<Story />)).not.toThrow();
      });
      it(`${name} renders and passes axe`, async () => {
        const { container } = render(<Story />);
        await act(async () => {});
        expect(container).toBeTruthy();
        if (Story.parameters?.a11y?.disable) return;
        const results = await axe.run(document.body, { rules: AXE_RULES_OFF, resultTypes: ['violations'] });
        const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
        expect(
          serious.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`)
        ).toEqual([]);
      });
    }
  });
}
