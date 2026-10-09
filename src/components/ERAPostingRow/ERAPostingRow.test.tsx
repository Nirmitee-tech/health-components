import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ERAPostingRow, type EraRow } from './ERAPostingRow';

const row: EraRow = {
  patient: 'Henna West',
  cpt: '99214',
  dos: '10/06/2026',
  claim: 'CLM-20871',
  billed: 182,
  allowed: 118.4,
  paid: 93.4,
  patientResp: 25,
  adjustments: [{ group: 'CO', code: '45', amount: 63.6, text: 'Charge exceeds fee schedule' }],
  remarks: [{ code: 'N54', text: 'Claim info inconsistent' }],
};

describe('ERAPostingRow', () => {
  it('is balanced despite floating point and posts the row', async () => {
    const onPost = vi.fn();
    render(<ERAPostingRow row={row} onPost={onPost} />);
    expect(screen.getByText('Balanced')).toBeInTheDocument();
    expect(screen.getByText('-$63.60')).toBeInTheDocument();
    expect(screen.getByText('CO-45 $63.60')).toHaveAttribute('title', 'Charge exceeds fee schedule');
    expect(screen.getByText('RARC N54')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Post/ }));
    expect(onPost).toHaveBeenCalledWith(row);
  });

  it('flags an out-of-balance line and disables Post', () => {
    const { container } = render(<ERAPostingRow row={{ ...row, paid: 0, patientResp: 0, allowed: 96 }} />);
    expect(screen.getByText('Out of balance $96.00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Post/ })).toBeDisabled();
    expect(container.firstChild).toHaveClass('co-era', 'is-bad');
  });
});
