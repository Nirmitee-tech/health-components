import type { Meta, StoryObj } from '@storybook/react-vite';
import { Audiogram } from './Audiogram';

const meta = {
  title: 'Complex/Specialty/Audiogram',
  component: Audiogram,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Audiogram plots hearing thresholds for each ear from 250 to 8000 Hz with the standard symbols, shades the degree of loss, and lists every value with the pure tone average.',
      },
    },
  },
  argTypes: {
    rangeContext: { control: 'select', options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'] },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    speech: { control: 'text' },
  },
  args: {
    subtitle: 'Daniel Ortiz . 58 y . occupational review',
    speech: 'SRT right 25 dB HL, left 20 dB HL. Word recognition right 88%, left 92% at 65 dB HL.',
    right: {
      ac: { 250: 15, 500: 20, 1000: 20, 2000: 30, 3000: 50, 4000: 65, 6000: 60, 8000: 45 },
      bc: { 500: 15, 1000: 20, 2000: 30, 4000: 60 },
    },
    left: {
      ac: { 250: 10, 500: 15, 1000: 20, 2000: 25, 3000: 45, 4000: 55, 6000: 55, 8000: 40 },
      bc: { 500: 10, 1000: 15, 2000: 25, 4000: 55 },
    },
  },
} satisfies Meta<typeof Audiogram>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Noise-induced loss, air and bone. */
export const Playground: Story = {};

/** Conductive right, profound left with no response. */
export const ConductiveAndProfound: Story = {
  args: {
    subtitle: 'Sofia Marin . 34 y',
    speech: undefined,
    right: {
      ac: { 250: 45, 500: 45, 1000: 40, 2000: 35, 4000: 35, 8000: 40 },
      bc: { 250: 10, 500: 10, 1000: 10, 2000: 15, 4000: 15 },
    },
    left: { ac: { 250: 85, 500: 95, 1000: 100, 2000: 110, 4000: 120, 8000: 120 }, nr: [4000, 8000] },
  },
};
