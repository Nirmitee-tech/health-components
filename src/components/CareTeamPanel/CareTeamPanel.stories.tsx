import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CareTeamPanel, type CareTeamMember } from './CareTeamPanel';

const team: CareTeamMember[] = [
  { name: 'James Bell MD', role: 'Primary care', specialty: 'Family medicine', npi: '1457382910', primary: true, presence: 'online', lastSeen: '10/09/2026' },
  { name: 'Priya Shah MD', role: 'Specialist', specialty: 'Cardiology', org: 'CareOS Heart', presence: 'busy', lastSeen: '10/01/2026' },
  { name: 'Lisa Chen RN', role: 'Care manager', specialty: 'CCM', primary: true, primaryLabel: 'Care manager', phone: '(555) 201-4410' },
  {
    name: 'Omar Haddad MD',
    role: 'Specialist',
    specialty: 'Nephrology',
    org: 'Riverside Kidney Center',
    npi: '1871029384',
    external: true,
    phone: '(555) 830-1200',
    lastSeen: '09/14/2026',
  },
  { name: 'Mandy Harley LCSW', role: 'Therapist', specialty: 'Behavioral health' },
  { name: 'Tom Reyes DPT', role: 'Physical therapy', status: 'inactive', ended: '06/2026' },
];

const meta = {
  title: 'Complex/Chart panels/CareTeamPanel',
  component: CareTeamPanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'CareTeamPanel lists everyone caring for the patient, inside and outside the practice, with role, specialty, NPI, last contact and call or message actions. Outside members have no in-app messaging; ended relationships are dimmed.',
      },
    },
  },
  args: { members: team, updated: '10/09/2026', onAddMember: fn(), onCall: fn(), onMessage: fn(), onMemberAction: fn() },
} satisfies Meta<typeof CareTeamPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: (args) => (
    <div className="pv-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(380px,1fr))' }}>
      <CareTeamPanel {...args} />
      <div className="co-dt">
        <CareTeamPanel readOnly title="Care Team (view only)" members={team.slice(0, 2)} />
        <CareTeamPanel members={[]} />
      </div>
    </div>
  ),
};

export const ReadOnly: Story = { args: { readOnly: true, title: 'Care Team (view only)', members: team.slice(0, 2) } };

export const Empty: Story = { args: { members: [], updated: undefined } };
