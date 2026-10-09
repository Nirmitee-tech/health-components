import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DocumentViewer, type DocumentAnnotation, type DocumentPage } from './DocumentViewer';

const pages: DocumentPage[] = [
  {
    lines: [
      'RIVERSIDE GENERAL HOSPITAL . DISCHARGE SUMMARY',
      'Patient: Ralph Edwards   DOB 11/02/1951',
      'Admitted 09/28/2026   Discharged 10/02/2026',
      '',
      'Diagnosis: Acute on chronic systolic heart failure',
      'Echo: EF 30 %, moderate MR',
      'Discharge K 5.4 mmol/L, Cr 1.48 mg/dL',
      'Diuresed 4.2 kg. Discharge weight 86.1 kg.',
      '',
      'Medications changed: furosemide 40 mg BID (was daily)',
      'Follow-up: Cardiology within 7 days.',
    ],
  },
  { lines: ['Page 2', 'Pending at discharge: TSH, iron studies', 'Signed: A. Patel MD, hospitalist'] },
];
const ann: DocumentAnnotation[] = [
  { id: 'a1', page: 0, line: 6, kind: 'comment', text: 'K was 5.6 here on 10/01; recheck.', author: 'Priya Shah MD', at: '10/09 09:30' },
  { id: 'a2', page: 0, line: 9, kind: 'highlight', author: 'Lisa Chen RN', at: '10/08 14:02' },
];

const meta = {
  title: 'Complex/Chart panels/DocumentViewer',
  component: DocumentViewer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'DocumentViewer shows a scanned or outside document page by page with zoom, and lets staff highlight a line or comment on it, listing the annotations beside the page. Annotations sit on top of the document; the source never changes.',
      },
    },
  },
  args: {
    title: 'Discharge summary',
    subtitle: 'Riverside General . received 10/03/2026 by fax',
    pages,
    annotations: ann,
    maxHeight: 340,
    onAnnotationsChange: fn(),
    onPageChange: fn(),
    onDownload: fn(),
  },
} satisfies Meta<typeof DocumentViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: (args) => (
    <div className="co-dt">
      <DocumentViewer {...args} />
      <div className="pv-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(380px,1fr))' }}>
        <DocumentViewer
          title="Dermatology consult letter"
          readOnly
          pages={[{ lines: ['Biopsy left forearm: basal cell carcinoma', 'Plan: Mohs surgery 11/2026'] }]}
          maxHeight={160}
        />
        <DocumentViewer title="Outside MRI report" error="The file is damaged. Ask the sender to fax it again." />
      </div>
    </div>
  ),
};

export const ReadOnly: Story = { args: { readOnly: true, subtitle: undefined } };

export const CouldNotOpen: Story = { args: { title: 'Outside MRI report', subtitle: undefined, pages: [], annotations: undefined, error: 'The file is damaged. Ask the sender to fax it again.' } };
