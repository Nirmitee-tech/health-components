import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../Button/Button';
import { Drawer } from './Drawer';

const meta = {
  title: 'Basic/Overlays/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Drawer slides a panel in from the right for detail and secondary forms, including the "For developers" panel, or up from the bottom on phones. It renders through a portal with a focus trap, scroll lock and Escape. Documentation stories pass `inline`.',
      },
    },
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['right', 'bottom'] },
    title: { control: 'text' },
    children: { control: 'text' },
  },
  args: {
    inline: true,
    title: 'Claim CLM-20871',
    children: 'Henna West . Aetna PPO . Billed $182.00 . Rejected A7: Subscriber ID not found.',
    onClose: fn(),
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { width: 420, footer: <Button variant="primary">Resubmit</Button> } };

export const Showcase: Story = {
  render: () => (
    <div className="pv-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))' }}>
      <Drawer
        inline
        developer
        title="Prior Auth Queue"
        width={420}
        sections={[
          {
            title: 'Purpose and roles',
            body: 'Work list of prior authorizations. PA Coordinator and Biller edit; Provider views; Front Desk has no access.',
          },
          { title: 'API', code: 'GET /fhir/Claim?use=preauthorization&status=active\nPOST /pas/Claim/$submit  (Da Vinci PAS)' },
          { title: 'States', body: 'Empty, loading, payer timeout (30 s), no permission (lock banner).' },
        ]}
      />
      <Drawer
        inline
        side="bottom"
        title="Visit options"
        footer={
          <Button variant="primary" full>
            Join Video Visit
          </Button>
        }
      >
        <div className="co-muted">Dr. Priya Shah . Today 2:30 PM . Telehealth</div>
        <Button full>Reschedule</Button>
        <Button full variant="danger">
          Cancel Visit
        </Button>
      </Drawer>
    </div>
  ),
};

export const BottomSheet: Story = {
  args: { side: 'bottom', title: 'Visit options', children: 'Dr. Priya Shah . Today 2:30 PM . Telehealth' },
};

function OpenDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Claim Detail</Button>
      <Drawer
        open={open}
        title="Claim CLM-20871"
        onClose={() => setOpen(false)}
        footer={
          <Button variant="primary" onClick={() => setOpen(false)}>
            Resubmit
          </Button>
        }
      >
        <div className="co-muted">Henna West . Aetna PPO . Billed $182.00</div>
        <div>Rejected A7: Subscriber ID not found. Check the member ID on the card and resubmit.</div>
      </Drawer>
    </>
  );
}

/** The real overlay: portal, focus trap, scroll lock, Escape. */
export const OpenFromButton: Story = { render: () => <OpenDemo /> };
