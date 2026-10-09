import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PATimeline } from './index';

describe('Timeline', () => {
  it('renders an ordered list with the current step marked', () => {
    render(
      <PATimeline
        items={[
          { title: 'Submitted', time: '10/01/2026', by: 'Sam Patel', tag: 'Submitted' },
          { title: 'In Review', status: 'current' },
          { title: 'Decision', status: 'pending' },
        ]}
      />
    );
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveClass('co-tl-done');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(screen.getByText('10/01/2026 . Sam Patel')).toBeInTheDocument();
    expect(screen.getAllByText('Submitted')[1]!.closest('.co-tag')).toHaveClass('co-tag-info');
  });
});
