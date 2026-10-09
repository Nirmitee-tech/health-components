import type { Meta, StoryObj } from '@storybook/react-vite';
import { iconNames } from '../Icon/paths';
import { Badge, StatusTag, type StatusKind } from './Badge';

const meta = {
  title: 'Basic/Data display/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Badge is a small coloured label for a status or attribute; StatusTag picks the right colour for claim, PA, appointment and eligibility statuses.',
      },
    },
  },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'success', 'danger', 'warning', 'info', 'ai', 'outline'] },
    shape: { control: 'inline-radio', options: ['square', 'pill'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    icon: { control: 'select', options: [undefined, ...iconNames] },
    children: { control: 'text' },
  },
  args: { children: 'Behavioral Health' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { tone: 'info', shape: 'pill' } };

const kinds: StatusKind[] = ['claim', 'pa', 'appointment', 'eligibility'];

export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="co-row co-gap-6">
        <Badge>Neutral</Badge>
        <Badge tone="success">Success</Badge>
        <Badge tone="danger">Danger</Badge>
        <Badge tone="warning">Warning</Badge>
        <Badge tone="info">Info</Badge>
        <Badge tone="ai" icon="sparkle">
          AI Draft
        </Badge>
        <Badge tone="outline">Outline</Badge>
        <Badge shape="pill">Behavioral Health</Badge>
        <Badge size="sm" tone="info">
          New Patient
        </Badge>
      </div>
      {kinds.map((k) => (
        <div key={k}>
          <div className="pv-label">{k}</div>
          <div className="co-row co-gap-6" style={{ marginTop: 10 }}>
            {Object.keys(StatusTag.statuses[k]).map((s) => (
              <StatusTag key={s} kind={k} status={s} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="co-row co-gap-6">
      <Badge>Draft</Badge>
      <Badge tone="success">Paid</Badge>
      <Badge tone="danger">Denied</Badge>
      <Badge tone="warning">Pended</Badge>
      <Badge tone="info">Confirmed</Badge>
      <Badge tone="ai">AI Draft</Badge>
      <Badge tone="outline">Self-Pay</Badge>
    </div>
  ),
};

export const ShapesAndSizes: Story = {
  render: () => (
    <div className="co-row co-gap-6">
      <Badge shape="pill" tone="info">
        Behavioral Health
      </Badge>
      <Badge size="sm">New Patient</Badge>
      <Badge dot tone="success">
        Online
      </Badge>
      <Badge icon="lock" tone="outline">
        Restricted
      </Badge>
    </div>
  ),
};

export const StatusTags: Story = {
  render: () => (
    <div className="co-row co-gap-6">
      <StatusTag kind="claim" status="Denied" />
      <StatusTag kind="pa" status="Pended" />
      <StatusTag kind="appointment" status="Checked In" />
      <StatusTag kind="eligibility" status="Active" size="sm" />
      <StatusTag kind="claim" status="Paid" icon={false} />
    </div>
  ),
};
