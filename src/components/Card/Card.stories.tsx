import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { DescriptionList } from '../DescriptionList/DescriptionList';
import { Card } from './Card';

const meta = {
  title: 'Basic/Data display/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Card is the white container every screen section sits in, with an optional title, actions and footer. The title is an h2, so cards build the page outline.',
      },
    },
  },
  argTypes: {
    padding: { control: 'inline-radio', options: ['default', 'compact', 'none'] },
    as: { control: 'select', options: ['section', 'div', 'article', 'aside'] },
    title: { control: 'text' },
    subtitle: { control: 'text' },
  },
  args: {
    title: 'Coverage',
    subtitle: 'Verified 10/08/2026 9:12 AM',
    children: 'Aetna PPO, member W123456789. Copay $25 office visit.',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-grid">
      <Card title="Coverage" subtitle="Verified 10/08/2026 9:12 AM" actions={<Button size="sm">Recheck</Button>}>
        <DescriptionList
          items={[
            ['Payer', 'Aetna PPO'],
            ['Member ID', 'W123456789'],
            ['Copay', '$25 office visit'],
          ]}
        />
      </Card>
      <Card
        title="Allergies"
        flat
        footer={
          <Button size="sm" variant="primary">
            Mark Reviewed
          </Button>
        }
      >
        <div className="co-muted">Penicillin (hives, moderate). Reviewed 03/2026.</div>
      </Card>
      <Card padding="compact" title="Compact">
        <div className="co-muted">10px padding for Compact density.</div>
      </Card>
    </div>
  ),
};

export const Flat: Story = { args: { flat: true, title: 'Allergies', subtitle: undefined, children: 'No known drug allergies.' } };

export const NoPadding: Story = {
  args: { padding: 'none', title: undefined, subtitle: undefined, children: <div className="co-muted">Edge-to-edge content</div> },
};
