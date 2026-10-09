import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { WoundCareDoc, woundArea } from './WoundCareDoc';

const wound = { label: 'Wound 1', stage: 'Stage 3', current: { length: 3.2, width: 2.1, tissue: { granulation: 70, slough: 20 } } };
const history = [{ date: '09/18', length: 4.5, width: 3.0, by: 'WOC RN' }];

describe('WoundCareDoc', () => {
  it('computes area and change since the first measure', () => {
    render(<WoundCareDoc wound={wound} history={history} />);
    expect(screen.getByText('Area (L x W)').parentElement).toHaveTextContent('6.7cm²');
    // (6.72 - 13.5) / 13.5 = -50%
    expect(screen.getByText('Change since 09/18').parentElement).toHaveTextContent('−50%');
    expect(screen.getByText(/adds to 90%, should be 100%/)).toBeInTheDocument();
    expect(woundArea(2, '3')).toBe(6);
  });

  it('edits measurements and saves', async () => {
    const onSave = vi.fn();
    render(<WoundCareDoc wound={wound} onSave={onSave} />);
    const len = screen.getByLabelText('Length (cm)');
    await userEvent.clear(len);
    await userEvent.type(len, '2');
    expect(screen.getByText('Area (L x W)').parentElement).toHaveTextContent('4.2cm²');
    await userEvent.click(screen.getByRole('button', { name: 'Save wound assessment' }));
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ length: '2', width: 2.1 }));
  });

  it('read only shows values and no inputs', () => {
    render(<WoundCareDoc wound={wound} readOnly />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save wound assessment' })).not.toBeInTheDocument();
  });
});
