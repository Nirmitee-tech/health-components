import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { IsolationBadge } from './IsolationBadge';

const meta = {
  title: 'Basic/Inpatient flow/IsolationBadge',
  component: IsolationBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'IsolationBadge names the transmission-based precautions a patient is on, so staff put on the right protection before they enter the room. The precaution is in words, never colour alone; the tooltip names the protection to wear. Standard precautions are hidden unless `showStandard`.',
      },
    },
  },
  argTypes: {
    type: { control: 'select', options: IsolationBadge.types },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  args: { type: 'contact', organism: 'MRSA' },
} satisfies Meta<typeof IsolationBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="co-row co-gap-8" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
    <span className="pv-label" style={{ width: 120 }}>
      {label}
    </span>
    {children}
  </div>
);

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-stack" style={{ gap: 12 }}>
      <Row label="Types">
        <IsolationBadge type="contact" />
        <IsolationBadge type="contact-plus" />
        <IsolationBadge type="droplet" />
        <IsolationBadge type="airborne" />
        <IsolationBadge type="airborne-contact" />
        <IsolationBadge type="neutropenic" />
        <IsolationBadge type="standard" showStandard />
      </Row>
      <Row label="With organism">
        <IsolationBadge type="contact" organism="MRSA" />
        <IsolationBadge type="contact-plus" organism="C. diff" />
        <IsolationBadge type="droplet" organism="Influenza A" />
        <IsolationBadge type="airborne-contact" organism="Disseminated zoster" />
      </Row>
      <Row label="Rule-out">
        <IsolationBadge type="airborne" organism="TB" pending />
        <IsolationBadge type="droplet" organism="COVID-19" pending />
      </Row>
      <Row label="Compact, sm">
        <IsolationBadge type="contact" compact size="sm" />
        <IsolationBadge type="airborne" compact size="sm" />
        <IsolationBadge type="neutropenic" compact size="sm" />
      </Row>
    </div>
  ),
};

export const RuleOut: Story = {
  args: { type: 'airborne', organism: 'TB', pending: true },
};

export const Compact: Story = {
  args: {
    type: 'contact-plus',
    organism: 'C. diff',
    compact: true,
    size: 'sm',
  },
};
