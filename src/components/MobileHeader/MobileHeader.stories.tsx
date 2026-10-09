import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { MobileHeader } from './MobileHeader';

const meta = {
  title: 'Complex/Mobile and kiosk/MobileHeader',
  component: MobileHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'MobileHeader is the dark bar at the top of phone, portal and kiosk screens, with back, title, subtitle and one action. The back link is named "Back".',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['phone', 'kiosk'] },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    back: { control: 'text' },
  },
  args: { title: 'Henna West', subtitle: 'F 38 . MRN-100231', back: '#patients' },
} satisfies Meta<typeof MobileHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="pv-stack">
      <MobileHeader title="Today" subtitle="Thu, Oct 9 . 14 patients" />
      <MobileHeader back="#" title="Henna West" subtitle="F 38 . MRN-100231" action={<Button size="sm">Call</Button>} />
      <MobileHeader variant="kiosk" title="Valley Family Clinic" subtitle="Self check-in . Main Street" />
    </div>
  ),
};

export const Kiosk: Story = { args: { variant: 'kiosk', title: 'Valley Family Clinic', subtitle: 'Self check-in . Main Street', back: undefined } };
