import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { HistoryPanels } from './HistoryPanels';

describe('HistoryPanels', () => {
  it('switches tabs and links the panel to the selected tab', async () => {
    const onTabChange = vi.fn();
    render(
      <HistoryPanels
        pmh={[{ code: 'I21.4', label: 'NSTEMI', when: '2022', note: 'PCI to LAD' }]}
        psh={[]}
        family={[{ relation: 'Father', side: 'Paternal', deceased: true, ageAtDeath: 61, conditions: [{ label: 'Myocardial infarction', onset: 58, causeOfDeath: true }] }]}
        onTabChange={onTabChange}
      />
    );
    const panel = screen.getByRole('tabpanel', { name: 'Medical (1)' });
    expect(panel).toHaveTextContent('NSTEMI');
    await userEvent.click(screen.getByRole('tab', { name: 'Surgical (0)' }));
    expect(onTabChange).toHaveBeenCalledWith('psh');
    expect(screen.getByRole('tabpanel', { name: 'Surgical (0)' })).toHaveTextContent('No past surgeries');
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tabpanel', { name: 'Family (1)' })).toHaveTextContent('Myocardial infarction, onset 58, cause of death');
    expect(screen.getByRole('list', { name: 'Family history by relative' })).toHaveTextContent('Paternal side . Deceased at 61');
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tabpanel', { name: 'Social and needs' })).toHaveTextContent('Social history not asked');
  });

  it('shows social history with the AUDIT-C flag and SDOH referrals', async () => {
    const onRefer = vi.fn();
    render(
      <HistoryPanels
        defaultTab="soc"
        onRefer={onRefer}
        social={{
          tobacco: 'Former smoker',
          packYears: 22.5,
          auditC: 4,
          sex: 'M',
          sdoh: [{ domain: 'Food insecurity', answer: 'Sometimes true', result: 'positive' }],
        }}
      />
    );
    expect(screen.getByText('22.5')).toBeInTheDocument();
    expect(screen.getByText('Need found')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Refer for food insecurity' }));
    expect(onRefer).toHaveBeenCalledWith(expect.objectContaining({ domain: 'Food insecurity' }));
  });

  it('calls Mark Reviewed and Add, hidden when read only', async () => {
    const onMarkReviewed = vi.fn();
    const onAdd = vi.fn();
    const { unmount } = render(<HistoryPanels defaultTab="psh" onMarkReviewed={onMarkReviewed} onAdd={onAdd} />);
    expect(screen.getByText('Not reviewed this visit')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Mark Reviewed' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(onMarkReviewed).toHaveBeenCalled();
    expect(onAdd).toHaveBeenCalledWith('psh');
    unmount();
    render(<HistoryPanels readOnly />);
    expect(screen.queryByRole('button', { name: 'Add' })).not.toBeInTheDocument();
  });
});
