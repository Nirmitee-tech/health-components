import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SOAPSection } from './SOAPSection';

const meta = {
  title: 'Complex/Orders and notes/SOAPSection',
  component: SOAPSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'SOAPSection is one note section with AI draft, smart-phrase insert, required tag and error, or custom content. Accept puts the AI Scribe draft into the section; Edit puts it there and focuses the text so the provider can change it. Smart phrases from Insert are appended to the text.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    text: { control: 'text' },
    ai: { control: 'text' },
    error: { control: 'text' },
    rows: { control: { type: 'number', min: 1, max: 12 } },
  },
  args: {
    title: 'Subjective',
    text: 'Knee pain 3 weeks after a fall. Worse on stairs.',
    onChange: fn(),
    onAcceptAI: fn(),
    onInsertMacro: fn(),
  },
} satisfies Meta<typeof SOAPSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { required: true, macros: ['.ros-neg', '.hpi-dm'] } };

/** The design system demo: a required Subjective with smart phrases and a Plan with an AI Scribe draft. */
export const NoteSections: Story = {
  render: () => (
    <div className="co-dt">
      <SOAPSection
        title="Subjective"
        required
        macros={['.ros-neg', '.hpi-dm']}
        text="Knee pain 3 weeks after a fall. Worse on stairs."
      />
      <SOAPSection
        title="Plan"
        ai="Start PT 2x a week for 6 weeks (97110, 97140). Ibuprofen 400 mg as needed. Recheck in 6 weeks."
      />
    </div>
  ),
};

export const WithError: Story = {
  args: { title: 'Assessment', text: '', required: true, error: 'Add an assessment before signing the note.' },
};

export const ReadOnly: Story = {
  args: {
    title: 'Objective',
    readOnly: true,
    text: 'BP 128/82, HR 74. Right knee: mild effusion, tender medial joint line, full range of motion.',
  },
};

export const CustomContent: Story = {
  args: {
    title: 'Review of systems',
    children: (
      <ul className="co-list">
        <li className="co-li">Constitutional: no fever, no weight loss</li>
        <li className="co-li">Musculoskeletal: right knee pain and swelling</li>
      </ul>
    ),
  },
};
