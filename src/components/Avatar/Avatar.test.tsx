import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar, getInitials } from './Avatar';

describe('Avatar', () => {
  it('skips titles when building initials', () => {
    expect(getInitials('Mandy Harley LCSW')).toBe('MH');
    expect(getInitials('Dr. James Bell MD')).toBe('JB');
    expect(getInitials('West, Henna')).toBe('WH');
    expect(getInitials('Cher')).toBe('C');
  });

  it('has role img with name and status', () => {
    render(<Avatar name="James Bell MD" status="busy" />);
    const av = screen.getByRole('img', { name: 'James Bell MD, busy' });
    expect(av).toHaveClass('co-av', 'co-av-md');
    expect(av).toHaveTextContent('JB');
  });
});
