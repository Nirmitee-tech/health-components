import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NursingAssessment } from './NursingAssessment';

const systems = [
  { id: 'neuro', label: 'Neurological', wdl: 'Alert, oriented x4.', options: ['Confused', 'Drowsy'] },
  { id: 'resp', label: 'Respiratory', wdl: 'Lungs clear.' },
];

describe('NursingAssessment', () => {
  it('records WDL and exceptions with findings and counts documented systems', async () => {
    const onChange = vi.fn();
    render(<NursingAssessment systems={systems} onChange={onChange} />);
    expect(screen.getByText('0 of 2 systems documented')).toBeInTheDocument();
    const neuro = screen.getByRole('radiogroup', { name: 'Neurological result' });
    await userEvent.click(within(neuro).getByRole('radio', { name: 'Exception' }));
    expect(screen.getByText('1 exception')).toBeInTheDocument();
    expect(screen.getByText('0 of 2 systems documented')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Confused', pressed: false }));
    expect(screen.getByRole('button', { name: 'Confused' })).toHaveAttribute('aria-pressed', 'true');
    expect(onChange).toHaveBeenLastCalledWith('neuro', { wdl: false, findings: ['Confused'], note: '' });
    expect(screen.getByText('1 of 2 systems documented')).toBeInTheDocument();
    await userEvent.type(screen.getByRole('textbox', { name: 'Neurological exception note' }), 'New since 06:00');
    expect(onChange).toHaveBeenLastCalledWith('neuro', { wdl: false, findings: ['Confused'], note: 'New since 06:00' });
  });

  it('marks the remaining systems WDL', async () => {
    render(<NursingAssessment systems={systems} values={{ neuro: { wdl: false, findings: ['Drowsy'], note: '' } }} />);
    await userEvent.click(screen.getByRole('button', { name: 'Mark remaining WDL' }));
    expect(screen.getByText('2 of 2 systems documented')).toBeInTheDocument();
    expect(within(screen.getByRole('radiogroup', { name: 'Respiratory result' })).getByRole('radio', { name: 'WDL' })).toHaveAttribute(
      'aria-checked',
      'true'
    );
    expect(screen.getByText('Within defined limits: Lungs clear.')).toBeInTheDocument();
  });

  it('is signed and read only', () => {
    render(<NursingAssessment systems={systems} readOnly values={{ neuro: { wdl: false, findings: [], note: 'Baseline' } }} />);
    expect(screen.getByText('Signed')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByText('Baseline')).toBeInTheDocument();
    expect(NursingAssessment.defaultSystems).toHaveLength(8);
  });
});
