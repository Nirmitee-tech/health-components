import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { BarcodeScanPrompt } from './BarcodeScanPrompt';

describe('BarcodeScanPrompt', () => {
  it('waits for a scan with a labelled field', () => {
    render(<BarcodeScanPrompt step={1} target="patient" expected="MRN0048213" expectedLabel="Marcus Hill" />);
    expect(screen.getByRole('group', { name: 'Step 1: Scan the patient wristband for Marcus Hill' })).toHaveClass('nu-scan', 'is-wait');
    expect(screen.getByRole('textbox', { name: 'Barcode for patient wristband' })).toBeInTheDocument();
  });

  it('matches case-insensitively and trimmed, and reports the scan', async () => {
    const onScan = vi.fn();
    render(<BarcodeScanPrompt expected="NDC0409-7332" expectedLabel="cefTRIAXone 1 g" onScan={onScan} onReset={() => {}} />);
    await userEvent.type(screen.getByRole('textbox'), ' ndc0409-7332 {Enter}');
    expect(onScan).toHaveBeenCalledWith(' ndc0409-7332 ', true);
    expect(screen.getByRole('group')).toHaveClass('is-ok');
    expect(screen.getByText('Scan matches cefTRIAXone 1 g')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Scanned ndc0409-7332');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('shows a mismatch with the expected code and keeps the field', async () => {
    const onScan = vi.fn();
    render(<BarcodeScanPrompt expected="NDC0002-7510" onScan={onScan} />);
    await userEvent.type(screen.getByRole('textbox'), 'NDC0002-8215');
    await userEvent.click(screen.getByRole('button', { name: 'Check' }));
    expect(onScan).toHaveBeenCalledWith('NDC0002-8215', false);
    expect(screen.getByRole('group')).toHaveClass('is-bad');
    expect(screen.getByText(/Scan does not match\. Do not give\./)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Scanned NDC0002-8215, expected NDC0002-7510');
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('goes to the override state on Cannot scan', async () => {
    const onOverride = vi.fn();
    const onStateChange = vi.fn();
    render(<BarcodeScanPrompt target="witness" allowOverride onOverride={onOverride} onStateChange={onStateChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cannot scan' }));
    expect(onOverride).toHaveBeenCalled();
    expect(onStateChange).toHaveBeenCalledWith('override');
    expect(screen.getByText('Scan skipped with reason: barcode damaged')).toBeInTheDocument();
  });

  it('rescans from the matched state', async () => {
    const onReset = vi.fn();
    render(<BarcodeScanPrompt defaultState="matched" defaultCode="NDC1" expected="NDC1" onReset={onReset} />);
    await userEvent.click(screen.getByRole('button', { name: 'Rescan' }));
    expect(onReset).toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('follows the controlled state', () => {
    render(<BarcodeScanPrompt state="mismatch" expected="A" defaultCode="B" />);
    expect(screen.getByRole('group')).toHaveClass('is-bad');
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<BarcodeScanPrompt ref={ref} className="x" />);
    expect(ref.current).toHaveClass('nu-scan', 'x');
  });
});
