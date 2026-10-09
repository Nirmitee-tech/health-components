import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuditLogRow } from './AuditLogRow';

describe('AuditLogRow', () => {
  it('shows the action in words with reason and change', () => {
    render(
      <AuditLogRow
        event={{ time: '10/09 10:42', action: 'btg', user: 'Ana Ortiz MD', role: 'Provider', what: 'opened chart', patient: 'Nora Scott', reason: 'Emergency treatment', change: 'a -> b' }}
      />
    );
    expect(screen.getByText('Break the glass')).toBeInTheDocument();
    expect(screen.getByText('Patient Nora Scott . Reason: Emergency treatment')).toBeInTheDocument();
    expect(screen.getByTitle('Old and new value')).toHaveTextContent('a -> b');
  });
});
