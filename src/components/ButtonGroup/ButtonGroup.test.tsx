import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../Button/Button';
import { ButtonGroup } from './ButtonGroup';

describe('ButtonGroup', () => {
  it('renders a labelled group with classes', () => {
    render(
      <ButtonGroup attached align="end" label="Calendar view" className="x">
        <Button>Day</Button>
        <Button>Week</Button>
      </ButtonGroup>
    );
    const group = screen.getByRole('group', { name: 'Calendar view' });
    expect(group).toHaveClass('co-bgroup', 'co-bgroup-attached', 'co-bgroup-end', 'x');
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
});
