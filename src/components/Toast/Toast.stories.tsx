import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../Button/Button';
import { Toast, ToastProvider, useToast } from './Toast';

const meta = {
  title: 'Basic/Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Toast confirms a finished action at the bottom of the screen for about 2.8 seconds, in the "... Successfully" voice. Wrap the app in `ToastProvider` and call `useToast().success(...)`: toasts queue in a portal, hide after 2.8 s (5 s with an action), and errors stay until dismissed. Documentation stories pass `inline`.',
      },
    },
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'success', 'error'] },
    message: { control: 'text' },
    action: { control: 'text' },
  },
  args: { inline: true, tone: 'success', message: 'Draft Saved Successfully', onAction: fn() },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="pv-stack">
      <Toast inline tone="success" message="Draft Saved Successfully" />
      <Toast inline message="Changes discarded" />
      <Toast inline tone="success" message="Notification Deleted Successfully" action="Undo" />
      <Toast inline tone="error" message="Could not save. This browser is blocking storage; nothing was changed." />
    </div>
  ),
};

export const WithUndo: Story = { args: { message: 'Notification Deleted Successfully', action: 'Undo' } };

function ProviderDemo() {
  const toast = useToast();
  return (
    <div className="co-row">
      <Button variant="primary" onClick={() => toast.success('Draft Saved Successfully')}>
        Save Draft
      </Button>
      <Button onClick={() => toast.show({ message: 'Reminder Sent Successfully', tone: 'success' })}>Send Reminder</Button>
      <Button
        onClick={() =>
          toast.show({ message: 'Notification Deleted Successfully', tone: 'success', action: 'Undo', onAction: () => toast.show('Notification restored') })
        }
      >
        Delete Notification
      </Button>
      <Button variant="danger" onClick={() => toast.error('Could not save. This browser is blocking storage; nothing was changed.')}>
        Trigger Error
      </Button>
    </div>
  );
}

/** ToastProvider + useToast: queued toasts through a portal with the 2.8 s auto-dismiss. */
export const WithProvider: Story = {
  render: () => (
    <ToastProvider>
      <ProviderDemo />
    </ToastProvider>
  ),
};
