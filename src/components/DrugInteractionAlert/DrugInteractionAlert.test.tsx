import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AllergyAlert, DrugInteractionAlert } from './DrugInteractionAlert';

describe('DrugInteractionAlert', () => {
  it('prefixes the title by kind and colours by severity', () => {
    const { rerender } = render(<DrugInteractionAlert title="Sertraline + Tramadol" body="Serotonin syndrome risk." severity="severe" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('co-alert-error');
    expect(alert).toHaveTextContent('Drug interaction: Sertraline + Tramadol');
    rerender(<DrugInteractionAlert kind="duplicate" title="Ibuprofen + Naproxen" body="Two NSAIDs." />);
    expect(screen.getByRole('status')).toHaveClass('co-alert-warning');
    expect(screen.getByRole('status')).toHaveTextContent('Duplicate therapy: Ibuprofen + Naproxen');
  });

  it('keeps Override and Continue disabled until a reason is chosen', async () => {
    const onOverride = vi.fn();
    const onReasonChange = vi.fn();
    render(
      <DrugInteractionAlert title="Sertraline + Tramadol" body="Risk." onOverride={onOverride} onReasonChange={onReasonChange} />
    );
    const override = screen.getByRole('button', { name: 'Override and Continue' });
    expect(override).toBeDisabled();
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Override reason/ }), 'Will monitor levels');
    expect(onReasonChange).toHaveBeenCalledWith('Will monitor levels');
    expect(override).toBeEnabled();
    await userEvent.click(override);
    expect(onOverride).toHaveBeenCalledWith('Will monitor levels');
  });

  it('calls onChangeOrder', async () => {
    const onChangeOrder = vi.fn();
    render(<DrugInteractionAlert title="A + B" body="Risk." onChangeOrder={onChangeOrder} />);
    await userEvent.click(screen.getByRole('button', { name: 'Change Order' }));
    expect(onChangeOrder).toHaveBeenCalledTimes(1);
  });

  it('blocks override when not overridable', () => {
    render(<DrugInteractionAlert title="A + B" body="Risk." overridable={false} />);
    expect(screen.getByText('This combination cannot be overridden. Choose another drug.')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('AllergyAlert uses the allergy prefix', () => {
    render(<AllergyAlert title="Amoxicillin" body="Penicillin allergy." severity="contraindicated" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Allergy alert: Amoxicillin');
  });
});
