import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { RANGE_CONTEXTS, range, rangeFor, type RangeContextId } from '../../clinical';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { ClinicalValue } from './ClinicalValue';

const meta = {
  title: 'Complex/Clinical values/ClinicalValue',
  component: ClinicalValue,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ClinicalValue shows one clinical measurement with its unit, fixed precision, abnormal flag, trend and reference range, formatted by the shared `fmt` rules. The range comes from the shared registry for the `rangeContext` (outpatient, inpatient, ED, pediatric, pregnancy); a lab range passed with `refLow` / `refHigh` always wins. Registry ranges are sample values, not clinical guidance.',
      },
    },
  },
  argTypes: {
    measure: {
      control: 'select',
      options: ['bpSys', 'bpDia', 'hr', 'rr', 'temp', 'spo2', 'weight', 'bmi', 'glucose', 'potassium', 'sodium', 'creatinine', 'a1c', 'inr', 'hgb', 'trop'],
    },
    flag: { control: 'select', options: [undefined, 'N', 'L', 'H', 'LL', 'HH', 'A', 'AA'] },
    trend: { control: 'inline-radio', options: [undefined, 'up', 'down', 'stable'] },
    status: { control: 'inline-radio', options: ['final', 'preliminary', 'entered-in-error'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    rangeContext: { control: 'select', options: [undefined, ...RANGE_CONTEXTS] },
    flagVariant: { control: 'inline-radio', options: ['compact', 'full'] },
  },
  args: { measure: 'potassium', value: 5.4 },
} satisfies Meta<typeof ClinicalValue>;

export default meta;
type Story = StoryObj<typeof meta>;

const Cell = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="pv-stack" style={{ gap: 2, minWidth: 120 }}>
    <span className="pv-label">{label}</span>
    {children}
  </div>
);

export const Playground: Story = {
  args: { trend: 'up', delta: '+0.6', timestamp: '2026-10-09T13:40:00Z', timeZone: 'America/Chicago', source: 'Quest Diagnostics' },
};

export const Vitals: Story = {
  render: () => (
    <div className="co-row co-gap-16" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Cell label="BP">
        <span>
          <ClinicalValue measure="bpSys" value={142} tooltip={false} /> / <ClinicalValue measure="bpDia" value={88} />
        </span>
      </Cell>
      <Cell label="Heart rate">
        <ClinicalValue measure="hr" value={72} />
      </Cell>
      <Cell label="Temp">
        <ClinicalValue measure="temp" value={37.0} />
      </Cell>
      <Cell label="Temp, fever">
        <ClinicalValue measure="temp" value={38.6} trend="up" delta="+1.1" />
      </Cell>
      <Cell label="SpO2">
        <ClinicalValue measure="spo2" value={97} />
      </Cell>
      <Cell label="Weight">
        <ClinicalValue measure="weight" value={81.2} />
      </Cell>
      <Cell label="BMI">
        <ClinicalValue measure="bmi" value={27.4} />
      </Cell>
    </div>
  ),
};

export const EveryFlag: Story = {
  render: () => (
    <div className="co-row co-gap-16" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Cell label="Normal (showNormal)">
        <ClinicalValue measure="sodium" value={140} showNormal />
      </Cell>
      <Cell label="Low">
        <ClinicalValue measure="hgb" value={11.2} />
      </Cell>
      <Cell label="High">
        <ClinicalValue measure="potassium" value={5.4} trend="up" delta="+0.6" />
      </Cell>
      <Cell label="Critical low">
        <ClinicalValue measure="glucose" value={48} />
      </Cell>
      <Cell label="Critical high">
        <ClinicalValue measure="inr" value={5.8} />
      </Cell>
      <Cell label="Abnormal (lab flag)">
        <ClinicalValue measure="trop" value={31} flag="A" />
      </Cell>
      <Cell label="Stable">
        <ClinicalValue measure="a1c" value={7.2} trend="stable" />
      </Cell>
    </div>
  ),
};

export const WithMeta: Story = {
  render: () => (
    <div className="co-row co-gap-16" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <ClinicalValue measure="trop" value={58} size="lg" showMeta showLabel timestamp="2026-10-09T13:40:00Z" timeZone="America/Chicago" source="ED point of care" />
      <ClinicalValue measure="creatinine" value={1.82} trend="up" delta="+0.41" showMeta showLabel timestamp="2026-10-08T07:15:00Z" timeZone="America/New_York" source="Quest Diagnostics" />
      <ClinicalValue measure="tsh" value={0.12} showMeta showLabel refLow={0.45} refHigh={4.12} source="LabCorp (lab range)" />
    </div>
  ),
};

function RangeDemo() {
  const [ctx, setCtx] = useState<RangeContextId>('outpatient');
  const items: Array<[string, { measure: string; value: number; ageYears?: number }]> = [
    ['Glucose', { measure: 'glucose', value: 150 }],
    ['Temp', { measure: 'temp', value: 37.5 }],
    ['SpO2', { measure: 'spo2', value: 93 }],
    ['Systolic BP', { measure: 'bpSys', value: 160 }],
    ['Hemoglobin', { measure: 'hgb', value: 12.0 }],
    ['Heart rate, age 8', { measure: 'hr', value: 150, ageYears: 8 }],
  ];
  return (
    <div className="pv-stack">
      <SegmentedControl
        label="Range context"
        size="sm"
        value={ctx}
        onChange={(v) => setCtx(v as RangeContextId)}
        options={[
          { value: 'outpatient', label: 'Outpatient' },
          { value: 'inpatient', label: 'Inpatient' },
          { value: 'ed', label: 'ED' },
          { value: 'pediatric', label: 'Pediatric' },
          { value: 'pregnancy', label: 'Pregnancy' },
        ]}
      />
      <div className="co-row co-gap-16" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {items.map(([label, p]) => (
          <Cell key={label} label={label}>
            <ClinicalValue {...p} rangeContext={ctx} showNormal />
          </Cell>
        ))}
        <Cell label="Glucose, lab range 70-200">
          <ClinicalValue measure="glucose" value={150} rangeContext={ctx} refLow={70} refHigh={200} showNormal showMeta source="Lab range wins" />
        </Cell>
      </div>
      <span className="co-cv-meta">
        {'Range: ' + range(rangeFor('glucose', { context: ctx }), 0, 'mg/dL') + ' glucose in this context. Sample values, not clinical guidance.'}
      </span>
    </div>
  );
}

export const RangeContexts: Story = { render: () => <RangeDemo /> };

export const PaediatricsAndStates: Story = {
  render: () => (
    <div className="co-row co-gap-16" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Cell label="Infant weight, 2 dp">
        <ClinicalValue measure="weight" value={4.27} precision={2} />
      </Cell>
      <Cell label="Newborn HR (lab range)">
        <ClinicalValue measure="hr" value={148} refLow={100} refHigh={160} />
      </Cell>
      <Cell label="Pain score">
        <ClinicalValue measure="pain" value={6} />
      </Cell>
      <Cell label="Entered in error">
        <ClinicalValue measure="potassium" value={7.9} status="entered-in-error" />
      </Cell>
      <Cell label="Small">
        <ClinicalValue measure="plt" value={92} size="sm" />
      </Cell>
    </div>
  ),
};
