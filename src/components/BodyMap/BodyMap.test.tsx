import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BodyMap, type BodyMapMark } from './BodyMap';

const marks: BodyMapMark[] = [
  { x: 88, y: 92, site: 'Left upper chest', size: [6, 5], prevSize: 4, prevDate: '04/02/2026', type: 'biopsy', desc: 'Irregular border', photos: [{ date: '10/09/2026' }] },
  { x: 146, y: 118, view: 'front', site: 'Left forearm', size: [3, 3], type: 'monitor', desc: 'Stable' },
  { x: 86, y: 96, view: 'back', site: 'Left upper back', size: [5, 4], type: 'new', desc: 'New since last exam' },
];

describe('BodyMap', () => {
  it('shows the front marks with size, change, status and photos', () => {
    render(<BodyMap marks={marks} />);
    expect(screen.getByRole('img', { name: /^Front view with 2 marked lesions/ })).toBeInTheDocument();
    const items = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Left upper chest');
    expect(within(items[0]!).getByText('6 mm')).toBeInTheDocument();
    expect(within(items[0]!).getByText('5 mm')).toBeInTheDocument();
    expect(within(items[0]!).getByText('4 mm')).toBeInTheDocument();
    expect(items[0]).toHaveTextContent('Biopsy');
    expect(screen.getByRole('img', { name: 'Photo of lesion 1, Left upper chest, 10/09/2026' })).toBeInTheDocument();
    expect(items[1]).toHaveTextContent('No photos yet');
  });

  it('switches to the back view with counts and keeps mark numbers', async () => {
    const onViewChange = vi.fn();
    render(<BodyMap marks={marks} onViewChange={onViewChange} />);
    const back = screen.getByRole('radio', { name: /Back/ });
    expect(back).toHaveTextContent('1');
    await userEvent.click(back);
    expect(onViewChange).toHaveBeenCalledWith('back');
    expect(screen.getByRole('img', { name: /^Back view with 1 marked lesions. Patient left is on the left/ })).toBeInTheDocument();
    const items = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent('3');
    expect(items[0]).toHaveTextContent('New');
  });

  it('highlights a mark when its pin is clicked', async () => {
    const onMarkSelect = vi.fn();
    const { container } = render(<BodyMap marks={marks} onMarkSelect={onMarkSelect} />);
    await userEvent.click(container.querySelectorAll('.co-bodymap-pin')[1]!);
    expect(onMarkSelect).toHaveBeenCalledWith(2);
    expect(within(screen.getByRole('list')).getAllByRole('listitem')[1]).toHaveClass('is-on');
  });

  it('shows an empty state for a side without marks', () => {
    render(<BodyMap marks={[]} view="back" />);
    expect(screen.getByText('No lesions marked on the back')).toBeInTheDocument();
  });

  it('keeps the earlier marks shape working (concern = biopsy, front view)', () => {
    render(<BodyMap marks={[{ x: 86, y: 236, site: 'Left heel', desc: 'Stage 2 pressure injury', concern: true }]} />);
    const item = within(screen.getByRole('list')).getByRole('listitem');
    expect(item).toHaveTextContent('Left heel');
    expect(item).toHaveTextContent('Biopsy');
    expect(item.querySelector('.co-pin-n')).toHaveClass('is-bad');
  });

  it('hides Add Photo when read-only', () => {
    const { rerender } = render(<BodyMap marks={marks} />);
    expect(screen.getByRole('button', { name: 'Add Photo' })).toBeInTheDocument();
    rerender(<BodyMap marks={marks} readOnly />);
    expect(screen.queryByRole('button', { name: 'Add Photo' })).toBeNull();
  });
});
