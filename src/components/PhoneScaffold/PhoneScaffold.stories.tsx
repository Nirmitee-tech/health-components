import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppointmentChip } from '../AppointmentChip/AppointmentChip';
import type { BottomTabBarItem } from '../BottomTabBar/BottomTabBar';
import { Button } from '../Button/Button';
import { DescriptionList } from '../DescriptionList/DescriptionList';
import { PhoneScaffold } from './PhoneScaffold';

const tabs: BottomTabBarItem[] = [
  { label: 'Home', icon: 'home' },
  { label: 'Schedule', icon: 'calendar' },
  { label: 'Patients', icon: 'users' },
  { label: 'Messages', icon: 'message', badge: 3 },
  { label: 'More', icon: 'menu' },
];

const meta = {
  title: 'Complex/Mobile and kiosk/PhoneScaffold',
  component: PhoneScaffold,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'PhoneScaffold is the frame for every phone and portal screen: header, scrolling body with 44px targets, optional lock banner and bottom tabs.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    back: { control: 'text' },
    active: { control: 'select', options: [undefined, ...tabs.map((t) => t.label)] },
    lockText: { control: 'text' },
  },
  args: {
    title: 'Today',
    subtitle: 'Thu, Oct 9 . 14 patients',
    tabs,
    active: 'Home',
    onNavigate: fn(),
    children: (
      <Button variant="ai" iconLeft="mic" full>
        Start AI Scribe
      </Button>
    ),
  },
} satisfies Meta<typeof PhoneScaffold>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="co-row" style={{ alignItems: 'flex-start' }}>
      <PhoneScaffold title="Today" subtitle="Thu, Oct 9 . 14 patients" tabs={tabs} active="Home">
        <AppointmentChip time="9:20 AM" patient="Nora Scott" type="Therapy 50" status="Confirmed" telehealth />
        <AppointmentChip time="10:00 AM" patient="Jacob Jones" type="Well Child" status="Arrived" />
        <Button variant="ai" iconLeft="mic" full>
          Start AI Scribe
        </Button>
      </PhoneScaffold>
      <PhoneScaffold
        title="Henna West"
        subtitle="F 38 . MRN-100231"
        back="#"
        lockText="The mobile EHR is built for clinical staff. Your role (Biller) sees a read-only preview; clinical actions are blocked."
      >
        <DescriptionList
          compact
          items={[
            ['Allergies', 'Penicillin'],
            ['Next visit', '10/14 2:30 PM'],
          ]}
        />
      </PhoneScaffold>
    </div>
  ),
};

export const ReadOnlyPreview: Story = {
  args: {
    title: 'Henna West',
    subtitle: 'F 38 . MRN-100231',
    back: '#',
    tabs: undefined,
    lockText: 'The mobile EHR is built for clinical staff. Your role (Biller) sees a read-only preview; clinical actions are blocked.',
    children: (
      <DescriptionList
        compact
        items={[
          ['Allergies', 'Penicillin'],
          ['Next visit', '10/14 2:30 PM'],
        ]}
      />
    ),
  },
};
