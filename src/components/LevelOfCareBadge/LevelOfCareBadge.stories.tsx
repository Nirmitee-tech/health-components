import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { LevelOfCareBadge } from './LevelOfCareBadge';

const meta = {
  title: 'Basic/Inpatient flow/LevelOfCareBadge',
  component: LevelOfCareBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'LevelOfCareBadge shows how much monitoring a patient needs, from observation to ICU, and a pending change in level. The tooltip gives the long name.',
      },
    },
  },
  argTypes: {
    level: { control: 'select', options: LevelOfCareBadge.levels },
    pendingTo: {
      control: 'select',
      options: [undefined, ...LevelOfCareBadge.levels],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  args: { level: 'icu', pendingTo: 'stepdown' },
} satisfies Meta<typeof LevelOfCareBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="co-row co-gap-8" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
    <span className="pv-label" style={{ width: 120 }}>
      {label}
    </span>
    {children}
  </div>
);

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-stack" style={{ gap: 12 }}>
      <Row label="Levels">
        {LevelOfCareBadge.levels.map((l) => (
          <LevelOfCareBadge key={l} level={l} />
        ))}
      </Row>
      <Row label="Pending change">
        <LevelOfCareBadge level="icu" pendingTo="stepdown" />
        <LevelOfCareBadge level="medsurg" pendingTo="tele" />
        <LevelOfCareBadge level="boarding" pendingTo="medsurg" />
      </Row>
      <Row label="Compact, sm">
        {(['icu', 'tele', 'obs'] as const).map((l) => (
          <LevelOfCareBadge key={l} level={l} compact size="sm" />
        ))}
      </Row>
    </div>
  ),
};

export const Compact: Story = {
  args: { level: 'tele', compact: true, size: 'sm', pendingTo: undefined },
};
