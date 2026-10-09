import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Radio, RadioGroup } from './Radio';

const meta = {
  title: 'Basic/Selection/Radio',
  component: RadioGroup,
  subcomponents: { Radio },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Radio and RadioGroup choose exactly one option from a short visible list. RadioGroup is a fieldset with a legend; arrow keys move between options and select them.',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
  },
  args: { label: 'Visit Mode', options: ['In person', 'Telehealth'], onChange: fn() },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { defaultValue: 'In person' } };

export const Showcase: Story = {
  render: () => (
    <div className="pv-grid">
      <RadioGroup
        label="Send my sign-in code by"
        defaultValue="sms"
        options={[
          { value: 'sms', label: 'Text message', description: 'To (312) ***-0142' },
          { value: 'app', label: 'Authenticator app' },
          { value: 'email', label: 'Email', disabled: true, description: 'Turned off by your practice' },
        ]}
      />
      <RadioGroup
        label="Visit Mode"
        inline
        required
        options={['In person', 'Telehealth']}
        error="Choose a visit mode."
      />
    </div>
  ),
};

export const Inline: Story = { args: { inline: true, defaultValue: 'Telehealth' } };

export const WithError: Story = { args: { inline: true, required: true, error: 'Choose a visit mode.' } };

export const Disabled: Story = { args: { disabled: true, defaultValue: 'In person' } };

export const SingleRadio: Story = {
  render: () => (
    <Radio name="consent" value="yes" label="I agree to the telehealth consent" description="Signed 10/08/2026" />
  ),
};
