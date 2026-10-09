import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Field, fieldDescribedBy } from './Field';

describe('Field', () => {
  it('labels the control and links the helper', () => {
    render(
      <Field label="Arrival Time" required helper="Clinic local time">
        {(c) => <input {...c} />}
      </Field>
    );
    const input = screen.getByRole('textbox', { name: /Arrival Time/ });
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAccessibleDescription('Clinic local time');
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows the error with role alert instead of the helper and marks invalid', () => {
    render(
      <Field label="Room" helper="Hint" error="Choose a room.">
        {(c) => <input {...c} />}
      </Field>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Choose a room.');
    expect(screen.queryByText('Hint')).not.toBeInTheDocument();
    const input = screen.getByRole('textbox', { name: 'Room' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Choose a room.');
  });

  it('renders the lock line and uses a given id', () => {
    render(
      <Field id="prov" label="Provider" lock="Your role can view but not edit">
        <input id="prov" aria-describedby="prov-lock" readOnly />
      </Field>
    );
    expect(screen.getByRole('textbox', { name: 'Provider' })).toHaveAccessibleDescription('Your role can view but not edit');
  });

  it('builds describedby ids', () => {
    expect(fieldDescribedBy('a', { error: 'x', helper: 'y', lock: true })).toBe('a-err a-lock');
    expect(fieldDescribedBy('a', { helper: 'y' })).toBe('a-help');
    expect(fieldDescribedBy('a', {})).toBeUndefined();
  });
});
