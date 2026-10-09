import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RANGE_CONTEXTS } from '../../clinical';
import { ClinicalDecisionSupportCard, type CdsCard } from './ClinicalDecisionSupportCard';

const crit: CdsCard = {
  indicator: 'critical',
  summary: 'Potassium 6.8 mmol/L with spironolactone ordered',
  detail: 'Hyperkalemia risk. Stop potassium-sparing diuretic and repeat the level.',
  source: { label: 'CareOS renal dosing' },
  values: [
    { code: 'K', value: 6.8 },
    { code: 'eGFR', value: 38 },
  ],
  suggestions: [{ label: 'Cancel spironolactone order', isRecommended: true }, { label: 'Order STAT BMP' }],
  overrideReasons: [
    { code: 'aware', display: 'Aware, monitoring closely' },
    { code: 'nephro', display: 'Nephrology approved' },
  ],
};
const warn: CdsCard = {
  indicator: 'warning',
  summary: 'Vancomycin trough above target',
  detail: 'Consider a longer dosing interval.',
  source: { label: 'Pharmacy kinetics service' },
  values: [
    { code: 'Vanc', value: 23.4 },
    { code: 'Cr', value: 1.62 },
  ],
  suggestions: [{ label: 'Change to every 24 hours', isRecommended: true }],
  links: [{ label: 'Open dosing calculator', type: 'smart' }],
  overrideReasons: [{ code: 'id', display: 'Infectious disease directed' }],
};
const info: CdsCard = {
  indicator: 'info',
  summary: 'Patient is due for colorectal cancer screening',
  detail: 'Age 52, no colonoscopy on file. FIT kit or referral.',
  source: { label: 'USPSTF 2021' },
  suggestions: [{ label: 'Order FIT kit' }, { label: 'Refer for colonoscopy' }],
  links: [{ label: 'Guideline' }],
};
const peds: CdsCard = {
  indicator: 'warning',
  summary: 'Acetaminophen dose above weight limit',
  source: { label: 'Pediatric dosing' },
  values: [{ code: 'Wt', value: 16.2 }],
  suggestions: [{ label: 'Change to 240 mg', isRecommended: true }],
  overrideReasons: [],
};

const meta = {
  title: 'Complex/Chart panels/ClinicalDecisionSupportCard',
  component: ClinicalDecisionSupportCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ClinicalDecisionSupportCard renders one CDS Hooks card: info, warning or critical indicator, summary, detail, the values behind it, suggestions to apply, links, and an override that needs a reason. Critical cards use role alert; the others are labelled regions.',
      },
    },
  },
  argTypes: {
    defaultState: { control: 'inline-radio', options: ['open', 'accepted', 'overridden'] },
    state: { control: 'inline-radio', options: [undefined, 'open', 'accepted', 'overridden'] },
    rangeContext: { control: 'select', options: [undefined, ...RANGE_CONTEXTS] },
  },
  args: { card: crit, onOverride: fn(), onAccept: fn(), onLink: fn(), onStateChange: fn() },
} satisfies Meta<typeof ClinicalDecisionSupportCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: (args) => (
    <div className="co-dt">
      <ClinicalDecisionSupportCard {...args} />
      <ClinicalDecisionSupportCard card={warn} />
      <ClinicalDecisionSupportCard card={info} />
      <ClinicalDecisionSupportCard card={peds} />
      <ClinicalDecisionSupportCard card={info} defaultState="accepted" />
      <ClinicalDecisionSupportCard card={warn} defaultState="overridden" overrideReason="Infectious disease directed" />
    </div>
  ),
};

export const Warning: Story = { args: { card: warn } };

export const Info: Story = { args: { card: info } };

export const Overridden: Story = { args: { card: warn, defaultState: 'overridden', overrideReason: 'Infectious disease directed' } };
