import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RangeContextProvider } from '../../clinical';
import { EDTrackingBoard, ESIBadge, type EDPatient } from './EDTrackingBoard';

const pts: EDPatient[] = [
  { room: '7', name: 'Aaliyah Brooks', age: 27, sex: 'F', esi: 3, complaint: 'RLQ pain', wait: 52, status: 'Waiting', vitals: { hr: 104, bp: [118, 76], spo2: 99 } },
  { room: 'Trauma 1', name: 'Marcus Bell', age: 34, sex: 'M', esi: 1, complaint: 'MVC', wait: 0, status: 'In Room', provider: 'Dr. Priya Raman', vitals: { hr: 138, bp: [78, 42], spo2: 87 } },
  { room: '', name: 'Daniel Kim', age: 58, sex: 'M', esi: 2, complaint: 'Chest pressure', wait: 14, status: 'Triage' },
  { room: 'Hall 3', name: 'Robert Nguyen', age: 82, sex: 'M', esi: 3, complaint: 'Fever', wait: 310, status: 'Boarding', provider: 'Dr. Sam Patel' },
];

const names = () =>
  within(screen.getByRole('table'))
    .getAllByRole('row')
    .slice(1)
    .map((r) => within(r).getAllByRole('cell')[2]!.querySelector('b')!.textContent);

describe('EDTrackingBoard', () => {
  it('sorts by ESI then longest wait and marks ESI 1 rows', () => {
    render(<EDTrackingBoard patients={pts} />);
    expect(names()).toEqual(['Marcus Bell', 'Daniel Kim', 'Robert Nguyen', 'Aaliyah Brooks']);
    expect(screen.getAllByRole('row')[1]).toHaveClass('is-crit');
    expect(screen.getByText('Lobby')).toBeInTheDocument();
  });

  it('summarises the department and waits over the ESI target', () => {
    render(<EDTrackingBoard patients={pts} />);
    expect(screen.getByText('2 over ESI target')).toBeInTheDocument();
    expect(screen.getByText('Over 30 min target')).toBeInTheDocument();
    expect(screen.getByText('Over 10 min target')).toBeInTheDocument();
    expect(screen.getAllByText('52 min', { selector: 'b' })).toHaveLength(2);
  });

  it('honours custom wait targets', () => {
    render(<EDTrackingBoard patients={pts} waitTargets={{ 2: 20, 3: 60 }} />);
    expect(screen.getByText('All within ESI target')).toBeInTheDocument();
  });

  it('filters waiting, boarding and my patients', async () => {
    const onFilterChange = vi.fn();
    render(<EDTrackingBoard patients={pts} currentProvider="Dr. Priya Raman" onFilterChange={onFilterChange} />);
    await userEvent.click(screen.getByRole('radio', { name: /Waiting/ }));
    expect(onFilterChange).toHaveBeenCalledWith('waiting');
    expect(names()).toEqual(['Daniel Kim', 'Aaliyah Brooks']);
    await userEvent.click(screen.getByRole('radio', { name: /Boarding/ }));
    expect(names()).toEqual(['Robert Nguyen']);
    await userEvent.click(screen.getByRole('radio', { name: /My patients/ }));
    expect(names()).toEqual(['Marcus Bell']);
  });

  it('shows an empty state when nothing matches', () => {
    render(<EDTrackingBoard patients={pts} filter="mine" />);
    expect(screen.getByText('No patients match this filter')).toBeInTheDocument();
  });

  it('flags last vitals against the shared ranges and hides them when compact', () => {
    const { rerender } = render(<EDTrackingBoard patients={pts.slice(1, 2)} />);
    expect(screen.getAllByRole('img', { name: 'Critical low' }).length).toBeGreaterThan(0);
    rerender(<EDTrackingBoard patients={pts.slice(1, 2)} density="compact" />);
    expect(screen.queryByRole('columnheader', { name: 'Last vitals' })).not.toBeInTheDocument();
  });

  it('takes the range context from the prop or a provider', () => {
    const one: EDPatient[] = [{ name: 'A', age: 30, sex: 'F', esi: 3, complaint: 'x', wait: 0, status: 'In Room', vitals: { spo2: 93 } }];
    const { rerender } = render(<EDTrackingBoard patients={one} />);
    expect(screen.getByRole('img', { name: 'Low' })).toBeInTheDocument();
    rerender(<EDTrackingBoard patients={one} rangeContext="inpatient" />);
    expect(screen.queryByRole('img', { name: 'Low' })).not.toBeInTheDocument();
    rerender(
      <RangeContextProvider value="inpatient">
        <EDTrackingBoard patients={one} />
      </RangeContextProvider>
    );
    expect(screen.queryByRole('img', { name: 'Low' })).not.toBeInTheDocument();
  });

  it('calls onQuickRegister and hides it when readOnly', async () => {
    const onQuickRegister = vi.fn();
    const { rerender } = render(<EDTrackingBoard patients={[]} onQuickRegister={onQuickRegister} />);
    await userEvent.click(screen.getByRole('button', { name: 'Quick Register' }));
    expect(onQuickRegister).toHaveBeenCalled();
    rerender(<EDTrackingBoard patients={[]} readOnly />);
    expect(screen.queryByRole('button', { name: 'Quick Register' })).not.toBeInTheDocument();
  });
});

describe('ESIBadge', () => {
  it('names the level in words', () => {
    render(<ESIBadge level={2} showLabel />);
    expect(screen.getByText('ESI 2 Emergent')).toBeInTheDocument();
    expect(screen.getByTitle('ESI 2, Emergent')).toBeInTheDocument();
  });

  it('says when no level is set', () => {
    render(<ESIBadge level={null} />);
    expect(screen.getByText('ESI not set')).toBeInTheDocument();
  });
});
