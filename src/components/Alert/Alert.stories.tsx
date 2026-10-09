import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../Button/Button';
import { Alert } from './Alert';

const meta = {
  title: 'Basic/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Alert is an inline banner for information, success, warnings, errors, the read-only lock, access denied and break-the-glass. error, denied and btg use role alert; the others role status.',
      },
    },
  },
  argTypes: {
    tone: { control: 'select', options: ['info', 'success', 'warning', 'error', 'lock', 'denied', 'btg', 'note', 'ai'] },
    title: { control: 'text' },
    children: { control: 'text' },
  },
  args: {
    tone: 'info',
    title: 'Eligibility checked 10/08/2026',
    children: 'Aetna PPO active. Copay $25. Deductible met $1,180 of $1,500.',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="pv-stack">
      <Alert tone="lock">
        Your role (Biller) can view this screen but not edit it. Fields and save buttons are locked. Permission needed to
        edit: Edit clinical chart.
      </Alert>
      <Alert tone="info" title="Eligibility checked 10/08/2026">
        Aetna PPO active. Copay $25. Deductible met $1,180 of $1,500.
      </Alert>
      <Alert tone="success" title="Claim Accepted by Availity">
        277CA received 10/09/2026 8:02 AM.
      </Alert>
      <Alert tone="warning" title="Prior authorization expires in 6 days" actions={<Button size="sm">Request Extension</Button>}>
        PA-2026-11873 covers 20 visits; 12 used.
      </Alert>
      <Alert tone="error" title="Claim rejected">
        A7: Subscriber ID not found. Check the member ID on the card and resubmit.
      </Alert>
      <Alert tone="denied" title="Billing summary hidden">
        Your role (Nurse / MA) does not include View patient balances.
      </Alert>
      <Alert
        tone="btg"
        title="Restricted chart"
        actions={
          <>
            <Button variant="danger-solid" size="sm">
              Break the Glass
            </Button>
            <Button size="sm">Go Back</Button>
          </>
        }
      >
        This chart belongs to a practice staff member and contains behavioral health records. Only her care team (Mandy
        Harley LCSW) can open it without a reason. Your reason and every page you view are logged and reviewed by the
        Privacy Officer.
      </Alert>
      <Alert tone="note">Patient prefers a call after 4 PM. Spanish interpreter needed.</Alert>
    </div>
  ),
};

export const Dismissible: Story = {
  args: {
    tone: 'success',
    title: 'Claim Accepted by Availity',
    children: '277CA received 10/09/2026 8:02 AM.',
    onDismiss: fn(),
  },
};

export const AiNotice: Story = {
  args: { tone: 'ai', title: 'AI Scribe is listening', children: 'The draft note appears when the visit ends. Nothing is saved until you sign.' },
};
