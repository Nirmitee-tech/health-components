import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RoleSwitcher } from '../RoleSwitcher/RoleSwitcher';
import { RolePill, ViewingAs } from './RolePill';

const roles = ['Provider', { label: 'Biller' }, { label: 'Patient', hint: 'Portal view' }];

describe('RolePill', () => {
  it('shows the role on a menu button', () => {
    render(<RolePill role="Biller" roles={roles} />);
    const btn = screen.getByRole('button', { name: 'Change the role you are viewing as' });
    expect(btn).toHaveClass('co-rpill');
    expect(btn).toHaveAttribute('aria-haspopup', 'menu');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(btn).toHaveTextContent('Viewing as: Biller');
  });

  it('opens the menu, marks the current role and changes it', async () => {
    const onChange = vi.fn();
    render(<RolePill defaultRole="Biller" roles={roles} onChange={onChange} />);
    const btn = screen.getByRole('button', { name: 'Change the role you are viewing as' });
    await userEvent.click(btn);
    expect(screen.getByRole('menu', { name: 'Roles' })).toBeInTheDocument();
    expect(screen.getByText('Preview CareOS as another role. Nothing is saved.')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Biller' })).toHaveClass('is-on');
    expect(screen.getByRole('menuitem', { name: /Patient/ })).toHaveTextContent('Portal view');
    await userEvent.click(screen.getByRole('menuitem', { name: 'Provider' }));
    expect(onChange).toHaveBeenCalledWith('Provider');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(btn).toHaveTextContent('Viewing as: Provider');
    expect(btn).toHaveFocus();
  });

  it('closes on Escape and outside click', async () => {
    render(
      <>
        <RolePill role="Biller" roles={roles} defaultOpen />
        <p>outside</p>
      </>
    );
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await userEvent.click(screen.getByText('outside'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    screen.getByRole('button').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getAllByRole('menuitem')[0]).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('exports the ViewingAs and RoleSwitcher aliases', () => {
    expect(ViewingAs).toBe(RolePill);
    expect(RoleSwitcher).toBe(RolePill);
  });
});
