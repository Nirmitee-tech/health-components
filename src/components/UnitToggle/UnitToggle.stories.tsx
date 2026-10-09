import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RANGE_CONTEXTS } from '../../clinical';
import { UnitToggle } from './UnitToggle';

const meta = {
  title: 'Complex/Clinical values/UnitToggle',
  component: UnitToggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'UnitToggle shows a stored measurement in the unit the reader picks (lb or kg, in or cm, °F or °C, mg/dL or mmol/L), converting value and range with exact factors from the stored number. Never use it for doses.',
      },
    },
  },
  argTypes: {
    kind: { control: 'select', options: ['weight', 'height', 'temp', 'glucose', 'creatinine', 'a1c'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    rangeContext: { control: 'select', options: [undefined, ...RANGE_CONTEXTS] },
  },
  args: { kind: 'glucose', value: 212, unit: 'mg/dL', defaultUnit: 'mmol/L', showStored: true, onChange: fn() },
} satisfies Meta<typeof UnitToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Families: Story = {
  render: () => (
    <div className="co-row co-gap-16" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div className="pv-stack">
        <span className="pv-label">Paediatrics weight</span>
        <UnitToggle kind="weight" value={36.3} unit="kg" defaultUnit="[lb_av]" showStored />
      </div>
      <div className="pv-stack">
        <span className="pv-label">Height</span>
        <UnitToggle kind="height" value={152.4} unit="cm" defaultUnit="[in_i]" />
      </div>
      <div className="pv-stack">
        <span className="pv-label">Temperature</span>
        <UnitToggle kind="temp" value={38.6} unit="Cel" defaultUnit="[degF]" />
      </div>
      <div className="pv-stack">
        <span className="pv-label">Glucose (endocrine)</span>
        <UnitToggle kind="glucose" value={212} unit="mg/dL" defaultUnit="mmol/L" showStored />
      </div>
      <div className="pv-stack">
        <span className="pv-label">Creatinine (nephrology)</span>
        <UnitToggle kind="creatinine" value={1.82} unit="mg/dL" defaultUnit="umol/L" />
      </div>
      <div className="pv-stack">
        <span className="pv-label">A1c</span>
        <UnitToggle kind="a1c" value={7.2} unit="%" defaultUnit="mmol/mol" />
      </div>
    </div>
  ),
};

export const Controlled: Story = { args: { kind: 'temp', value: 37.0, unit: 'Cel', displayUnit: '[degF]', label: 'Oral temperature' } };
