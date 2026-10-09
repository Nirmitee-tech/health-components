import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeDisplay } from './CodeDisplay';

const meta = {
  title: 'Basic/Clinical values/CodeDisplay',
  component: CodeDisplay,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'CodeDisplay shows a clinical or billing code with its code system label and description: ICD-10-CM, CPT, HCPCS, LOINC, SNOMED CT, RxNorm and NDC. ICD-10 codes get their dot and 11-digit NDCs show 5-4-2.',
      },
    },
  },
  argTypes: {
    system: { control: 'select', options: ['icd10', 'cpt', 'hcpcs', 'loinc', 'snomed', 'rxnorm', 'ndc'] },
    variant: { control: 'inline-radio', options: ['inline', 'stacked'] },
    status: { control: 'inline-radio', options: ['active', 'inactive'] },
  },
  args: { system: 'icd10', code: 'E119', display: 'Type 2 diabetes mellitus without complications' },
} satisfies Meta<typeof CodeDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Systems: Story = {
  render: () => (
    <div className="pv-stack">
      <CodeDisplay system="icd10" code="E119" display="Type 2 diabetes mellitus without complications" />
      <CodeDisplay system="icd10" code="I48.91" display="Unspecified atrial fibrillation" />
      <CodeDisplay system="cpt" code="99214" display="Office visit, established patient, moderate" />
      <CodeDisplay system="hcpcs" code="G0439" display="Annual wellness visit, subsequent" />
      <CodeDisplay system="loinc" code="2823-3" display="Potassium [Moles/volume] in Serum or Plasma" />
      <CodeDisplay system="snomed" code="195967001" display="Asthma" />
      <CodeDisplay system="rxnorm" code="197361" display="amLODIPine 5 MG Oral Tablet" />
      <CodeDisplay system="ndc" code="00002831701" display="Humalog KwikPen 100 units/mL" variant="stacked" />
      <CodeDisplay system="icd10" code="F32.9" display="Major depressive disorder, single episode" status="inactive" />
    </div>
  ),
};

export const WithoutSystem: Story = { args: { system: 'cpt', code: '93000', display: 'ECG, 12 lead', showSystem: false } };
