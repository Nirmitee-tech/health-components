import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CPTPicker, type CPTOption } from './CPTPicker';

const options: CPTOption[] = [
  { code: '90837', label: 'Psychotherapy, 60 min' },
  { code: '90785', label: 'Interactive complexity add-on' },
  { code: '99214', label: 'Office visit, established patient, moderate' },
  { code: '97110', label: 'Therapeutic exercise, each 15 min' },
];

const meta = {
  title: 'Complex/Orders and notes/CPTPicker',
  component: CPTPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'CPTPicker adds CPT or HCPCS codes as lines with modifiers, units and diagnosis pointers. Choosing a code adds a line; each line can be edited or removed. `onChange` receives all lines.',
      },
    },
  },
  argTypes: { label: { control: 'text' } },
  args: { options, onChange: fn() },
} satisfies Meta<typeof CPTPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { telehealth: false } };

/** The design system demo: a telehealth psychotherapy visit with two coded lines. */
export const TelehealthLines: Story = {
  args: {
    telehealth: true,
    lines: [
      { code: '90837', label: 'Psychotherapy, 60 min', mods: '95', units: 1, dx: 'A' },
      { code: '97110', label: 'Therapeutic exercise, each 15 min', mods: 'GP', units: 3, dx: 'B' },
    ],
  },
};

export const Empty: Story = { args: { lines: [] } };
