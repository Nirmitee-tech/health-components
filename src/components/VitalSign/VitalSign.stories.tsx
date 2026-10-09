import type { Meta, StoryObj } from '@storybook/react-vite';
import { VitalSign } from './VitalSign';

const meta = {
  title: 'Complex/Clinical/VitalSign',
  component: VitalSign,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'VitalSign is one vital tile: label, value, unit, High or Low flag (critical HH and LL shaded red), trend sparkline and time taken. Place tiles in a `co-vitals` grid or use VitalsPanel.',
      },
    },
  },
  argTypes: {
    flag: { control: 'select', options: [undefined, 'H', 'L', 'HH', 'LL'] },
    value: { control: 'text' },
  },
  args: { label: 'Blood pressure', value: '152/94', unit: 'mmHg', flag: 'H', trend: [132, 138, 145, 152], taken: '10:12 AM' },
  decorators: [
    (Story) => (
      <div className="co-vitals">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VitalSign>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Flags: Story = {
  render: () => (
    <>
      <VitalSign label="Blood pressure" value="152/94" unit="mmHg" flag="H" trend={[132, 138, 145, 152]} taken="10:12 AM" />
      <VitalSign label="Heart rate" value="76" unit="bpm" trend={[80, 78, 74, 76]} taken="10:12 AM" />
      <VitalSign label="SpO2" value="87" unit="%" flag="LL" trend={[97, 95, 92, 87]} taken="10:14 AM" />
      <VitalSign label="Temp" value="98.4" unit="F" taken="10:12 AM" />
      <VitalSign label="Glucose" value="58" unit="mg/dL" flag="L" taken="10:20 AM" />
    </>
  ),
};

export const Critical: Story = {
  args: { label: 'SpO2', value: '87', unit: '%', flag: 'LL', trend: [97, 95, 92, 87], taken: '10:14 AM' },
};

export const Normal: Story = { args: { label: 'Heart rate', value: '76', unit: 'bpm', flag: undefined, trend: [80, 78, 74, 76] } };
