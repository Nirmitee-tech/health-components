import type { Meta, StoryObj } from '@storybook/react-vite';
import { BodyMap } from './BodyMap';

const meta = {
  title: 'Complex/Clinical/BodyMap',
  component: BodyMap,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'BodyMap marks numbered lesions on a body outline with a matching list, for dermatology and wound care. The list repeats every mark in text, so the drawing is never the only record.',
      },
    },
  },
  argTypes: { title: { control: 'text' }, subtitle: { control: 'text' } },
  args: {
    title: 'Full skin exam',
    subtitle: 'Ethan Cole . 10/09/2026',
    marks: [
      { x: 92, y: 90, site: 'Left upper chest', desc: '6 mm, irregular border, two colors', concern: true },
      { x: 142, y: 120, site: 'Right forearm', desc: '3 mm, regular, stable since 2025' },
      { x: 110, y: 30, site: 'Right temple', desc: 'Scaly patch, likely AK' },
    ],
  },
} satisfies Meta<typeof BodyMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WoundCare: Story = {
  args: {
    title: 'Wound locations',
    subtitle: 'Ralph Edwards . 10/09/2026',
    marks: [{ x: 86, y: 236, site: 'Left heel', desc: 'Stage 2 pressure injury, 2 x 1.5 cm', concern: true }],
  },
};

export const NoMarks: Story = { args: { marks: [], subtitle: 'No lesions found' } };
