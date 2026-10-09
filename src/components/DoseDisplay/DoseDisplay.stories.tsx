import type { Meta, StoryObj } from '@storybook/react-vite';
import { DoseDisplay } from './DoseDisplay';

const meta = {
  title: 'Complex/Clinical values/DoseDisplay',
  component: DoseDisplay,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'DoseDisplay writes a medication dose the ISMP way: tall-man drug names, leading zero, no trailing zero, and units, mcg and mL spelled safely. Pass numbers; "U", "IU", "ug" and "cc" are rewritten.',
      },
    },
  },
  argTypes: { layout: { control: 'inline-radio', options: ['stacked', 'inline'] } },
  args: {
    drug: 'hydroxyzine',
    strength: 25,
    unit: 'mg',
    form: 'tablet',
    amount: 25,
    route: 'PO',
    frequency: 'every 6 hours',
    prn: true,
    prnReason: 'itching',
    lookAlike: 'hydralazine',
  },
} satisfies Meta<typeof DoseDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Doses: Story = {
  render: () => (
    <div className="pv-grid">
      <DoseDisplay drug="hydroxyzine" strength={25} unit="mg" form="tablet" amount={25} route="PO" frequency="every 6 hours" prn prnReason="itching" lookAlike="hydralazine" />
      <DoseDisplay drug="hydralazine" strength={10} unit="mg" form="tablet" amount={10.0} route="PO" frequency="three times daily" lookAlike="hydroxyzine" />
      <DoseDisplay drug="insulin glargine" amount={18} unit="U" route="subcut" frequency="at bedtime" highAlert />
      <DoseDisplay drug="levothyroxine" strength={0.088} strengthUnit="mg" form="tablet" amount="88" unit="ug" route="PO" frequency="daily before breakfast" />
      <DoseDisplay drug="amoxicillin" strength={400} unit="mg" form="per 5 mL suspension" amount={450} route="PO" frequency="twice daily" perKg={45} weightKg={10.0} />
      <DoseDisplay drug="lorazepam" amount=".5" unit="mg" route="IV" frequency="once" highAlert lookAlike="alprazolam" />
      <DoseDisplay drug="vitamin D3" amount={50000} unit="IU" route="PO" frequency="weekly" layout="inline" />
      <DoseDisplay drug="prednisone" amount={5.0} unit="mg" route="PO" frequency="daily" layout="inline" />
    </div>
  ),
};

export const Inline: Story = { args: { drug: 'metformin', amount: 500, unit: 'mg', route: 'PO', frequency: 'twice daily with meals', layout: 'inline' } };
