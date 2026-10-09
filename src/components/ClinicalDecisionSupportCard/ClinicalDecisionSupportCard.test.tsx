import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ClinicalDecisionSupportCard, type CdsCard } from './ClinicalDecisionSupportCard';

const crit: CdsCard = {
  indicator: 'critical',
  summary: 'Potassium 6.8 mmol/L with spironolactone ordered',
  source: { label: 'CareOS renal dosing' },
  values: [{ code: 'K', value: 6.8 }],
  suggestions: [{ label: 'Cancel spironolactone order', isRecommended: true }, { label: 'Order STAT BMP' }],
  overrideReasons: [
    { code: 'aware', display: 'Aware, monitoring closely' },
    { code: 'nephro', display: 'Nephrology approved' },
  ],
};
const info: CdsCard = {
  indicator: 'info',
  summary: 'Patient is due for colorectal cancer screening',
  suggestions: [{ label: 'Order FIT kit' }],
  links: [{ label: 'Guideline' }, { label: 'USPSTF', url: 'https://example.org/uspstf' }],
};

describe('ClinicalDecisionSupportCard', () => {
  it('uses role alert for critical cards and a labelled region otherwise', () => {
    const { unmount } = render(<ClinicalDecisionSupportCard card={crit} />);
    expect(screen.getByRole('alert', { name: 'Critical decision support: ' + crit.summary })).toBeInTheDocument();
    expect(screen.getByText('Source: CareOS renal dosing')).toBeInTheDocument();
    expect(screen.getByText(' (3.5–5.1 mmol/L)', { normalizer: (t) => t })).toHaveClass('cp-rr');
    unmount();
    render(<ClinicalDecisionSupportCard card={info} />);
    expect(screen.getByRole('region', { name: 'Info decision support: ' + info.summary })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('applies a suggestion', async () => {
    const onAccept = vi.fn();
    const onStateChange = vi.fn();
    render(<ClinicalDecisionSupportCard card={crit} onAccept={onAccept} onStateChange={onStateChange} />);
    const rec = screen.getByRole('button', { name: 'Cancel spironolactone order' });
    expect(rec).toHaveClass('co-btn-pri');
    await userEvent.click(rec);
    expect(onAccept).toHaveBeenCalledWith(crit.suggestions![0]);
    expect(onStateChange).toHaveBeenCalledWith('accepted');
    expect(screen.getByRole('status')).toHaveTextContent('Suggestion applied');
  });

  it('needs a coded reason to override', async () => {
    const onOverride = vi.fn();
    render(<ClinicalDecisionSupportCard card={crit} onOverride={onOverride} />);
    await userEvent.click(screen.getByRole('button', { name: 'Override' }));
    const go = screen.getByRole('button', { name: 'Override and Continue' });
    expect(go).toBeDisabled();
    expect(go).toHaveClass('co-btn-dng');
    await userEvent.selectOptions(screen.getByLabelText(/Override reason/), 'nephro');
    await userEvent.click(go);
    expect(onOverride).toHaveBeenCalledWith('nephro');
    expect(screen.getByRole('status')).toHaveTextContent('Overridden');
    expect(screen.getByText('Reason: Nephrology approved')).toBeInTheDocument();
  });

  it('needs typed text for Other', async () => {
    const onOverride = vi.fn();
    render(<ClinicalDecisionSupportCard card={crit} onOverride={onOverride} />);
    await userEvent.click(screen.getByRole('button', { name: 'Override' }));
    await userEvent.selectOptions(screen.getByLabelText(/Override reason/), 'other');
    const go = screen.getByRole('button', { name: 'Override and Continue' });
    expect(go).toBeDisabled();
    await userEvent.type(screen.getByLabelText(/^Reason/), '  ');
    expect(go).toBeDisabled();
    await userEvent.type(screen.getByLabelText(/^Reason/), 'Hospice, comfort care');
    await userEvent.click(go);
    expect(onOverride).toHaveBeenCalledWith('other', 'Hospice, comfort care');
    expect(screen.getByText('Reason: Hospice, comfort care')).toBeInTheDocument();
  });

  it('goes back from the override form', async () => {
    render(<ClinicalDecisionSupportCard card={info} feedback={false} />);
    expect(screen.queryByText('Overrides are logged with the reason.')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('renders links: url as a link, otherwise a button calling onLink', async () => {
    const onLink = vi.fn();
    render(<ClinicalDecisionSupportCard card={info} onLink={onLink} />);
    expect(screen.getByRole('link', { name: 'USPSTF' })).toHaveAttribute('href', 'https://example.org/uspstf');
    await userEvent.click(screen.getByRole('button', { name: 'Guideline' }));
    expect(onLink).toHaveBeenCalledWith(info.links![0]);
  });

  it('shows an overridden card with the given reason', () => {
    render(<ClinicalDecisionSupportCard card={info} defaultState="overridden" overrideReason="Done elsewhere" />);
    expect(screen.getByText('Reason: Done elsewhere')).toBeInTheDocument();
  });
});
