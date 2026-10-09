import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Tabs, type TabItem } from './Tabs';

const claimTabs: TabItem[] = [
  { id: 'o', label: 'Overview' },
  { id: 'l', label: 'Lines', count: 3 },
  { id: 'h', label: 'History' },
  { id: 'e', label: 'ERA', disabled: true },
];
const queueTabs: TabItem[] = [
  { id: 'a', label: 'All', count: 128 },
  { id: 'm', label: 'Mine', count: 14 },
  { id: 'o', label: 'Overdue', count: 3, alert: true },
  { id: 'd', label: 'Done' },
];

const meta = {
  title: 'Basic/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Tabs switch between views of the same record or list: line tabs under a header, or pill tabs, both with optional counts. ARIA tabs pattern: Left and Right arrows, Home and End move and select (roving tabindex); disabled tabs are skipped.',
      },
    },
  },
  argTypes: { variant: { control: 'inline-radio', options: ['line', 'pill'] }, label: { control: 'text' } },
  args: { items: claimTabs, label: 'Claim', onChange: fn() },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="pv-stack" style={{ gap: 18 }}>
      <Tabs label="Claim" items={claimTabs} />
      <Tabs label="Queue" variant="pill" defaultValue="m" items={queueTabs} />
    </div>
  ),
};

function WithPanelsDemo() {
  const [tab, setTab] = useState('o');
  const items: TabItem[] = claimTabs.map((t) => ({ ...t, panelId: `claim-panel-${t.id}` }));
  return (
    <div className="pv-stack">
      <Tabs id="claim-tabs" label="Claim CLM-20871" items={items} value={tab} onChange={setTab} />
      {items.map((t) => (
        <div key={t.id} id={t.panelId} role="tabpanel" aria-labelledby={`claim-tabs-${t.id}`} hidden={t.id !== tab}>
          {t.id === 'o' ? 'Henna West . Aetna PPO . Billed $182.00 . Submitted 10/08/2026' : null}
          {t.id === 'l' ? '99214 $142.00 . 36415 $12.00 . 80053 $28.00' : null}
          {t.id === 'h' ? 'Submitted 10/08 . Accepted 10/09 (277CA)' : null}
        </div>
      ))}
    </div>
  );
}

/** Controlled tabs wired to tab panels with aria-controls and aria-labelledby. */
export const WithPanels: Story = { render: () => <WithPanelsDemo /> };
