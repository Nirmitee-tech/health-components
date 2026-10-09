import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper, type StepperStep } from './Stepper';

const addPatient: StepperStep[] = [
  'Demographics',
  'Contact',
  { label: 'Insurance', error: true },
  'Guarantor',
  'Care Team',
  'Consents',
  'Review',
];

const meta = {
  title: 'Basic/Navigation/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Stepper shows progress through a multi-step flow, such as the 7-step Add Patient form, as a numbered bar, a vertical list or thin segments. Steps are an ordered list with aria-current="step"; segments are a progressbar ("Step 2 of 5").',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['bar', 'vertical', 'segments'] },
    current: { control: { type: 'number', min: 0, max: 6 } },
    label: { control: 'text' },
  },
  args: { steps: addPatient, current: 3, label: 'Add patient' },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="pv-stack" style={{ gap: 16 }}>
      <Stepper label="Add patient" steps={addPatient} current={3} />
      <div className="pv-grid">
        <Stepper label="New prior auth" variant="vertical" steps={['Patient', 'Service', 'Clinicals', 'Submit']} current={2} />
        <div>
          <div className="pv-label" style={{ marginBottom: 12 }}>
            Segments
          </div>
          <Stepper variant="segments" count={5} current={1} label="Check-in progress" />
        </div>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  args: { variant: 'vertical', steps: ['Patient', 'Service', 'Clinicals', 'Submit'], current: 2, label: 'New prior auth' },
};

export const Segments: Story = { args: { variant: 'segments', steps: [], count: 6, current: 0, label: 'Kiosk check-in' } };
