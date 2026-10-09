import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { PatientBanner } from './PatientBanner';

const meta = {
  title: 'Complex/Clinical/PatientBanner',
  component: PatientBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'PatientBanner identifies the patient at the top of every chart screen: name, sex, age, DOB, MRN, phone, insurance, allergies, flags and code status. Allergies: a list, `[]` for No Known Allergies, or undefined for "Allergies not reviewed".',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['full', 'compact', 'mobile'] },
    name: { control: 'text' },
    codeStatus: { control: 'text' },
  },
  args: {
    name: 'Henna West',
    sex: 'F',
    age: 38,
    dob: '03/14/1988',
    mrn: 'MRN-100231',
    phone: '(312) 555-0142',
    insurance: 'Aetna W123456789',
    allergies: ['Penicillin'],
    flags: ['Anxiety', { label: 'Behavioral Health', tone: 'info' }],
    codeStatus: 'Full Code',
  },
} satisfies Meta<typeof PatientBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="pv-stack">
      <PatientBanner
        name="Henna West"
        sex="F"
        age={38}
        dob="03/14/1988"
        mrn="MRN-100231"
        phone="(312) 555-0142"
        insurance="Aetna W123456789"
        allergies={['Penicillin']}
        flags={['Anxiety', { label: 'Behavioral Health', tone: 'info' }]}
        codeStatus="Full Code"
        actions={
          <>
            <Button variant="primary">Start Visit Note</Button>
            <Button>+ Schedule</Button>
            <Button>Edit Demographics</Button>
          </>
        }
      />
      <PatientBanner
        variant="compact"
        name="Ralph Edwards"
        sex="M"
        age={74}
        dob="11/02/1951"
        mrn="MRN-100118"
        insurance="Medicare 1EG4-TE5-MK72"
        allergies={['Sulfa drugs', 'Latex', 'Shellfish']}
        flags={['Diabetic', 'Fall Risk', { label: 'Interpreter: Spanish', tone: 'info' }]}
        codeStatus="DNR"
      />
      <div className="co-row" style={{ alignItems: 'flex-start' }}>
        <PatientBanner variant="mobile" name="Nora Scott" sex="F" age={27} dob="06/11/1999" mrn="MRN-100377" allergies={[]} restricted />
        <PatientBanner
          variant="mobile"
          name="Jacob Jones"
          sex="M"
          age={9}
          dob="01/20/2017"
          mrn="MRN-100455"
          flags={[{ label: 'Guardian: Maria Jones', tone: 'neutral' }]}
        />
      </div>
    </div>
  ),
};

export const DoNotResuscitate: Story = { args: { variant: 'compact', codeStatus: 'DNR', allergies: ['Sulfa drugs', 'Latex'] } };

export const AllergiesNotReviewed: Story = { args: { allergies: undefined, flags: [], codeStatus: undefined } };
