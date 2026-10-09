import type { Meta, StoryObj } from '@storybook/react-vite';
import { RANGE_CONTEXTS } from '../../clinical';
import { ReferenceRangeBar } from './ReferenceRangeBar';

const meta = {
  title: 'Complex/Clinical values/ReferenceRangeBar',
  component: ReferenceRangeBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ReferenceRangeBar places a result on a bar showing the normal band and critical zones, so distance from normal reads at a glance. Ranges come from the shared registry for the `rangeContext`; a lab range passed with `refLow` / `refHigh` wins.',
      },
    },
  },
  argTypes: {
    measure: { control: 'select', options: ['sodium', 'potassium', 'glucose', 'egfr', 'ldl', 'hgb', 'tsh', 'inr', 'temp', 'spo2'] },
    rangeContext: { control: 'select', options: [undefined, ...RANGE_CONTEXTS] },
  },
  args: { measure: 'potassium', value: 5.4, width: 320 },
} satisfies Meta<typeof ReferenceRangeBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Results: Story = {
  render: () => (
    <div className="pv-grid">
      <ReferenceRangeBar measure="sodium" value={139} />
      <ReferenceRangeBar measure="potassium" value={5.4} />
      <ReferenceRangeBar measure="glucose" value={48} />
      <ReferenceRangeBar measure="egfr" value={42} max={120} min={0} />
      <ReferenceRangeBar measure="ldl" value={131} min={0} />
      <ReferenceRangeBar measure="hgb" value={10.9} label="Hemoglobin (oncology, day 10)" />
      <ReferenceRangeBar measure="tsh" value={2.1} refLow={0.45} refHigh={4.12} label="TSH (lab range)" />
      <ReferenceRangeBar measure="inr" value={2.6} refLow={2.0} refHigh={3.0} critHigh={5.0} label="INR (warfarin target)" />
    </div>
  ),
};

export const InpatientContext: Story = {
  render: () => (
    <div className="pv-grid">
      <ReferenceRangeBar measure="glucose" value={150} label="Glucose, outpatient" rangeContext="outpatient" />
      <ReferenceRangeBar measure="glucose" value={150} label="Glucose, inpatient" rangeContext="inpatient" />
    </div>
  ),
};

export const BarOnly: Story = { args: { measure: 'sodium', value: 131, showHeader: false, label: 'Sodium' } };
