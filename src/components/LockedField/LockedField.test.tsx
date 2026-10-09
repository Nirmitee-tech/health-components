import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LockedField } from './LockedField';

describe('LockedField', () => {
  it('is read-only, keeps the value and describes the lock', () => {
    render(<LockedField label="Member ID" value="W123456789" />);
    const input = screen.getByRole('textbox', { name: /Member ID/ });
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveValue('W123456789');
    expect(input).toHaveAccessibleDescription(/Your role can view but not edit/);
  });

  it('takes a custom message', () => {
    render(<LockedField label="Fee" value="$182.00" message="Needs Manage fee schedule" />);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription(/Needs Manage fee schedule/);
  });
});
