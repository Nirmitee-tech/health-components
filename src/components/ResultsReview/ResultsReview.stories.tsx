import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RANGE_CONTEXTS } from '../../clinical';
import { ResultsReview, type ResultReviewResult } from './ResultsReview';

const crit: ResultReviewResult = {
  title: 'Basic metabolic panel',
  patient: 'Ralph Edwards . 74 y',
  orderedBy: 'Priya Shah MD (Cardiology)',
  collected: '10/09/2026 07:40',
  resulted: '10/09/2026 09:05',
  calledTo: 'Priya Shah MD at 09:08',
  rows: [
    { code: 'Na', value: 131, prior: 133 },
    { code: 'K', value: 6.8, prior: 5.6 },
    { code: 'Cr', value: 1.71, prior: 1.52 },
    { code: 'Glu', value: 142, prior: 141 },
  ],
  interpretation: 'Specimen not hemolyzed.',
};

const routine: ResultReviewResult = {
  title: 'Thyroid stimulating hormone',
  patient: 'Henna West . 38 y',
  orderedBy: 'James Bell MD (Family medicine)',
  collected: '10/08/2026',
  resulted: '10/09/2026',
  rows: [{ code: 'TSH', value: 5.82, prior: 4.1 }],
  comments: [{ by: 'James Bell MD', text: 'Repeat with free T4 in 6 weeks.', at: '10/09/2026 10:15' }],
};

const meta = {
  title: 'Complex/Chart panels/ResultsReview',
  component: ResultsReview,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ResultsReview is the inbox detail for one resulted order: values against the prior draw, then Acknowledge, Comment, Route and Notify Patient. A critical value needs the read-back recorded before Acknowledge.',
      },
    },
  },
  argTypes: {
    status: { control: 'inline-radio', options: [undefined, 'new', 'acknowledged', 'routed'] },
    rangeContext: { control: 'select', options: [undefined, ...RANGE_CONTEXTS] },
  },
  args: {
    result: crit,
    routeOptions: ['Lisa Chen RN', 'Cardiology nurse pool', 'Nephrology on call'],
    onAcknowledge: fn(),
    onComment: fn(),
    onRoute: fn(),
    onNotifyPatient: fn(),
    onStatusChange: fn(),
  },
} satisfies Meta<typeof ResultsReview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: (args) => (
    <div className="co-dt">
      <ResultsReview {...args} />
      <div className="pv-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(380px,1fr))' }}>
        <ResultsReview result={routine} routeOptions={['Front desk pool']} />
        <ResultsReview
          result={{
            title: 'Hemoglobin A1c',
            patient: 'Maria Gomez . 52 y',
            orderedBy: 'James Bell MD',
            collected: '10/02/2026',
            resulted: '10/03/2026',
            rows: [{ code: 'A1c', value: 6.9, prior: 7.4 }],
            status: 'acknowledged',
            ackBy: 'James Bell MD',
            ackAt: '10/03/2026 16:20',
          }}
        />
        <ResultsReview
          result={{
            title: 'CBC',
            patient: 'Tom Price . 61 y',
            orderedBy: 'Ana Ruiz MD (Oncology)',
            collected: '10/09/2026',
            resulted: '10/09/2026',
            rows: [
              { code: 'WBC', value: 2.8 },
              { code: 'Hgb', value: 9.6 },
              { code: 'Plt', value: 88 },
            ],
            status: 'routed',
            routedTo: 'Oncology infusion RN',
          }}
        />
        <ResultsReview
          readOnly
          result={{
            title: 'Lipid panel',
            patient: 'Henna West',
            orderedBy: 'James Bell MD',
            collected: '10/01/2026',
            resulted: '10/02/2026',
            rows: [{ code: 'LDL', value: 132, prior: 141 }],
          }}
        />
      </div>
    </div>
  ),
};

export const Routine: Story = { args: { result: routine, routeOptions: ['Front desk pool'] } };

export const ReadOnly: Story = { args: { result: routine, readOnly: true } };
