import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { WoundCareDoc } from './WoundCareDoc';

const meta = {
  title: 'Complex/Inpatient nursing/WoundCareDoc',
  component: WoundCareDoc,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'WoundCareDoc documents one wound: site, stage and cause, length, width and depth in cm with computed area and change since first measure, tissue mix, exudate, treatment and the measurement history.',
      },
    },
  },
  argTypes: { readOnly: { control: 'boolean' } },
  args: {
    subtitle: 'Rose Alvarez, 88 y . weekly wound round',
    wound: {
      label: 'Wound 1',
      location: 'Sacrum, midline',
      stage: 'Stage 3',
      etiology: 'Pressure',
      onset: '09/18/2026',
      hapi: true,
      photo: '3 photos',
      current: {
        length: 3.2,
        width: 2.1,
        depth: 0.4,
        tissue: { granulation: 70, slough: 20, epithelial: 10 },
        exudate: 'Moderate serosanguineous',
        odor: 'None',
        periwound: 'Intact, mild erythema',
        pain: 2,
        undermining: "0.5 cm at 12 o'clock",
        dressing: 'Hydrocolloid',
        nextChange: '10/12/2026',
      },
    },
    history: [
      { date: '09/18', length: 4.5, width: 3.0, depth: 0.8, by: 'WOC RN' },
      { date: '09/25', length: 4.0, width: 2.6, depth: 0.6, by: 'WOC RN' },
      { date: '10/02', length: 3.6, width: 2.3, depth: 0.5, by: 'WOC RN' },
      { date: '10/09', length: 3.2, width: 2.1, depth: 0.4, by: 'WOC RN' },
    ],
    onSave: fn(),
    onAddPhoto: fn(),
  },
} satisfies Meta<typeof WoundCareDoc>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Pressure injury, healing (geriatrics). */
export const Healing: Story = {};

/** Diabetic foot ulcer, worsening, tissue does not add to 100 (podiatry). */
export const Worsening: Story = {
  args: {
    subtitle: 'Daniel Okafor, 58 y',
    wound: {
      label: 'Wound 2',
      location: 'Left plantar first metatarsal head',
      stage: 'Wagner grade 2',
      etiology: 'Neuropathic diabetic',
      current: {
        length: 1.8,
        width: 1.6,
        depth: 0.5,
        tissue: { granulation: 40, slough: 30, eschar: 20 },
        exudate: 'Small purulent',
        odor: 'Present',
        periwound: 'Callus, maceration',
        pain: 0,
        tunneling: "1.2 cm at 3 o'clock",
        dressing: 'Silver alginate, offloading boot',
        nextChange: 'daily',
      },
    },
    history: [
      { date: '09/25', length: 1.4, width: 1.2, depth: 0.3, by: 'Podiatry' },
      { date: '10/09', length: 1.8, width: 1.6, depth: 0.5, by: 'Podiatry' },
    ],
  },
};

/** Heel, read only, Unstageable badge. */
export const UnstageableReadOnly: Story = {
  args: {
    readOnly: true,
    subtitle: 'Signed 10/09 14:10',
    wound: {
      label: 'Wound 3',
      location: 'Heel, right posterior',
      stage: 'Unstageable',
      etiology: 'Pressure, device related',
      current: { length: 2.0, width: 2.0, depth: 0, tissue: { eschar: 100 }, exudate: 'None', dressing: 'Leave eschar dry, heel offloaded' },
    },
    history: undefined,
  },
};
