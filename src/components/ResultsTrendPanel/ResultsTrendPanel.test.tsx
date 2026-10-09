import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ResultsTrendPanel, type ResultsTrendGroup } from './ResultsTrendPanel';

const groups: ResultsTrendGroup[] = [
  {
    name: 'Basic metabolic panel',
    panel: '51990-0',
    items: [
      { code: 'K', points: [{ date: '07/02/2026', value: 4.6 }, { date: '10/01/2026', value: 5.6 }] },
      { code: 'Glu', points: [{ date: '09/22/2026', value: 188 }] },
    ],
  },
];

describe('ResultsTrendPanel', () => {
  it('shows tiles with the last value, the range and the change', () => {
    const { container } = render(<ResultsTrendPanel groups={groups} />);
    const section = screen.getByRole('region', { name: 'Basic metabolic panel' });
    expect(section).toHaveTextContent('Basic metabolic panel . LOINC panel 51990-0');
    expect(section).toHaveTextContent('Ref 3.5–5.1 mmol/L');
    expect(section).toHaveTextContent('10/01/2026 . +1.0 mmol/L since 07/02/2026');
    expect(section).toHaveTextContent('09/22/2026 . first result');
    expect(container.querySelector('.cp-tile.is-H')).toHaveTextContent('Potassium');
    expect(screen.getByRole('img', { name: 'Potassium trend: 4.6, 5.6' })).toBeInTheDocument();
  });

  it('switches to the table view with a column per date', async () => {
    const onViewChange = vi.fn();
    render(<ResultsTrendPanel groups={groups} onViewChange={onViewChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Table' }));
    expect(onViewChange).toHaveBeenCalledWith('table');
    const table = screen.getByRole('table', { name: 'Results by date' });
    const heads = within(table).getAllByRole('columnheader').map((h) => h.textContent);
    expect(heads).toEqual(['Test', 'Reference', '07/02/2026', '09/22/2026', '10/01/2026']);
    expect(within(table).getAllByRole('img', { name: 'Not drawn' }).length).toBe(3);
  });

  it('keeps the last maxColumns dates', () => {
    render(<ResultsTrendPanel groups={groups} defaultView="table" maxColumns={1} />);
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Test', 'Reference', '10/01/2026']);
  });

  it('shows the empty state', () => {
    render(<ResultsTrendPanel groups={[]} />);
    expect(screen.getByText('No results in this period')).toBeInTheDocument();
  });
});
