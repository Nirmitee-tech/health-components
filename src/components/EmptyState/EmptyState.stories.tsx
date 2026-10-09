import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { iconNames } from '../Icon/paths';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Basic/Data display/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'EmptyState fills a screen or card that has nothing to show, including the access-denied screen. `denied` and `error` use role alert.',
      },
    },
  },
  argTypes: {
    kind: { control: 'inline-radio', options: ['empty', 'noresults', 'denied', 'error'] },
    icon: { control: 'select', options: [undefined, ...iconNames] },
    title: { control: 'text' },
    children: { control: 'text' },
  },
  args: {
    kind: 'noresults',
    title: 'No patients match',
    children: 'Try the MRN or date of birth.',
    actions: <Button>Clear Filters</Button>,
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-grid">
      <div className="co-card">
        <EmptyState
          kind="denied"
          title="You do not have access to this screen"
          actions={
            <>
              <Button variant="primary">Go to my home screen</Button>
              <Button>Compare roles</Button>
            </>
          }
        >
          Your role (Front Desk) does not include the permission Manage claims. Ask your Practice Admin to change your role
          in Settings, Roles and Permissions, if you need it.
        </EmptyState>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="co-card">
          <EmptyState
            compact
            title="No prior authorizations yet"
            actions={
              <Button variant="primary" iconLeft="plus">
                New Prior Auth
              </Button>
            }
          >
            Requests you start or receive from payers appear here.
          </EmptyState>
        </div>
        <div className="co-card">
          <EmptyState compact kind="error" title="Could not load lab results" actions={<Button>Try Again</Button>}>
            Quest did not answer within 30 seconds.
          </EmptyState>
        </div>
      </div>
    </div>
  ),
};

export const Empty: Story = {
  args: {
    kind: 'empty',
    title: 'No prior authorizations yet',
    children: 'Requests you start or receive from payers appear here.',
    actions: (
      <Button variant="primary" iconLeft="plus">
        New Prior Auth
      </Button>
    ),
  },
};

export const Denied: Story = {
  args: {
    kind: 'denied',
    title: 'You do not have access to this screen',
    children: 'Your role (Front Desk) does not include the permission Manage claims.',
    actions: <Button variant="primary">Go to my home screen</Button>,
  },
};

export const LoadError: Story = {
  args: {
    kind: 'error',
    compact: true,
    title: 'Could not load lab results',
    children: 'Quest did not answer within 30 seconds.',
    actions: <Button>Try Again</Button>,
  },
};
