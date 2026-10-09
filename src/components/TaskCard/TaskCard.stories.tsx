import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TaskCard } from './TaskCard';

const meta = {
  title: 'Complex/Work queues/TaskCard',
  component: TaskCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'TaskCard is one staff task with done check, patient, due date, overdue tag, category and owner. The done check is uncontrolled by default (starting at `task.done`) or controlled with `done` and `onDoneChange`.',
      },
    },
  },
  argTypes: {
    task: { control: 'object' },
    done: { control: 'boolean' },
  },
  args: {
    task: { title: 'Call back about MRI auth', patient: 'Ralph Edwards', due: 'Today 3 PM', owner: 'Sam Patel', tag: 'Prior Auth' },
    onDoneChange: fn(),
  },
} satisfies Meta<typeof TaskCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Board: Story = {
  render: () => (
    <div className="pv-grid">
      <TaskCard task={{ title: 'Call back about MRI auth', patient: 'Ralph Edwards', due: 'Today 3 PM', owner: 'Sam Patel', tag: 'Prior Auth' }} />
      <TaskCard task={{ title: 'Send school form', patient: 'Jacob Jones', due: '10/07', overdue: true, owner: 'Maria Lopez', tag: 'Forms' }} />
      <TaskCard task={{ title: 'Review fax queue', done: true, owner: 'Lisa Chen RN' }} />
    </div>
  ),
};

export const Overdue: Story = {
  args: { task: { title: 'Send school form', patient: 'Jacob Jones', due: '10/07', overdue: true, owner: 'Maria Lopez', tag: 'Forms' } },
};

export const Done: Story = { args: { task: { title: 'Review fax queue', done: true, owner: 'Lisa Chen RN' } } };
