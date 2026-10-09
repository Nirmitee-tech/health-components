import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';
import { iconNames } from './paths';

const meta = {
  title: 'Basic/Data display/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Inline 24px stroke icons in `currentColor`, stroke width 2, round caps, no fill. An icon beside text is decorative and hidden from screen readers; an icon that carries meaning alone needs `label`.',
      },
    },
  },
  argTypes: {
    name: { control: 'select', options: iconNames },
    size: { control: { type: 'range', min: 12, max: 48, step: 2 } },
    strokeWidth: { control: { type: 'range', min: 1, max: 3, step: 0.5 } },
  },
  args: { name: 'heart', size: 24 },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(92px, 1fr))', gap: 8 }}>
      {iconNames.map((n) => (
        <div
          key={n}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            padding: 8,
            border: '1px solid var(--co-border)',
            borderRadius: 6,
            background: 'var(--co-surface)',
            color: 'var(--co-ink)',
          }}
        >
          <Icon name={n} size={20} />
          <span style={{ fontSize: 11, color: 'var(--co-muted)' }}>{n}</span>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="co-row">
      {[12, 16, 20, 24].map((s) => (
        <Icon key={s} name="pill" size={s} />
      ))}
    </div>
  ),
};

export const Meaningful: Story = {
  name: 'With a label (meaningful alone)',
  render: () => (
    <span className="co-row" style={{ color: 'var(--co-danger)' }}>
      <Icon name="alert" size={20} label="Critical value" />
    </span>
  ),
};
