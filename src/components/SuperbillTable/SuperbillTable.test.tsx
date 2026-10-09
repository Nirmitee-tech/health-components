import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SuperbillTable, type SuperbillGroup } from './SuperbillTable';

const groups: SuperbillGroup[] = [
  { name: 'Office visits', codes: [{ code: '99213', label: 'Low', fee: 118 }, { code: '99214', label: 'Moderate', fee: 182 }] },
  { name: 'Labs', codes: [{ code: '83036', label: 'Hemoglobin A1c', fee: 38 }] },
];

describe('SuperbillTable', () => {
  it('totals the default selection and updates as codes are ticked', async () => {
    const onSelectedChange = vi.fn();
    const onSend = vi.fn();
    render(<SuperbillTable groups={groups} defaultSelected={['99214']} onSelectedChange={onSelectedChange} onSend={onSend} />);
    expect(screen.getByText('Total $182.00')).toBeInTheDocument();
    const a1c = screen.getByRole('checkbox', { name: /83036/ });
    await userEvent.click(a1c);
    expect(a1c).toBeChecked();
    expect(onSelectedChange).toHaveBeenLastCalledWith(['99214', '83036']);
    expect(screen.getByText('Total $220.00')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('checkbox', { name: /99214/ }));
    expect(screen.getByText('Total $38.00')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Send to Billing' }));
    expect(onSend).toHaveBeenCalledWith(['83036']);
  });

  it('groups codes in labelled fieldsets', () => {
    render(<SuperbillTable groups={groups} />);
    expect(screen.getByRole('group', { name: 'Labs' })).toBeInTheDocument();
  });

  it('is controllable', async () => {
    const onSelectedChange = vi.fn();
    render(<SuperbillTable groups={groups} selected={['99213']} onSelectedChange={onSelectedChange} />);
    await userEvent.click(screen.getByRole('checkbox', { name: /99214/ }));
    expect(onSelectedChange).toHaveBeenCalledWith(['99213', '99214']);
    expect(screen.getByRole('checkbox', { name: /99214/ })).not.toBeChecked();
  });
});
