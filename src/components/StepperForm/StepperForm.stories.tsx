import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DatePicker } from '../DatePicker/DatePicker';
import { RadioGroup } from '../Radio/Radio';
import { Select } from '../Select/Select';
import { TextField } from '../TextField/TextField';
import { StepperForm, type StepperFormStep } from './StepperForm';

const guarantor = (
  <div className="pv-grid">
    <RadioGroup
      label="Who pays the bill?"
      defaultValue="self"
      options={[
        { value: 'self', label: 'The patient' },
        { value: 'other', label: 'Someone else (parent, spouse, guardian)' },
      ]}
    />
    <TextField label="Guarantor Name" defaultValue="Henna West" required />
    <DatePicker label="Guarantor Date of Birth" defaultValue="03/14/1988" />
    <TextField label="Guarantor Phone" mask="phone" defaultValue="3125550142" />
    <Select label="Relationship to Patient" options={['Self', 'Parent', 'Spouse', 'Legal guardian']} />
  </div>
);

const steps: StepperFormStep[] = [
  { label: 'Demographics', content: <TextField label="Legal First Name" defaultValue="Henna" required /> },
  { label: 'Contact', content: <TextField label="Mobile Phone" mask="phone" defaultValue="3125550142" /> },
  { label: 'Insurance', error: true, content: <TextField label="Member ID" required error="Enter the member ID from the card." /> },
  { label: 'Guarantor', content: guarantor },
  { label: 'Care Team', content: <Select label="Primary Care Provider" options={['James Bell MD', 'Priya Shah NP']} /> },
  { label: 'Consents', content: <p>HIPAA notice of privacy practices and financial policy.</p> },
  { label: 'Review', content: <p>Check the details, then save the patient.</p> },
];

const meta = {
  title: 'Complex/Forms/StepperForm',
  component: StepperForm,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'StepperForm runs a multi-step form such as the 7-step Add Patient, with the step bar, an error summary and Back, Next and Save buttons. The Next button names the next step; the last step shows `finishLabel`.',
      },
    },
  },
  argTypes: {
    finishLabel: { control: 'text' },
    saving: { control: 'boolean' },
    defaultCurrent: { control: { type: 'number', min: 0, max: 6 } },
  },
  args: {
    title: 'Add Patient',
    steps,
    finishLabel: 'Save Patient',
    onStep: fn(),
    onFinish: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof StepperForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { defaultCurrent: 0 } };

export const AddPatient: Story = {
  args: { defaultCurrent: 3, onSaveDraft: fn(), errorSummary: 'Insurance: Member ID is required.' },
};

export const LastStepSaving: Story = { args: { defaultCurrent: 6, saving: true } };
