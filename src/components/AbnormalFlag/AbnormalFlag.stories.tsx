import type { Meta, StoryObj } from '@storybook/react-vite';
import type { FlagCode } from '../../clinical';
import { AbnormalFlag } from './AbnormalFlag';

const flags: FlagCode[] = ['N', 'L', 'H', 'LL', 'HH', 'A', 'AA'];

const meta = {
  title: 'Basic/Clinical values/AbnormalFlag',
  component: AbnormalFlag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'AbnormalFlag marks a result as normal, low, high, critical or abnormal with a letter, an icon and a word, never colour alone. Codes follow HL7 v2 OBX-8 / FHIR interpretation.',
      },
    },
  },
  argTypes: {
    flag: { control: 'select', options: flags },
    variant: { control: 'inline-radio', options: ['compact', 'full'] },
  },
  args: { flag: 'HH', variant: 'full' },
} satisfies Meta<typeof AbnormalFlag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Compact: Story = {
  render: () => (
    <div className="co-row">
      {flags.map((f) => (
        <AbnormalFlag key={f} flag={f} />
      ))}
    </div>
  ),
};

export const Full: Story = {
  render: () => (
    <div className="co-row">
      {flags.map((f) => (
        <AbnormalFlag key={f} flag={f} variant="full" />
      ))}
    </div>
  ),
};
