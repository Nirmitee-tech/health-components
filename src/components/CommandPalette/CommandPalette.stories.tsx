import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../Button/Button';
import { CommandPalette, useCommandPaletteShortcut, type CommandPaletteItem } from './CommandPalette';

const items: CommandPaletteItem[] = [
  { kind: 'Patient', label: 'Henna West', meta: '03/14/1988 . MRN-100231' },
  { kind: 'Screen', label: 'Claims', meta: 'Revenue', icon: 'dollar' },
  { kind: 'Screen', label: 'Prior Auth Queue', meta: 'Revenue', icon: 'shield' },
  { kind: 'Action', label: 'New Appointment', meta: 'Schedule' },
  { kind: 'Action', label: 'Check Eligibility', meta: 'Insurance' },
  { kind: 'Screen', label: 'Appearance and navigation', meta: 'Settings', icon: 'settings' },
];

const meta = {
  title: 'Complex/Navigation/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'CommandPalette is the Command Bar style\'s "Jump to anything" search for screens, patients and actions, opened with Ctrl K or Cmd K (`useCommandPaletteShortcut`). Combobox with a listbox: arrows, Enter, Escape. Documentation stories pass `inline`.',
      },
    },
  },
  argTypes: { placeholder: { control: 'text' }, defaultQuery: { control: 'text' } },
  args: { inline: true, items, onSelect: fn(), onClose: fn() },
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Filtered: Story = { args: { defaultQuery: 'rev' } };

export const NoResults: Story = { args: { defaultQuery: 'Ralph' } };

function OpenDemo() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string>('');
  useCommandPaletteShortcut(() => setOpen(true));
  return (
    <div className="pv-stack">
      <div className="co-row">
        <Button iconLeft="search" onClick={() => setOpen(true)}>
          Jump to anything
        </Button>
        <span className="co-muted">or press Ctrl K / Cmd K</span>
      </div>
      {picked ? <div>{`Opened: ${picked}`}</div> : null}
      <CommandPalette
        open={open}
        items={items}
        onSelect={(it) => {
          setPicked(it.label);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

/** The real overlay, also opened with Ctrl K / Cmd K. */
export const OpenWithShortcut: Story = { render: () => <OpenDemo /> };
