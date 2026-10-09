import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

const meta = {
  title: 'Basic/Data display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Avatar shows a person as a photo or initials, in five sizes, with an optional presence dot. Titles such as MD and LCSW are skipped when building initials.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    color: { control: 'select', options: ['primary', 'accent', 'ai', 'success-strong', 'ink-2'] },
    status: { control: 'select', options: [undefined, 'online', 'busy', 'away', 'offline'] },
    name: { control: 'text' },
    src: { control: 'text' },
  },
  args: { name: 'Henna West' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { size: 'lg' } };

export const Showcase: Story = {
  render: () => (
    <div className="co-row">
      <Avatar name="Henna West" size="xl" />
      <Avatar name="Ralph Edwards" size="lg" />
      <Avatar name="Mandy Harley LCSW" size="md" status="online" />
      <Avatar name="James Bell MD" size="sm" status="busy" />
      <Avatar name="Priya Shah MD" size="xs" />
      <Avatar name="Jordan Lee" color="accent" size="md" status="away" />
      <Avatar name="AI Receptionist" color="ai" size="md" />
      <Avatar name="Tom Reyes DPT" color="ink-2" size="md" status="offline" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="co-row">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <Avatar key={s} name="Henna West" size={s} />
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="co-row">
      <Avatar name="Henna West" color="primary" />
      <Avatar name="Jordan Lee" color="accent" />
      <Avatar name="AI Scribe" color="ai" />
      <Avatar name="Grace Kim RN" color="success-strong" />
      <Avatar name="Tom Reyes DPT" color="ink-2" />
    </div>
  ),
};

const photo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#9db4c0"/><circle cx="20" cy="16" r="7" fill="#e8eef1"/><path d="M6 40a14 14 0 0128 0" fill="#e8eef1"/></svg>'
  );

export const Photo: Story = { args: { name: 'Ralph Edwards', src: photo, size: 'lg', status: 'online' } };
