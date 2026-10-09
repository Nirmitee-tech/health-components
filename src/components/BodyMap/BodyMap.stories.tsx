import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { BodyMap, type BodyMapMark } from './BodyMap';

const marks: BodyMapMark[] = [
  {
    x: 88,
    y: 92,
    view: 'front',
    site: 'Left upper chest',
    size: [6, 5],
    prevSize: 4,
    prevDate: '04/02/2026',
    type: 'biopsy',
    desc: 'Irregular border, two colors. ABCDE positive.',
    photos: [{ date: '04/02/2026' }, { date: '10/09/2026' }],
  },
  { x: 146, y: 118, view: 'front', site: 'Left forearm', size: [3, 3], type: 'monitor', desc: 'Regular, stable since 2025.', photos: [{ date: '10/09/2026' }] },
  { x: 110, y: 28, view: 'front', site: 'Right temple', size: [8, 6], type: 'treated', desc: 'Actinic keratosis, cryotherapy today.' },
  { x: 86, y: 96, view: 'back', site: 'Left upper back', size: [5, 4], type: 'new', desc: 'New since last exam. Dermoscopy: reticular.' },
  { x: 118, y: 132, view: 'back', site: 'Right lower back', size: [4, 4], type: 'monitor', desc: 'Seborrheic keratosis.' },
];

const meta = {
  title: 'Complex/Specialty/BodyMap',
  component: BodyMap,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'BodyMap marks numbered lesions on front and back body outlines, with size in millimetres, change since last visit, status and dated photos for each one. The list repeats every mark in text, so the drawing is never the only record.',
      },
    },
  },
  argTypes: {
    view: { control: 'inline-radio', options: ['front', 'back'] },
    rangeContext: { control: 'select', options: [undefined, 'outpatient', 'inpatient', 'ed', 'pediatric', 'pregnancy'] },
    readOnly: { control: 'boolean' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
  },
  args: {
    title: 'Full skin exam',
    subtitle: 'Ethan Cole . 10/09/2026 . Fitzpatrick II',
    marks,
    onViewChange: fn(),
    onMarkSelect: fn(),
    onAddPhoto: fn(),
  },
} satisfies Meta<typeof BodyMap>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Full skin exam, front. */
export const Playground: Story = {};

/** Back view first, read-only. */
export const BackViewReadOnly: Story = { args: { title: 'Mole map', subtitle: 'Ethan Cole', view: 'back', readOnly: true } };

/** No marks yet. */
export const NoMarks: Story = { args: { title: 'Pressure injury check', subtitle: 'Rose Patel . admission', marks: [] } };

/** Marks in the earlier single-view shape (`concern` instead of `type`) still render. */
export const LegacyMarks: Story = {
  args: {
    title: 'Wound locations',
    subtitle: 'Ralph Edwards . 10/09/2026',
    marks: [{ x: 86, y: 236, site: 'Left heel', desc: 'Stage 2 pressure injury, 2 x 1.5 cm', concern: true }],
  },
};
