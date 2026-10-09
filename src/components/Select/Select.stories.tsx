import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Select } from './Select';

const meta = {
  title: 'Basic/Inputs/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Select picks one value from a short fixed list, such as Provider, Location or Status filters. It is a native select, so platform keyboard and screen reader behaviour are kept.',
      },
    },
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
  args: {
    label: 'Provider',
    options: ['All', 'James Bell MD', 'Kristen Yale MD', 'Mandy Harley LCSW', 'Priya Shah MD'],
    onChange: fn(),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-grid">
      <Select
        label="Provider"
        options={['All', 'James Bell MD', 'Kristen Yale MD', 'Mandy Harley LCSW', 'Priya Shah MD']}
      />
      <Select
        label="Place of Service"
        required
        placeholder="Choose one"
        options={[
          { value: '11', label: '11 Office' },
          { value: '02', label: '02 Telehealth' },
        ]}
        error="Choose a place of service."
      />
      <Select label="Status" options={['Active', 'Inactive']} readOnly />
    </div>
  ),
};

export const WithPlaceholder: Story = {
  args: {
    label: 'Location',
    placeholder: 'Choose a location',
    options: [
      { value: 'lp', label: 'Lincoln Park Clinic' },
      { value: 'wl', label: 'West Loop Clinic' },
    ],
  },
};

export const Small: Story = { args: { size: 'sm', label: 'Status', options: ['Scheduled', 'Checked In', 'No Show'] } };

export const ReadOnly: Story = { args: { label: 'Status', options: ['Active', 'Inactive'], readOnly: true } };
