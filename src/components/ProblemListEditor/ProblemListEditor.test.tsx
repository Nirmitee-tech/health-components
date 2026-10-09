import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProblemListEditor, type ProblemListEditorItem } from './ProblemListEditor';

const items: ProblemListEditorItem[] = [
  { snomed: '44054006', label: 'Type 2 diabetes mellitus', icd: [{ code: 'E11.9', label: 'Type 2 diabetes without complications' }], onset: '2019' },
  {
    snomed: '49436004',
    label: 'Atrial fibrillation',
    icd: [
      { code: 'I48.91', label: 'Unspecified atrial fibrillation' },
      { code: 'I48.0', label: 'Paroxysmal atrial fibrillation', rule: 'IF episodes end within 7 days' },
    ],
  },
  { snomed: '239873007', label: 'Osteoarthritis of knee', icd: [] },
];

const row = (label: string) => screen.getByText(label).closest('li')!;

describe('ProblemListEditor', () => {
  it('shows the map state in words', () => {
    render(<ProblemListEditor items={items} />);
    expect(within(row('Type 2 diabetes mellitus')).getByText('One ICD-10 match')).toBeInTheDocument();
    expect(within(row('Type 2 diabetes mellitus')).getByText('E11.9')).toBeInTheDocument();
    expect(within(row('Atrial fibrillation')).getByText('Pick ICD-10 code')).toBeInTheDocument();
    expect(within(row('Osteoarthritis of knee')).getByText('No ICD-10 map')).toBeInTheDocument();
  });

  it('calls onAdd from Add Problem', async () => {
    const onAdd = vi.fn();
    render(<ProblemListEditor items={items} onAdd={onAdd} />);
    await userEvent.click(screen.getByRole('button', { name: 'Add Problem' }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('picks an ICD-10 candidate', async () => {
    const onItemsChange = vi.fn();
    render(<ProblemListEditor items={items} onItemsChange={onItemsChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Edit Atrial fibrillation' }));
    const group = screen.getByRole('group', { name: /ICD-10-CM candidates/ });
    await userEvent.click(within(group).getByRole('radio', { name: /I48.0/ }));
    expect(onItemsChange.mock.calls.at(-1)![0][1].picked).toBe('I48.0');
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(within(row('Atrial fibrillation')).getByText('ICD-10 picked')).toBeInTheDocument();
    expect(within(row('Atrial fibrillation')).getByText('I48.0')).toBeInTheDocument();
  });

  it('resolves a problem', async () => {
    const onItemsChange = vi.fn();
    render(<ProblemListEditor items={items} onItemsChange={onItemsChange} />);
    const edit = screen.getByRole('button', { name: 'Edit Type 2 diabetes mellitus' });
    await userEvent.click(edit);
    expect(screen.getByRole('button', { name: 'Close Type 2 diabetes mellitus' })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'Resolved');
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(row('Type 2 diabetes mellitus')).toHaveTextContent('SNOMED CT 44054006 . Onset 2019 . Resolved');
    expect(onItemsChange.mock.calls.at(-1)![0][0].status).toBe('Resolved');
    expect(screen.queryByLabelText('Status')).not.toBeInTheDocument();
  });

  it('puts the problem back on Cancel', async () => {
    render(<ProblemListEditor items={items} />);
    await userEvent.click(screen.getByRole('button', { name: 'Edit Type 2 diabetes mellitus' }));
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'Entered in error');
    expect(row('Type 2 diabetes mellitus')).toHaveTextContent('Entered in error');
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(row('Type 2 diabetes mellitus')).not.toHaveTextContent('Entered in error');
  });

  it('warns when the concept has no map and opens from defaultEditing', () => {
    render(<ProblemListEditor items={items} defaultEditing={2} />);
    expect(screen.getByText(/This concept has no ICD-10-CM map/)).toBeInTheDocument();
  });

  it('has no edit buttons when read only, and an empty state', () => {
    const { unmount } = render(<ProblemListEditor items={items} readOnly />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    unmount();
    render(<ProblemListEditor items={[]} />);
    expect(screen.getByText('No problems recorded')).toBeInTheDocument();
  });
});
