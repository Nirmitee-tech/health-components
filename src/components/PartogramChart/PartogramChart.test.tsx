import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PartogramChart, partogramActionCrossed } from './PartogramChart';

describe('PartogramChart', () => {
  it('finds the first exam right of the action line', () => {
    expect(partogramActionCrossed([[0, 4], [2, 5], [4, 7]])).toBeUndefined();
    expect(partogramActionCrossed([[0, 4], [3, 5], [6, 6], [8, 6]])).toEqual([8, 6]);
    expect(partogramActionCrossed([])).toBeUndefined();
  });

  it('alerts when the action line is crossed and summarises the chart', () => {
    render(<PartogramChart dilation={[[0, 4], [3, 5], [6, 6], [8, 6]]} fhr={[[0, 150], [8, 184]]} />);
    expect(screen.getByText('Action line crossed at 8 h')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Cervical dilation: 0 h 4 cm, 3 h 5 cm/ })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Fetal heart rate and contractions by hour' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Critical high' })).toBeInTheDocument();
  });

  it('shows the empty state without exams', () => {
    render(<PartogramChart dilation={[]} />);
    expect(screen.getByText('No cervical exams recorded')).toBeInTheDocument();
  });
});
