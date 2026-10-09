import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ADTPanel, type ADTPatient } from './ADTPanel';

const ed: ADTPatient = {
  name: 'Silva, Marisol',
  mrn: '40018822',
  location: 'ED Bay 7',
  status: 'ed',
};
const icu: ADTPatient = {
  name: 'Hassan, Omar',
  mrn: '40021345',
  location: 'MICU 12',
  status: 'inpatient',
  level: 'icu',
};

describe('ADTPanel', () => {
  it('admits once a diagnosis is entered', async () => {
    const onSubmit = vi.fn();
    render(<ADTPanel patient={ed} level="tele" onSubmit={onSubmit} />);
    expect(screen.getByRole('tab', { name: 'Transfer' })).toBeDisabled();
    const admit = screen.getByRole('button', { name: 'Admit Patient' });
    expect(admit).toBeDisabled();
    await userEvent.type(screen.getByRole('textbox', { name: /Admitting diagnosis/ }), 'NSTEMI');
    await userEvent.click(admit);
    expect(onSubmit).toHaveBeenCalledWith({
      mode: 'admit',
      level: 'tele',
      reason: 'NSTEMI',
    });
    expect(screen.getByText('Admission placed')).toBeInTheDocument();
    expect(admit).toBeDisabled();
  });

  it('warns on a step down from ICU', async () => {
    render(<ADTPanel patient={icu} mode="transfer" level="icu" reason="Stable" />);
    expect(screen.queryByText('Step-down in care')).not.toBeInTheDocument();
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Transfer to level of care/ }), 'medsurg');
    expect(screen.getByText('Step-down in care')).toBeInTheDocument();
    expect(screen.getByRole('tabpanel')).toHaveAttribute(
      'aria-labelledby',
      screen.getByRole('tab', { name: 'Transfer' }).id
    );
  });

  it('blocks discharge while items are open and asks for the AMA form', async () => {
    const onModeChange = vi.fn();
    render(
      <ADTPanel
        patient={icu}
        mode="transfer"
        reason="x"
        blockers={['Home oxygen not delivered']}
        onModeChange={onModeChange}
      />
    );
    await userEvent.click(screen.getByRole('tab', { name: 'Discharge' }));
    expect(onModeChange).toHaveBeenCalledWith('discharge');
    expect(screen.getByText('Discharge is blocked by 1 item')).toBeInTheDocument();
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /Discharge disposition/ }),
      'Left against medical advice'
    );
    expect(screen.getByText('AMA form required')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Discharge Patient' })).toBeDisabled();
  });

  it('shows required errors and calls onCancel', async () => {
    const onCancel = vi.fn();
    render(<ADTPanel patient={ed} showErrors onCancel={onCancel} />);
    expect(screen.getByText('Enter a reason')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
