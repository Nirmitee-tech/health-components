import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MedReconciliation, type MedRecRow } from './MedReconciliation';

const rows: MedRecRow[] = [
  {
    home: {
      name: 'Furosemide',
      dose: 20,
      unit: 'mg',
      route: 'PO',
      freq: 'Daily',
    },
    inpatient: {
      name: 'Furosemide',
      dose: 40,
      unit: 'mg',
      route: 'IV',
      freq: 'BID',
    },
    modified: {
      name: 'Furosemide',
      dose: 40,
      unit: 'mg',
      route: 'PO',
      freq: 'BID',
    },
  },
  {
    home: null,
    inpatient: {
      name: 'Metoprolol succinate',
      dose: 25,
      unit: 'mg',
      route: 'PO',
      freq: 'Daily',
    },
  },
  {
    home: {
      name: 'Levothyroxine',
      dose: 0.075,
      unit: 'mg',
      route: 'PO',
      freq: 'Daily',
    },
    inpatient: null,
    decision: 'continue',
  },
];

describe('MedReconciliation', () => {
  it('blocks signing until every row has a decision', async () => {
    const onSign = vi.fn();
    render(<MedReconciliation patient="Okafor, Grace" rows={rows} onSign={onSign} />);
    const sign = screen.getByRole('button', { name: '2 without a decision' });
    expect(sign).toBeDisabled();
    expect(screen.getAllByText('Needs decision')).toHaveLength(2);

    await userEvent.click(
      within(screen.getByRole('radiogroup', { name: 'Decision for Furosemide' })).getByRole('radio', { name: 'Modify' })
    );
    await userEvent.click(
      within(
        screen.getByRole('radiogroup', {
          name: 'Decision for Metoprolol succinate',
        })
      ).getByRole('radio', { name: 'New' })
    );

    const ready = screen.getByRole('button', { name: 'Sign Reconciliation' });
    expect(ready).toBeEnabled();
    await userEvent.click(ready);
    expect(onSign).toHaveBeenCalledTimes(1);
    expect(onSign.mock.calls[0]![0].map((r: MedRecRow) => r.decision)).toEqual(['modify', 'new', 'continue']);
  });

  it('offers continue, modify and stop for home medicines and new or stop for inpatient-only ones', () => {
    render(<MedReconciliation rows={rows} />);
    const home = screen.getByRole('radiogroup', {
      name: 'Decision for Furosemide',
    });
    expect(
      within(home)
        .getAllByRole('radio')
        .map((r) => r.textContent)
    ).toEqual(['Continue', 'Modify', 'Stop']);
    const inpt = screen.getByRole('radiogroup', {
      name: 'Decision for Metoprolol succinate',
    });
    expect(
      within(inpt)
        .getAllByRole('radio')
        .map((r) => r.textContent)
    ).toEqual(['New', 'Stop']);
  });

  it('shows the discharge prescription per decision and writes doses the ISMP way', async () => {
    render(<MedReconciliation rows={rows} />);
    // 0.075 mg keeps its leading zero
    expect(screen.getAllByText('0.075').length).toBeGreaterThan(0);
    const group = screen.getByRole('radiogroup', {
      name: 'Decision for Furosemide',
    });
    await userEvent.click(within(group).getByRole('radio', { name: 'Stop' }));
    expect(within(group).getByRole('radio', { name: 'Stop' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('Stopped')).toBeInTheDocument();
  });

  it('moves and selects with the arrow keys (one tab stop per group)', async () => {
    const onRowsChange = vi.fn();
    render(<MedReconciliation rows={rows} onRowsChange={onRowsChange} />);
    const group = screen.getByRole('radiogroup', {
      name: 'Decision for Levothyroxine',
    });
    const radios = within(group).getAllByRole('radio');
    expect(radios.map((r) => r.tabIndex)).toEqual([0, -1, -1]);
    radios[0]!.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(radios[1]).toHaveFocus();
    expect(radios[1]).toHaveAttribute('aria-checked', 'true');
    expect(onRowsChange).toHaveBeenLastCalledWith(
      expect.arrayContaining([expect.objectContaining({ decision: 'modify' })])
    );
    await userEvent.keyboard('{End}');
    expect(radios[2]).toHaveAttribute('aria-checked', 'true');
  });

  it('is controlled with rowsValue', async () => {
    const onRowsChange = vi.fn();
    render(<MedReconciliation rows={rows} rowsValue={rows} onRowsChange={onRowsChange} />);
    await userEvent.click(
      within(screen.getByRole('radiogroup', { name: 'Decision for Furosemide' })).getByRole('radio', {
        name: 'Continue',
      })
    );
    expect(onRowsChange).toHaveBeenCalledTimes(1);
    expect(
      within(screen.getByRole('radiogroup', { name: 'Decision for Furosemide' })).getByRole('radio', {
        name: 'Continue',
      })
    ).toHaveAttribute('aria-checked', 'false');
  });

  it('is view only when signed', () => {
    render(<MedReconciliation rows={rows} readOnly signedBy="Dr. Ortiz, 10/09 15:10" />);
    expect(screen.getByText('Signed by Dr. Ortiz, 10/09 15:10. View only.')).toBeInTheDocument();
    screen.getAllByRole('radio').forEach((r) => expect(r).toBeDisabled());
  });
});
