import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BedBoard, bedPlacementCheck, type BedQueuePatient, type BedUnit } from './BedBoard';

const units: BedUnit[] = [
  {
    id: '4w',
    name: '4 West Med-Surg',
    level: 'medsurg',
    rooms: [
      {
        id: '401',
        beds: [
          {
            id: 'A',
            status: 'occupied',
            patient: {
              name: 'Okafor, Grace',
              age: 67,
              sex: 'F',
              dx: 'CHF',
              los: 3,
            },
          },
          { id: 'B', status: 'clean' },
        ],
      },
      {
        id: '403',
        negativePressure: true,
        beds: [{ id: 'A', status: 'clean' }],
      },
      {
        id: '404',
        beds: [{ id: 'A', status: 'dirty', note: 'EVS called 13:52' }],
      },
    ],
  },
];
const queue: BedQueuePatient[] = [
  {
    id: 'p1',
    name: 'Patel, Ravi',
    age: 59,
    sex: 'M',
    reason: 'Chest pain',
    level: 'tele',
    waiting: '2 h',
  },
  {
    id: 'p2',
    name: 'Kowalski, Anna',
    age: 34,
    sex: 'F',
    reason: 'Cavitary lesion',
    level: 'medsurg',
    isolation: 'airborne',
    waiting: '48 min',
  },
];

describe('BedBoard', () => {
  it('counts beds by status', () => {
    render(<BedBoard units={units} />);
    const legend = screen.getByRole('group', { name: 'Bed status counts' });
    expect(legend).toHaveTextContent('Clean 2');
    expect(legend).toHaveTextContent('Dirty 1');
    expect(legend).toHaveTextContent('Occupied 1');
  });

  it('assigns a selected patient to a bed that passes the check', async () => {
    const onAssign = vi.fn();
    render(<BedBoard units={units} queue={queue} onAssign={onAssign} />);
    await userEvent.click(screen.getByRole('option', { name: /Kowalski, Anna/ }));
    expect(screen.getByRole('option', { name: /Kowalski, Anna/ })).toHaveAttribute('aria-selected', 'true');
    // Only the negative-pressure room accepts an airborne patient
    expect(
      screen.getByRole('group', {
        name: 'Bed 401B, Clean, ready. Airborne isolation needs a negative-pressure room',
      })
    ).toHaveClass('is-nodrop');
    const bed = screen.getByRole('group', { name: 'Bed 403A, Clean, ready' });
    await userEvent.click(within(bed).getByRole('button', { name: 'Assign Kowalski' }));
    expect(onAssign).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'p2' }),
      expect.objectContaining({ id: 'A', status: 'pending' }),
      expect.objectContaining({ id: '403' })
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'Kowalski, Anna assigned to 4 West Med-Surg 403A. Waiting for transport.'
    );
    expect(
      screen.getByRole('group', {
        name: 'Bed 403A, Assigned, arriving, Kowalski, Anna',
      })
    ).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /Kowalski, Anna/ })).not.toBeInTheDocument();
  });

  it('refuses a drop on a bed that fails the check', () => {
    render(<BedBoard units={units} queue={queue} />);
    const bed = screen.getByRole('group', { name: 'Bed 401B, Clean, ready' });
    fireEvent.drop(bed, { dataTransfer: { getData: () => 'p2' } });
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Kowalski, Anna cannot go to 401B: Airborne isolation needs a negative-pressure room.'
    );
  });

  it('moves focus through the queue with the arrow keys', async () => {
    render(<BedBoard units={units} queue={queue} />);
    const [a, b] = screen.getAllByRole('option');
    expect(a).toHaveAttribute('tabindex', '0');
    expect(b).toHaveAttribute('tabindex', '-1');
    a!.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(b).toHaveFocus();
  });

  it('cannot assign when read only', () => {
    render(<BedBoard units={units} queue={queue} readOnly defaultSelected="p1" />);
    expect(screen.getByText('Your role can see beds but not assign them.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Assign/ })).not.toBeInTheDocument();
    screen.getAllByRole('option').forEach((o) => expect(o).toBeDisabled());
  });

  it('placement check catches roommate conflicts', () => {
    const room = units[0]!.rooms[0]!;
    const bed = room.beds[1]!;
    expect(bedPlacementCheck(queue[0], bed, room)).toEqual({
      ok: false,
      why: 'Roommate is a different sex',
    });
    expect(bedPlacementCheck({ ...queue[0]!, sex: 'F' }, bed, room)).toEqual({
      ok: true,
    });
    expect(bedPlacementCheck({ ...queue[0]!, sex: 'F', isolation: 'contact' }, bed, room)).toEqual({
      ok: false,
      why: 'Isolation patient needs a private room',
    });
  });
});
