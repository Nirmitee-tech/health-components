import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { BarcodeScanPrompt } from './BarcodeScanPrompt';

const meta = {
  title: 'Complex/Inpatient nursing/BarcodeScanPrompt',
  component: BarcodeScanPrompt,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'BarcodeScanPrompt asks for one barcode scan (wristband, medication or witness badge), checks it against the expected code and shows match, mismatch or skipped. The scanner types into the field and presses Enter; the result is announced politely.',
      },
    },
  },
  argTypes: {
    target: { control: 'inline-radio', options: ['patient', 'medication', 'witness'] },
    state: { control: 'select', options: [undefined, 'waiting', 'matched', 'mismatch', 'override'] },
    allowOverride: { control: 'boolean' },
  },
  args: {
    step: 1,
    target: 'patient',
    expected: 'MRN0048213',
    expectedLabel: 'Marcus Hill, DOB 03/14/1959',
    onScan: fn(),
    onOverride: fn(),
  },
} satisfies Meta<typeof BarcodeScanPrompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="pv-stack">
      <div className="pv-label">Waiting: patient wristband</div>
      <BarcodeScanPrompt step={1} target="patient" expected="MRN0048213" expectedLabel="Marcus Hill, DOB 03/14/1959" />
      <div className="pv-label">Matched: medication</div>
      <BarcodeScanPrompt
        step={2}
        target="medication"
        expected="NDC0409-7332"
        expectedLabel="cefTRIAXone 1 g"
        state="matched"
        defaultCode="NDC0409-7332"
        onReset={() => {}}
      />
      <div className="pv-label">Mismatch: wrong strength scanned</div>
      <BarcodeScanPrompt
        step={2}
        target="medication"
        expected="NDC0002-7510"
        expectedLabel="insulin lispro 4 units"
        state="mismatch"
        defaultCode="NDC0002-8215"
      />
      <div className="pv-label">Witness badge with override allowed (L&amp;D, oxytocin)</div>
      <BarcodeScanPrompt step={3} target="witness" expectedLabel="second RN" allowOverride />
      <div className="pv-label">Skipped with reason</div>
      <BarcodeScanPrompt target="patient" state="override" overrideReason="wristband unreadable, two identifiers checked verbally" />
    </div>
  ),
};

export const Matched: Story = {
  args: { step: 2, target: 'medication', expected: 'NDC0409-7332', expectedLabel: 'cefTRIAXone 1 g', defaultState: 'matched', defaultCode: 'NDC0409-7332', onReset: fn() },
};

export const Mismatch: Story = {
  args: { step: 2, target: 'medication', expected: 'NDC0002-7510', expectedLabel: 'insulin lispro 4 units', defaultState: 'mismatch', defaultCode: 'NDC0002-8215' },
};

export const WitnessWithOverride: Story = {
  args: { step: 3, target: 'witness', expected: undefined, expectedLabel: 'second RN', allowOverride: true },
};
