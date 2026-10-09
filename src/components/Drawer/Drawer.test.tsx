import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Drawer } from './Drawer';

describe('Drawer', () => {
  it('renders a right drawer labelled by its title with a footer', () => {
    render(
      <Drawer inline title="Claim CLM-20871" footer={<button>Resubmit</button>}>
        Body
      </Drawer>
    );
    const dlg = screen.getByRole('dialog', { name: 'Claim CLM-20871' });
    expect(dlg).toHaveClass('co-drawer');
    expect(dlg.parentElement).toHaveClass('co-ov', 'co-ov-r', 'co-inline');
    expect(screen.getByRole('button', { name: 'Resubmit' })).toBeInTheDocument();
  });

  it('renders the developer panel with sections', () => {
    render(
      <Drawer
        inline
        developer
        title="Prior Auth Queue"
        width={420}
        sections={[
          { title: 'Purpose and roles', body: 'Work list' },
          { title: 'API', code: 'GET /fhir/Claim' },
        ]}
      />
    );
    const dlg = screen.getByRole('dialog', { name: 'For developers: Prior Auth Queue' });
    expect(dlg).toHaveClass('co-dev');
    expect(dlg).toHaveStyle({ width: 'min(420px,100%)' });
    expect(screen.getByRole('heading', { name: 'API' })).toBeInTheDocument();
    expect(screen.getByText('GET /fhir/Claim').tagName).toBe('PRE');
    expect(screen.getByRole('button', { name: 'Close developer panel' })).toBeInTheDocument();
  });

  it('renders a bottom sheet with a grab handle', () => {
    const { container } = render(<Drawer inline side="bottom" title="Visit options" />);
    expect(screen.getByRole('dialog')).toHaveClass('co-sheet');
    expect(container.querySelector('.co-grab')).toBeInTheDocument();
    expect(container.querySelector('.co-ov-b')).toBeInTheDocument();
  });

  it('closes on Escape and the x button when portalled', async () => {
    const onClose = vi.fn();
    render(<Drawer title="Filters" onClose={onClose} />);
    const dlg = await screen.findByRole('dialog', { name: 'Filters' });
    expect(dlg).toHaveAttribute('aria-modal', 'true');
    expect(dlg.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard('{Escape}');
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
