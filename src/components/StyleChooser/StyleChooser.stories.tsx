import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import type { ThemeId } from '../../tokens/tokens';
import { careosStyleOptions, StyleChooser } from './StyleChooser';

const practiceStyles = careosStyleOptions.map((s) => ({ ...s, current: s.id === 'classic' }));

const meta = {
  title: 'Basic/Layout/StyleChooser',
  component: StyleChooser,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'StyleChooser picks the practice style (Classic, Clinical Sidebar, Focus Rail, Command Bar, Dark) with Preview and Apply to practice. Preview buttons form a radio group (`value`/`onChange`); Apply calls `onApply` and is disabled without `canApply`. Theme ids get a live swatch drawn from that theme\'s tokens.',
      },
    },
  },
  args: { canApply: true, defaultValue: 'classic', styles: practiceStyles, onChange: fn(), onApply: fn() },
} satisfies Meta<typeof StyleChooser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NoPermission: Story = { args: { canApply: false } };

export const LivePreview: Story = {
  render: function Render(args) {
    const [theme, setTheme] = useState<ThemeId>('classic');
    return (
      <ThemeProvider theme={theme} style={{ padding: 16, background: 'var(--co-canvas)' }}>
        <StyleChooser {...args} value={theme} onChange={(id) => setTheme(id as ThemeId)} />
      </ThemeProvider>
    );
  },
};

export const CustomSwatches: Story = {
  args: {
    styles: [
      { id: 'brand', name: 'Main Street Clinic', who: 'our front desk and providers.', swatch: ['var(--co-primary)', 'var(--co-accent)', 'var(--co-surface)'] },
      { id: 'classic', name: 'Classic', who: 'teams who already know CareOS.', current: true },
    ],
    defaultValue: 'brand',
  },
};
