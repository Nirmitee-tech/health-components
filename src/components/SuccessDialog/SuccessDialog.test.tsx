import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SuccessDialog } from './SuccessDialog';

describe('SuccessDialog', () => {
  it('renders an alertdialog with title, body and buttons', async () => {
    const onOkay = vi.fn();
    const onSecondary = vi.fn();
    render(
      <SuccessDialog inline title="Patient Added Successfully" secondary="Add Another Patient" onOkay={onOkay} onSecondary={onSecondary}>
        Ready for scheduling.
      </SuccessDialog>
    );
    const dlg = screen.getByRole('alertdialog', { name: 'Patient Added Successfully' });
    expect(dlg).toHaveAccessibleDescription('Ready for scheduling.');
    await userEvent.click(screen.getByRole('button', { name: 'Okay' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add Another Patient' }));
    expect(onOkay).toHaveBeenCalledTimes(1);
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });

  it('focuses Okay when opened and Escape calls onOkay', async () => {
    const onOkay = vi.fn();
    render(<SuccessDialog title="ERA Posted and Closed Successfully" okayLabel="Done" onOkay={onOkay} />);
    const okay = await screen.findByRole('button', { name: 'Done' });
    expect(okay).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(onOkay).toHaveBeenCalledTimes(1);
  });
});
