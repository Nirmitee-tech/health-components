import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { UnitToggle } from './UnitToggle';

describe('UnitToggle', () => {
  it('converts from the stored value and keeps the flag in the other unit', async () => {
    const onChange = vi.fn();
    const { container } = render(<UnitToggle kind="glucose" value={212} unit="mg/dL" showStored onChange={onChange} />);
    expect(container.querySelector('.co-cv-v')).toHaveTextContent('212');
    expect(container.querySelector('.co-af')).toHaveAttribute('aria-label', 'High');
    await userEvent.click(screen.getByRole('button', { name: 'mmol/L' }));
    expect(onChange).toHaveBeenCalledWith('mmol/L');
    expect(container.querySelector('.co-cv-v')).toHaveTextContent('11.8');
    expect(container.querySelector('.co-cv-u')).toHaveTextContent('mmol/L');
    expect(container.querySelector('.co-af')).toHaveAttribute('aria-label', 'High');
    expect(screen.getByRole('button', { name: 'mmol/L' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Stored as 212 mg/dL')).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Reference 3.9–5.5 mmol/L');
  });

  it('starts in defaultUnit and is controllable with displayUnit', async () => {
    const onChange = vi.fn();
    const { container, rerender } = render(<UnitToggle kind="weight" value={36.3} unit="kg" displayUnit="[lb_av]" onChange={onChange} />);
    expect(container.querySelector('.co-cv-v')).toHaveTextContent('80.0');
    await userEvent.click(screen.getByRole('button', { name: 'kg' }));
    expect(onChange).toHaveBeenCalledWith('kg');
    expect(container.querySelector('.co-cv-v')).toHaveTextContent('80.0');
    rerender(<UnitToggle kind="weight" value={36.3} unit="kg" displayUnit="kg" onChange={onChange} />);
    expect(container.querySelector('.co-cv-v')).toHaveTextContent('36.3');
  });

  it('names the unit group', () => {
    render(<UnitToggle kind="temp" value={38.6} unit="Cel" defaultUnit="[degF]" />);
    expect(screen.getByRole('group', { name: 'Temperature unit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '°F' })).toHaveAttribute('aria-pressed', 'true');
  });
});
