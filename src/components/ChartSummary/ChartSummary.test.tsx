import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChartSummary } from './ChartSummary';

describe('ChartSummary', () => {
  it('says when allergies are not reviewed or none are known', () => {
    const { rerender } = render(<ChartSummary />);
    expect(screen.getByText('Allergies not reviewed')).toBeInTheDocument();
    expect(screen.getByText('No vitals this year')).toBeInTheDocument();
    expect(screen.getByText('No active problems')).toBeInTheDocument();
    rerender(<ChartSummary allergies={[]} />);
    expect(screen.getByText('No Known Allergies')).toBeInTheDocument();
  });

  it('groups results, medications and plan under each problem', () => {
    const { container } = render(
      <ChartSummary
        allergies={[{ substance: 'Penicillin', severity: 'severe' }]}
        codeStatus="DNR/DNI"
        problems={[
          {
            code: 'I50.22',
            label: 'Chronic systolic heart failure',
            chronic: true,
            results: [{ code: 'K', value: 5.6, date: '10/01/2026' }],
            meds: ['Carvedilol 12.5 mg BID', 'Spironolactone 25 mg daily'],
            plan: 'Recheck potassium in 1 week',
          },
        ]}
      />
    );
    expect(screen.getByText(/Allergy: Penicillin/)).toBeInTheDocument();
    expect(screen.getByText('Code status: DNR/DNI')).toBeInTheDocument();
    const prob = container.querySelector('.cp-prob')!;
    expect(prob).toHaveTextContent('I50.22');
    expect(prob).toHaveTextContent('Onset unknown');
    expect(prob).toHaveTextContent('Carvedilol 12.5 mg BID;');
    expect(prob).toHaveTextContent('Plan: Recheck potassium in 1 week');
    expect(screen.getByText('Potassium 5.6 mmol/L, High')).toBeInTheDocument();
  });

  it('follows rangeContext', () => {
    render(<ChartSummary rangeContext="inpatient" vitals={[{ code: 'Glu', value: 150 }]} />);
    expect(screen.queryByText(/Glucose 150 mg\/dL, High/)).not.toBeInTheDocument();
    expect(screen.getByText('Glucose 150 mg/dL')).toBeInTheDocument();
  });
});
