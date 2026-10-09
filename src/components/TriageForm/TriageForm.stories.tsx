import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RANGE_CONTEXTS } from '../../clinical';
import { TriageForm } from './TriageForm';

const meta = {
  title: 'Complex/ED & periop/TriageForm',
  component: TriageForm,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'TriageForm records the chief complaint, arrival mode and triage vitals, and suggests an Emergency Severity Index (ESI v4) level that the nurse confirms or overrides. Each vital flags against the shared reference ranges (`ed` context by default) as it is typed. The suggestion logic is exported as `esiLevel` and `dangerZone`.',
      },
    },
  },
  argTypes: {
    rangeContext: { control: 'select', options: [undefined, ...RANGE_CONTEXTS] },
  },
  args: { onSubmit: fn(), onSaveDraft: fn() },
} satisfies Meta<typeof TriageForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    subtitle: 'Daniel Kim . 58 y M . arrived 14:18',
    defaultValues: { complaint: 'Chest pressure for 1 hour, sweaty', arrival: 'EMS ground', hr: 112, sbp: 154, dbp: 94, rr: 22, spo2: 95, temp: 37.1, pain: 6, resources: '2+' },
  },
};

export const Showcase: Story = {
  render: (args) => (
    <div className="pv-stack">
      <TriageForm
        {...args}
        subtitle="Daniel Kim . 58 y M . arrived 14:18"
        defaultValues={{ complaint: 'Chest pressure for 1 hour, sweaty', arrival: 'EMS ground', hr: 112, sbp: 154, dbp: 94, rr: 22, spo2: 95, temp: 37.1, pain: 6, resources: '2+' }}
      />
      <TriageForm
        {...args}
        subtitle="Lily Turner . 6 y F"
        defaultValues={{ complaint: 'Cut on forearm from glass', arrival: 'Walk-in', hr: 96, sbp: 102, dbp: 64, rr: 20, spo2: 100, temp: 36.8, pain: 3, resources: 1 }}
      />
      <TriageForm
        {...args}
        subtitle="Robert Nguyen . 82 y M . nurse override"
        isolation="Respiratory illness"
        defaultValues={{ complaint: 'Fever and cough 3 days, more confused today', arrival: 'EMS ground', hr: 118, sbp: 96, dbp: 58, rr: 26, spo2: 89, temp: 39.6, glucose: 212, confused: true, resources: '2+', override: '1' }}
      />
      <TriageForm {...args} subtitle="New arrival, not started" showErrors />
      <TriageForm
        {...args}
        subtitle="Signed 13:02 by M. Alvarez RN"
        readOnly
        defaultValues={{ complaint: 'Medication refill', arrival: 'Walk-in', hr: 78, sbp: 128, dbp: 80, rr: 14, spo2: 99, temp: 36.6, pain: 0, resources: 0 }}
      />
    </div>
  ),
};

export const NotStarted: Story = { args: { subtitle: 'New arrival, not started', showErrors: true } };

export const NurseOverride: Story = {
  args: {
    subtitle: 'Robert Nguyen . 82 y M . nurse override',
    isolation: 'Respiratory illness',
    defaultValues: { complaint: 'Fever and cough 3 days, more confused today', arrival: 'EMS ground', hr: 118, sbp: 96, dbp: 58, rr: 26, spo2: 89, temp: 39.6, glucose: 212, confused: true, resources: '2+', override: '1' },
  },
};

export const Signed: Story = {
  args: {
    subtitle: 'Signed 13:02 by M. Alvarez RN',
    readOnly: true,
    defaultValues: { complaint: 'Medication refill', arrival: 'Walk-in', hr: 78, sbp: 128, dbp: 80, rr: 14, spo2: 99, temp: 36.6, pain: 0, resources: 0 },
  },
};
