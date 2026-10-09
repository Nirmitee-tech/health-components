import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PermissionDenied, PermissionState } from './PermissionState';

describe('PermissionState', () => {
  it('lock is a status banner naming role and permission', () => {
    render(<PermissionState role="Biller" permission="Edit clinical chart" />);
    expect(screen.getByRole('status')).toHaveTextContent(
      'Your role (Biller) can view this screen but not edit it. Fields and save buttons are locked. Permission needed to edit: Edit clinical chart.'
    );
  });

  it('denied is an alert with actions', async () => {
    const onCompareRoles = vi.fn();
    render(<PermissionState kind="denied" role="Front Desk" permission="Manage claims" onCompareRoles={onCompareRoles} />);
    expect(screen.getByRole('alert')).toHaveTextContent('You do not have access to this screen');
    expect(screen.getByText(/does not include the permission Manage claims/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Compare roles' }));
    expect(onCompareRoles).toHaveBeenCalled();
  });

  it('preview links back to the staff app', () => {
    render(<PermissionState kind="preview" role="Front Desk" home="/staff" />);
    expect(screen.getByRole('link', { name: 'Back to staff app' })).toHaveAttribute('href', '/staff');
  });

  it('hidden shows the note', () => {
    render(<PermissionState kind="hidden" role="Nurse / MA" />);
    expect(screen.getByText(/Hidden for Nurse \/ MA/)).toBeInTheDocument();
  });

  it('PermissionDenied is the denied kind', () => {
    render(<PermissionDenied role="Front Desk" permission="Manage claims" className="x" />);
    expect(screen.getByRole('heading', { name: 'You do not have access to this screen' })).toBeInTheDocument();
  });
});
