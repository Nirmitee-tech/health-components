import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CareGapRow, type CareGapData } from './CareGapRow';

const open: CareGapData = { measure: 'Colorectal cancer screening (CMS130)', detail: 'Last FIT 08/2023', due: 'Now', status: 'open', action: 'Order FIT' };

describe('CareGapRow', () => {
  it('shows status in words and the split action for open gaps', async () => {
    const onAction = vi.fn();
    render(<CareGapRow gap={open} onAction={onAction} />);
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('Last FIT 08/2023 . Due Now')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Order FIT' }));
    expect(onAction).toHaveBeenCalledWith('primary', open);
    await userEvent.click(screen.getByRole('button', { name: /More actions/ }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Mark Excluded (reason)' }));
    expect(onAction).toHaveBeenCalledWith('exclude', open);
  });

  it('has no action for closed or excluded gaps', () => {
    render(
      <>
        <CareGapRow gap={{ measure: 'A1c', status: 'closed' }} />
        <CareGapRow gap={{ measure: 'Mammogram', status: 'excluded' }} />
      </>
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
    expect(screen.getByText('Excluded')).toBeInTheDocument();
  });
});
