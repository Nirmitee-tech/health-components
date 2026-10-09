import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from './Field';

const meta = {
  title: 'Basic/Inputs/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Field is the labelled wrapper every form control shares: label with required marker, the control, a read-only lock line and an error (role alert) or helper line, linked with aria-describedby. TextField, TextArea, Select, Combobox and DatePicker are built on it.',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    helper: { control: 'text' },
    error: { control: 'text' },
    lock: { control: 'text' },
  },
  args: {
    label: 'Arrival Time',
    helper: 'Clinic local time',
    required: true,
    children: (control) => <input type="time" className="co-inp" defaultValue="09:30" {...control} />,
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="pv-grid">
      <Field label="Arrival Time" required helper="Clinic local time">
        {(control) => <input type="time" className="co-inp" defaultValue="09:30" {...control} />}
      </Field>
      <Field label="Room" error="Choose a room before checking in.">
        {(control) => <input className="co-inp is-bad" defaultValue="" {...control} />}
      </Field>
      <Field label="Rendering Provider" lock="Your role can view but not edit">
        {(control) => <input className="co-inp is-ro" readOnly defaultValue="James Bell MD" {...control} />}
      </Field>
    </div>
  ),
};

export const WithId: Story = {
  render: () => (
    <Field id="visit-weight" label="Weight (lb)" helper="From today's vitals">
      <input id="visit-weight" className="co-inp" defaultValue="182" aria-describedby="visit-weight-help" />
    </Field>
  ),
};
