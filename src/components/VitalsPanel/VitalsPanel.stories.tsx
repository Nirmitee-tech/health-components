import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { VitalsPanel } from './VitalsPanel';

const meta = {
  title: 'Complex/Clinical/VitalsPanel',
  component: VitalsPanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: 'VitalsPanel groups VitalSign tiles in a Card with Enter Vitals.' },
    },
  },
  argTypes: { subtitle: { control: 'text' } },
  args: {
    subtitle: 'Peds well child . entered by Lisa Chen RN, 10:12 AM',
    items: [
      { label: 'Weight', value: '12.4', unit: 'kg', trend: [9.1, 10.2, 11.3, 12.4], taken: '52nd percentile' },
      { label: 'Length', value: '84', unit: 'cm', taken: '61st percentile' },
      { label: 'Head circ.', value: '47', unit: 'cm', taken: '48th percentile' },
      { label: 'Temp', value: '101.2', unit: 'F', flag: 'H', taken: '10:12 AM' },
      { label: 'Heart rate', value: '118', unit: 'bpm', taken: '10:12 AM' },
    ],
    onEnterVitals: fn(),
  },
} satisfies Meta<typeof VitalsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AdultWithCriticals: Story = {
  args: {
    subtitle: 'Follow-up . entered by Lisa Chen RN, 10:14 AM',
    items: [
      { label: 'Blood pressure', value: '152/94', unit: 'mmHg', flag: 'H', trend: [132, 138, 145, 152], taken: '10:12 AM' },
      { label: 'Heart rate', value: '76', unit: 'bpm', trend: [80, 78, 74, 76], taken: '10:12 AM' },
      { label: 'SpO2', value: '87', unit: '%', flag: 'LL', trend: [97, 95, 92, 87], taken: '10:14 AM' },
      { label: 'Glucose', value: '58', unit: 'mg/dL', flag: 'L', taken: '10:20 AM' },
    ],
  },
};

export const ReadOnly: Story = { args: { readOnly: true } };
