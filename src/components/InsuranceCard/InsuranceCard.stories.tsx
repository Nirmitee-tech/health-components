import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { InsuranceCard } from './InsuranceCard';

const meta = {
  title: 'Complex/Revenue/InsuranceCard',
  component: InsuranceCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'InsuranceCard shows the front and back of a member card with the fields billing needs and the scan state. Flip it with the Front / Back control; Scan Card appears until a scan date is set.',
      },
    },
  },
  argTypes: {
    side: { control: 'inline-radio', options: [undefined, 'front', 'back'] },
    defaultSide: { control: 'inline-radio', options: ['front', 'back'] },
  },
  args: {
    payer: 'Aetna',
    plan: 'Open Access PPO',
    member: 'Henna West',
    memberId: 'W123456789',
    group: '0844512',
    copay: 'PCP $25 . Spec $50 . ER $250',
    rx: '610502 / ADV',
    payerId: '60054',
    claimsAddress: 'PO Box 981106, El Paso TX 79998',
    phone: '1-888-632-3862',
    precert: '1-800-353-1232',
    onSideChange: fn(),
    onScan: fn(),
  },
} satisfies Meta<typeof InsuranceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { scanned: '10/09/2026' } };

export const FrontAndBack: Story = {
  render: () => (
    <div className="co-row" style={{ alignItems: 'flex-start' }}>
      <InsuranceCard
        payer="Aetna"
        plan="Open Access PPO"
        member="Henna West"
        memberId="W123456789"
        group="0844512"
        copay="PCP $25 . Spec $50 . ER $250"
        rx="610502 / ADV"
        scanned="10/09/2026"
      />
      <InsuranceCard
        defaultSide="back"
        payer="Medicare"
        payerId="00952 (Novitas)"
        claimsAddress="Electronic only"
        phone="1-800-633-4227"
        precert="Not required"
      />
    </div>
  ),
};

export const NotScanned: Story = {
  args: { payer: 'Blue Cross Blue Shield of Illinois', plan: 'BlueAdvantage HMO', member: 'Ralph Edwards', memberId: 'XOF882004511', group: '271139', copay: 'PCP $30 . Spec $60', rx: '004336 / ADV' },
};

export const Back: Story = { args: { defaultSide: 'back', scanned: '10/09/2026' } };
