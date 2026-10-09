import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RANGE_CONTEXTS } from '../../clinical';
import { ProcedureNote, type ProcedureNoteProps } from './ProcedureNote';

const laceration = {
  template: 'laceration repair',
  values: {
    indication: '3 cm laceration, left forearm, glass',
    performer: 'A. Gomez PA-C',
    consent: 'Verbal, from mother',
    timeout: '15:02',
    duration: 25,
    ebl: 5,
    date: '13 Oct',
    location: 'ED room 9',
    details: {
      'Location and length': 'Left volar forearm, 3.0 cm, linear',
      Anesthesia: 'Lidocaine 1% plain, 3 mL local',
      Irrigation: 'Normal saline 250 mL',
      Closure: '4 simple interrupted 5-0 nylon',
      Dressing: 'Bacitracin, non-adherent dressing',
    },
  },
} satisfies ProcedureNoteProps;
const lp = {
  template: 'lumbar puncture',
  values: {
    indication: 'Fever and neck stiffness, rule out meningitis',
    performer: 'Dr. Sam Patel',
    date: '13 Oct',
    location: 'ED room 4',
    details: { Position: 'Left lateral decubitus', Level: 'L3-L4' },
  },
} satisfies ProcedureNoteProps;
const line = {
  template: 'central line',
  status: 'signed',
  values: {
    indication: 'Septic shock, vasopressors',
    performer: 'Dr. Priya Raman',
    consent: 'Written, health care proxy',
    timeout: '11:40',
    duration: 30,
    ebl: 10,
    date: '13 Oct',
    location: 'ED resus 2',
    signedAt: '12:20',
    details: {
      'Site and side': 'Right internal jugular',
      'Ultrasound guidance': 'Yes, real time',
      'Sterile barrier': 'Full barrier precautions',
      Catheter: '7 Fr triple lumen, 16 cm',
      Confirmation: 'Chest X-ray, tip at cavoatrial junction, no pneumothorax',
    },
  },
  addendum: { at: '13:05', text: 'Norepinephrine started through the distal port.' },
} satisfies ProcedureNoteProps;
const cesarean = {
  template: 'cesarean delivery',
  status: 'signed',
  values: {
    indication: 'Category III tracing, 36w 1d',
    performer: 'Dr. Ben Okafor',
    consent: 'Written',
    timeout: '14:41',
    duration: 48,
    ebl: 1100,
    complications: 'Uterine atony, treated with oxytocin and carboprost',
    date: '13 Oct',
    location: 'OR 5',
    signedAt: '15:50',
    details: {
      Indication: 'Non-reassuring fetal status',
      Anesthesia: 'Spinal',
      Incision: 'Pfannenstiel',
      Delivery: 'Live female, Apgars 6 and 8',
      Placenta: 'Delivered intact, manual',
      Closure: 'Two-layer hysterotomy',
    },
  },
} satisfies ProcedureNoteProps;

const meta = {
  title: 'Complex/ED & periop/ProcedureNote',
  component: ProcedureNote,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "ProcedureNote is a structured procedure note from a template (laceration repair, central line, lumbar puncture, cesarean delivery): procedure, indication, consent, time out, EBL, complications, specimens and the template's own fields. Sign Note stays disabled until consent and time out are recorded; signed notes change only by addendum.",
      },
    },
  },
  argTypes: {
    template: { control: 'select', options: ['laceration repair', 'central line', 'lumbar puncture', 'cesarean delivery'] },
    status: { control: 'inline-radio', options: ['draft', 'signed'] },
    rangeContext: { control: 'select', options: [undefined, ...RANGE_CONTEXTS] },
  },
  args: { ...laceration, onSign: fn(), onSaveDraft: fn(), onDetailsChange: fn() },
} satisfies Meta<typeof ProcedureNote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-stack">
      <ProcedureNote {...laceration} />
      <ProcedureNote {...lp} />
      <ProcedureNote {...line} />
      <ProcedureNote {...cesarean} />
    </div>
  ),
};

export const MissingTimeOut: Story = { args: lp };

export const SignedWithAddendum: Story = { args: line };

export const CesareanHighEBL: Story = { args: cesarean };
