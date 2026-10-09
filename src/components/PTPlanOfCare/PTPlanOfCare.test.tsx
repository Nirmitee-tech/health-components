import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PTPlanOfCare, ptScoreChange } from './PTPlanOfCare';

describe('PTPlanOfCare', () => {
  it('judges change against MCID in the better direction', () => {
    expect(ptScoreChange({ baseline: 22, current: 47, mcid: 9, higherBetter: true })).toEqual({ change: 25, improvement: 25, result: 'beyond' });
    expect(ptScoreChange({ baseline: 38, current: 44, mcid: 10, higherBetter: true })).toMatchObject({ result: 'under' });
    expect(ptScoreChange({ baseline: 7, current: 8, mcid: 2 })).toMatchObject({ change: 1, improvement: -1, result: 'none' });
    expect(ptScoreChange({ baseline: 44, current: 34, mcid: 10 })).toMatchObject({ result: 'beyond' });
  });

  it('shows the authorization, progress note due and signed changes', () => {
    render(
      <PTPlanOfCare
        auth={{ used: 11, authorized: 12, payer: 'UnitedHealthcare', expires: '10/31/2026' }}
        visitsSinceProgressNote={10}
        scores={[{ name: 'LEFS', k: 'pts', baseline: 22, current: 47, mcid: 9, higherBetter: true }]}
      />
    );
    expect(screen.getByText('11 of 12 visits used, 1 left', { exact: false })).toBeInTheDocument();
    expect(screen.getByText(/Request more visits now/)).toBeInTheDocument();
    expect(screen.getByText('Progress note due')).toBeInTheDocument();
    expect(screen.getByText('+25 points')).toBeInTheDocument();
    expect(screen.getByText('Change beyond MCID')).toBeInTheDocument();
  });
});
