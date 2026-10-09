import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Combobox, type ComboboxOption } from './Combobox';

const patients: ComboboxOption[] = [
  { value: '1', label: 'Henna West', meta: '03/14/1988 . MRN-100231' },
  { value: '2', label: 'Ralph Edwards', meta: '11/02/1951 . MRN-100118', flag: 'DNR' },
  { value: '3', label: 'Nora Scott', meta: '06/11/1999 . MRN-100377', flag: 'Restricted' },
  { value: '4', label: 'Darlene Robertson', meta: '07/22/1974 . MRN-100402' },
];
const codes: ComboboxOption[] = [
  { code: 'E11.9', label: 'Type 2 diabetes mellitus without complications' },
  { code: 'E11.65', label: 'Type 2 diabetes mellitus with hyperglycemia' },
  { code: 'I10', label: 'Essential (primary) hypertension' },
  { code: '99214', label: 'Office visit, established patient, moderate' },
];

const meta = {
  title: 'Basic/Inputs/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Combobox is a search field with a result list, for finding a patient or an ICD-10 or CPT code. It follows the ARIA combobox pattern: arrow keys move through results, Enter picks, Escape closes. Show DOB and MRN in every patient row so staff confirm identity.',
      },
    },
  },
  argTypes: { kind: { control: 'inline-radio', options: ['patient', 'code', 'plain'] } },
  args: {
    label: 'Patient',
    kind: 'patient',
    options: patients,
    placeholder: 'Search patients by name, MRN or DOB',
    onSelect: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 320, maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-grid" style={{ minHeight: 320 }}>
      <Combobox
        label="Patient"
        kind="patient"
        options={patients}
        placeholder="Search patients by name, MRN or DOB"
        defaultOpen
        defaultQuery="r"
      />
      <Combobox
        label="Diagnosis (ICD-10)"
        kind="code"
        options={codes}
        placeholder="Code or words"
        defaultQuery="diab"
        defaultOpen
      />
      <Combobox
        label="Payer"
        options={[{ label: 'Aetna' }, { label: 'Blue Cross Blue Shield of Illinois' }]}
        defaultQuery="zz"
        defaultOpen
        emptyText='No payer matches "zz". Add a payer in Settings, Payers.'
      />
    </div>
  ),
};

export const PatientSearch: Story = {
  args: { defaultOpen: true, defaultQuery: 'r', footer: 'Showing 2 of 4,212 patients' },
};

export const CodeSearch: Story = {
  args: {
    label: 'Diagnosis (ICD-10)',
    kind: 'code',
    options: codes,
    placeholder: 'Code or words',
    defaultQuery: 'e11',
    defaultOpen: true,
  },
};

export const NoMatches: Story = {
  args: {
    label: 'Payer',
    kind: 'plain',
    options: [{ label: 'Aetna' }, { label: 'Blue Cross Blue Shield of Illinois' }],
    defaultQuery: 'zz',
    defaultOpen: true,
    emptyText: 'No payer matches "zz". Add a payer in Settings, Payers.',
  },
};

export const WithError: Story = { args: { error: 'Choose a patient before scheduling.', required: true } };
