import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DataTable, type DataTableColumn } from './DataTable';

interface Claim {
  id: string;
  patient: string;
  amount: number;
}

const columns: DataTableColumn<Claim>[] = [
  { key: 'id', label: 'Claim', sortable: true },
  { key: 'patient', label: 'Patient', sortable: true },
  { key: 'amount', label: 'Billed', sortable: true, align: 'right', render: (r) => `$${r.amount.toFixed(2)}` },
];

const rows: Claim[] = Array.from({ length: 12 }, (_, i) => ({
  id: `CLM-${20800 + i}`,
  patient: ['Henna West', 'Ralph Edwards', 'Nora Scott'][i % 3]!,
  amount: (i * 37) % 100,
}));

const bodyRows = () => screen.getAllByRole('row').slice(1);
const firstCells = () => bodyRows().map((r) => within(r).getAllByRole('cell')[0]!.textContent);

describe('DataTable', () => {
  it('renders columns and paginates with 10 rows by default', async () => {
    render(<DataTable caption="Claims" columns={columns} rows={rows} />);
    expect(screen.getByRole('table', { name: 'Claims' })).toBeInTheDocument();
    expect(bodyRows()).toHaveLength(10);
    expect(screen.getByText('Showing 1-10 of 12')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(bodyRows()).toHaveLength(2);
    expect(firstCells()).toEqual(['CLM-20810', 'CLM-20811']);
  });

  it('sorts ascending then descending and sets aria-sort', async () => {
    const onSortChange = vi.fn();
    render(<DataTable columns={columns} rows={rows} pagination={false} onSortChange={onSortChange} />);
    const th = screen.getByRole('columnheader', { name: /Billed/ });
    expect(th).toHaveAttribute('aria-sort', 'none');
    await userEvent.click(within(th).getByRole('button'));
    expect(th).toHaveAttribute('aria-sort', 'ascending');
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'amount', dir: 'asc' });
    const asc = bodyRows().map((r) => within(r).getAllByRole('cell')[2]!.textContent);
    expect(asc[0]).toBe('$0.00');
    await userEvent.click(within(th).getByRole('button'));
    expect(th).toHaveAttribute('aria-sort', 'descending');
    const desc = bodyRows().map((r) => within(r).getAllByRole('cell')[2]!.textContent);
    expect(desc[0]).toBe('$96.00');
    expect(screen.getByRole('columnheader', { name: 'Claim' })).toHaveAttribute('aria-sort', 'none');
  });

  it('respects a controlled sort', async () => {
    render(<DataTable columns={columns} rows={rows} pagination={false} sort={{ key: 'id', dir: 'desc' }} onSortChange={() => {}} />);
    expect(firstCells()[0]).toBe('CLM-20811');
    await userEvent.click(screen.getByRole('button', { name: /Patient/ }));
    expect(firstCells()[0]).toBe('CLM-20811');
  });

  it('selects rows, selects all on the page and shows bulk actions', async () => {
    const onSelectedChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        pageSize={5}
        selectable
        onSelectedChange={onSelectedChange}
        bulkActions={(ids) => <button type="button">Resubmit {ids.length}</button>}
      />
    );
    expect(screen.queryByRole('region', { name: 'Bulk actions' })).toBeNull();
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select CLM-20801' }));
    expect(onSelectedChange).toHaveBeenLastCalledWith(['CLM-20801']);
    const all = screen.getByRole('checkbox', { name: 'Select all on this page' }) as HTMLInputElement;
    expect(all.indeterminate).toBe(true);
    expect(screen.getByRole('region', { name: 'Bulk actions' })).toHaveTextContent('1 selected');
    expect(bodyRows()[1]).toHaveClass('is-sel');
    await userEvent.click(all);
    expect(onSelectedChange).toHaveBeenLastCalledWith(['CLM-20801', 'CLM-20800', 'CLM-20802', 'CLM-20803', 'CLM-20804']);
    expect(all.checked).toBe(true);
    expect(screen.getByRole('button', { name: 'Resubmit 5' })).toBeInTheDocument();
    await userEvent.click(all);
    expect(onSelectedChange).toHaveBeenLastCalledWith([]);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select CLM-20800' }));
    await userEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(screen.queryByRole('region', { name: 'Bulk actions' })).toBeNull();
  });

  it('expands rows', async () => {
    render(
      <DataTable columns={columns} rows={rows.slice(0, 2)} renderExpanded={(r) => <p>Lines for {r.id}</p>} defaultExpanded={['CLM-20801']} />
    );
    expect(screen.getByText('Lines for CLM-20801')).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: 'Expand CLM-20800' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(btn);
    expect(screen.getByText('Lines for CLM-20800')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Collapse CLM-20800' }));
    expect(screen.queryByText('Lines for CLM-20800')).toBeNull();
  });

  it('opens a row menu', async () => {
    const onSelect = vi.fn();
    render(<DataTable columns={columns} rows={rows.slice(0, 1)} rowMenu={() => [{ label: 'Void Claim', onSelect }]} />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions for CLM-20800' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Void Claim' }));
    expect(onSelect).toHaveBeenCalled();
  });

  it('shows the empty text and the loading state', () => {
    const { rerender } = render(<DataTable columns={columns} rows={[]} />);
    expect(screen.getByText('No records match your search or filters.')).toBeInTheDocument();
    rerender(<DataTable columns={columns} rows={[]} emptyText="No claims yet." />);
    expect(screen.getByText('No claims yet.')).toBeInTheDocument();
    rerender(<DataTable columns={columns} rows={rows} loading />);
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  it('supports a controlled page and resets to page 1 on page size change', async () => {
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();
    const { rerender } = render(
      <DataTable columns={columns} rows={rows} page={2} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} pageSize={5} />
    );
    expect(firstCells()[0]).toBe('CLM-20805');
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);
    expect(firstCells()[0]).toBe('CLM-20805');
    rerender(<DataTable columns={columns} rows={rows} page={3} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} pageSize={5} />);
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Rows per page/ }), '10');
    expect(onPageSizeChange).toHaveBeenCalledWith(10);
    expect(onPageChange).toHaveBeenLastCalledWith(1);
  });
});
