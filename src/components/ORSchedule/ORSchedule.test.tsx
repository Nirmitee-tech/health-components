import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ORSchedule, SurgeryBoard, type ORCase, type ORRoom } from './ORSchedule';

const rooms: ORRoom[] = [
  { id: 'OR1', name: 'OR 1', service: 'General' },
  { id: 'OR2', name: 'OR 2', service: 'Orthopedics' },
];
const cases: ORCase[] = [
  { room: 'OR1', start: '07:30', duration: 90, patient: 'Aaliyah Brooks', publicId: '4471', procedure: 'Lap appendectomy', surgeon: 'Dr. Hannah Cole', status: 'Complete' },
  { room: 'OR1', start: '09:30', duration: 150, patient: 'George Miller', publicId: '5120', procedure: 'Lap cholecystectomy', surgeon: 'Dr. Hannah Cole', status: 'Closing' },
  { room: 'OR2', start: '10:00', duration: 105, patient: 'Sara Ahmed', publicId: '7781', procedure: 'ORIF distal radius', laterality: 'Left', surgeon: 'Dr. Luis Mendez', status: 'Delayed', delay: 35, delayReason: 'implant tray not sterile' },
];

describe('ORSchedule', () => {
  it('draws cases as grid cells with a spoken label and shifts delayed cases', () => {
    render(<ORSchedule rooms={rooms} cases={cases} now="10:40" />);
    const cells = screen.getAllByRole('gridcell');
    expect(cells.map((c) => c.getAttribute('aria-label'))).toEqual([
      '07:30, Lap appendectomy, Dr. Hannah Cole, Complete',
      '09:30, Lap cholecystectomy, Dr. Hannah Cole, Closing',
      '10:35, ORIF distal radius, Dr. Luis Mendez, Delayed',
    ]);
    expect(cells[2]).toHaveClass('is-delayed');
    expect(screen.getByText('Now 10:40')).toBeInTheDocument();
    expect(screen.getAllByRole('rowheader')).toHaveLength(2);
  });

  it('flags room utilization under 70%', () => {
    render(<ORSchedule rooms={rooms} cases={cases} />);
    const or2 = screen.getAllByRole('rowheader')[1]!;
    expect(within(or2).getByText('15')).toBeInTheDocument();
    expect(within(or2).getByRole('img', { name: 'Low' })).toBeInTheDocument();
  });

  it('moves focus between cases with the arrow keys (roving tabindex)', async () => {
    render(<ORSchedule rooms={rooms} cases={cases} />);
    const cells = screen.getAllByRole('gridcell');
    expect(cells.map((c) => c.tabIndex)).toEqual([0, -1, -1]);
    await userEvent.tab();
    expect(cells[0]).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(cells[1]).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(cells[2]).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    expect(cells[0]).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(cells[1]).toHaveFocus();
    expect(cells[1]!.tabIndex).toBe(0);
  });

  it('shows an empty state with the date', () => {
    render(<ORSchedule rooms={rooms} cases={[]} date="Sun 18 Oct" />);
    expect(screen.getByText('Booked cases for Sun 18 Oct appear here.')).toBeInTheDocument();
  });
});

describe('SurgeryBoard', () => {
  it('lists cases by room and start with laterality and delay reason', () => {
    render(<SurgeryBoard rooms={rooms} cases={cases} />);
    expect(screen.getByRole('heading', { name: 'Surgery Status Board' })).toBeInTheDocument();
    const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1);
    expect(rows.map((r) => within(r).getAllByRole('cell')[1]!.textContent)).toEqual(['07:30', '09:30', '10:00']);
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Delayed 35 min, implant tray not sterile')).toBeInTheDocument();
    expect(screen.getByText('1 h 45 min')).toBeInTheDocument();
  });

  it('hides names in the public view', () => {
    render(<SurgeryBoard rooms={rooms} cases={cases} publicView />);
    expect(screen.queryByText('Aaliyah Brooks')).not.toBeInTheDocument();
    expect(screen.getByText('4471')).toBeInTheDocument();
  });
});
