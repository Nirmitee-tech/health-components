import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ADTPanel, type ADTPatient } from './ADTPanel';

const ed: ADTPatient = {
  name: 'Silva, Marisol',
  mrn: '40018822',
  location: 'ED Bay 7',
  status: 'ed',
};
const icu: ADTPatient = {
  name: 'Hassan, Omar',
  mrn: '40021345',
  location: 'MICU 12',
  status: 'inpatient',
  level: 'icu',
};
const ms: ADTPatient = {
  name: 'Okafor, Grace',
  mrn: '40007719',
  location: '4 West 401A',
  status: 'inpatient',
  level: 'medsurg',
  isolation: 'contact',
};

const meta = {
  title: 'Complex/Inpatient flow/ADTPanel',
  component: ADTPanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ADTPanel admits, transfers and discharges a patient: level of care, attending and reason for admit and transfer, and disposition for discharge. Admit is offered to patients who are not yet inpatients; Transfer and Discharge to inpatients. Open discharge items block discharge, a step down from ICU warns that ICU-only orders will not carry over, and leaving against medical advice asks for the AMA form.',
      },
    },
  },
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['admit', 'transfer', 'discharge'],
    },
    level: {
      control: 'select',
      options: ['icu', 'stepdown', 'tele', 'medsurg', 'obs'],
    },
    rangeContext: {
      control: 'select',
      options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'],
    },
  },
  args: {
    patient: ed,
    mode: 'admit',
    level: 'tele',
    reason: 'NSTEMI, troponin rising',
    onSubmit: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof ADTPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-stack" style={{ gap: 16 }}>
      <ADTPanel patient={ed} mode="admit" level="tele" reason="NSTEMI, troponin rising" />
      <ADTPanel patient={icu} mode="transfer" level="medsurg" reason="Off pressors 24 h, stable" />
      <ADTPanel
        patient={ms}
        mode="discharge"
        blockers={['Medication reconciliation not signed', 'Home oxygen not delivered']}
        showErrors
      />
      <ADTPanel patient={ms} mode="discharge" reason="Left against medical advice" readOnly />
    </div>
  ),
};

export const Transfer: Story = {
  args: {
    patient: icu,
    mode: 'transfer',
    level: 'medsurg',
    reason: 'Off pressors 24 h, stable',
  },
};

export const DischargeBlocked: Story = {
  args: {
    patient: ms,
    mode: 'discharge',
    reason: '',
    blockers: ['Medication reconciliation not signed', 'Home oxygen not delivered'],
    showErrors: true,
  },
};

export const Submitted: Story = { args: { done: true } };
