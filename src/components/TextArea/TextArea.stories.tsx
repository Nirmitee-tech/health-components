import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TextArea } from './TextArea';

const meta = {
  title: 'Basic/Inputs/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'TextArea takes multi-line text such as a reason for visit, a denial note or a message to the patient. With `maxLength` it shows a polite live counter.',
      },
    },
  },
  args: { label: 'Reason for Visit', onChange: fn() },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { required: true, maxLength: 500, defaultValue: 'Follow-up on A1c, refill metformin.' } };

export const Showcase: Story = {
  render: () => (
    <div className="pv-grid">
      <TextArea label="Reason for Visit" required defaultValue="Follow-up on A1c, refill metformin." maxLength={500} />
      <TextArea label="Appeal Letter" error="Reason is required" rows={3} />
      <TextArea label="Clinical Note" readOnly defaultValue="Signed by James Bell MD on 10/08/2026. Addenda only." />
    </div>
  ),
};

export const WithCounter: Story = { args: { label: 'Message to Patient', maxLength: 160, defaultValue: 'Your lab results are ready in the portal.' } };

export const WithError: Story = { args: { label: 'Appeal Letter', error: 'Reason is required', required: true } };

export const ReadOnly: Story = {
  args: { label: 'Clinical Note', readOnly: true, defaultValue: 'Signed by James Bell MD on 10/08/2026. Addenda only.' },
};
