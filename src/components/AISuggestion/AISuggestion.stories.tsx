import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { AISuggestion } from './AISuggestion';

const meta = {
  title: 'Basic/Feedback/AISuggestion',
  component: AISuggestion,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'AISuggestion holds content drafted by AI, in the AI purple, with its source, confidence and Accept or Edit actions. It is a region named after its title. Never apply AI output without a person accepting it.',
      },
    },
  },
  argTypes: { title: { control: 'text' }, source: { control: 'text' }, confidence: { control: 'text' }, children: { control: 'text' } },
  args: {
    title: 'Suggested codes',
    confidence: 'medium',
    children:
      'From the visit note: 99214 Office visit, established, moderate. E11.9 Type 2 diabetes without complications. I10 Essential hypertension. A candidate for the coder to confirm, not a final code set.',
  },
} satisfies Meta<typeof AISuggestion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button variant="ai" size="sm">
          Accept Codes
        </Button>
        <Button size="sm">Edit</Button>
        <Button size="sm" variant="tertiary">
          Discard
        </Button>
      </>
    ),
  },
};

export const DraftReply: Story = {
  args: {
    title: 'Draft reply',
    source: 'AI Receptionist',
    confidence: undefined,
    children:
      'Hi Henna, your lab results are in and Dr. Shah has reviewed them. Your A1c is 6.9%. She would like to see you in 3 months. Reply here to book.',
    actions: (
      <>
        <Button variant="ai" size="sm">
          Send Reply
        </Button>
        <Button size="sm">Edit</Button>
      </>
    ),
  },
};
