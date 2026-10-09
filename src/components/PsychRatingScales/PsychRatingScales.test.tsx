import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  CSSRS_QUESTIONS,
  GAD7_ITEMS,
  PHQ9_ITEMS,
  PsychRatingScales,
  cssrsAnswer,
  cssrsRisk,
  cssrsVisible,
  scoreScale,
  type CssrsQuestionId,
} from './PsychRatingScales';

const fill = (n: number, total: number) => {
  // n items summing to total, each 0..3
  const a: number[] = [];
  let left = total;
  for (let i = 0; i < n; i++) {
    const v = Math.min(3, left);
    a.push(v);
    left -= v;
  }
  return a;
};
const q = (id: CssrsQuestionId) => CSSRS_QUESTIONS.find((x) => x[0] === id)![1];

describe('scoreScale', () => {
  it('bands a complete PHQ-9 at the published cut-offs', () => {
    const cases: Array<[number, string, string]> = [
      [0, 'Minimal', 'success'],
      [4, 'Minimal', 'success'],
      [5, 'Mild', 'info'],
      [9, 'Mild', 'info'],
      [10, 'Moderate', 'warning'],
      [14, 'Moderate', 'warning'],
      [15, 'Moderately severe', 'danger'],
      [19, 'Moderately severe', 'danger'],
      [20, 'Severe', 'danger'],
      [27, 'Severe', 'danger'],
    ];
    for (const [total, band, tone] of cases) {
      const s = scoreScale('phq9', fill(9, total));
      expect(s).toMatchObject({ total, answered: 9, of: 9, complete: true, band, tone });
    }
  });

  it('bands a complete GAD-7 at the published cut-offs', () => {
    const cases: Array<[number, string]> = [
      [4, 'Minimal'],
      [5, 'Mild'],
      [9, 'Mild'],
      [10, 'Moderate'],
      [14, 'Moderate'],
      [15, 'Severe'],
      [21, 'Severe'],
    ];
    for (const [total, band] of cases) expect(scoreScale('gad7', fill(7, total))).toMatchObject({ total, of: 7, complete: true, band });
  });

  it('gives no band until every item is answered, but keeps the running total', () => {
    expect(scoreScale('gad7', [1, 2, 1])).toEqual({ total: 4, answered: 3, of: 7, complete: false, band: null, tone: 'neutral', item9: false });
    const holes: Array<number | undefined> = [];
    holes[0] = 3;
    holes[4] = 2;
    expect(scoreScale('phq9', holes)).toMatchObject({ total: 5, answered: 2, complete: false, band: null });
    expect(scoreScale('phq9', [0, 0, 0, 0, null, 0, 0, 0, 0])).toMatchObject({ answered: 8, complete: false, band: null });
    expect(scoreScale('phq9', undefined)).toMatchObject({ total: 0, answered: 0, complete: false });
  });

  it('counts zero answers as answered', () => {
    expect(scoreScale('gad7', [0, 0, 0, 0, 0, 0, 0])).toMatchObject({ total: 0, complete: true, band: 'Minimal' });
  });

  it('ignores answers beyond the scale length', () => {
    expect(scoreScale('gad7', [1, 1, 1, 1, 1, 1, 1, 3, 3])).toMatchObject({ total: 7, answered: 7, band: 'Mild' });
  });

  it('flags PHQ-9 item 9 above 0, even before the scale is complete', () => {
    expect(scoreScale('phq9', [2, 2, 1, 2, 1, 1, 1, 0, 1]).item9).toBe(true);
    expect(scoreScale('phq9', [0, 0, 0, 0, 0, 0, 0, 0, 0]).item9).toBe(false);
    const only9: number[] = [];
    only9[8] = 2;
    expect(scoreScale('phq9', only9)).toMatchObject({ item9: true, complete: false });
    expect(scoreScale('gad7', [3, 3, 3, 3, 3, 3, 3]).item9).toBe(false);
  });
});

describe('cssrsRisk', () => {
  it('follows the screen triage', () => {
    expect(cssrsRisk({})).toBe('none');
    expect(cssrsRisk(undefined)).toBe('none');
    expect(cssrsRisk({ q1: false, q2: false, q6: false })).toBe('none');
    expect(cssrsRisk({ q1: true })).toBe('low');
    expect(cssrsRisk({ q1: true, q2: true })).toBe('low');
    expect(cssrsRisk({ q2: true, q3: true })).toBe('moderate');
    expect(cssrsRisk({ q6: true })).toBe('moderate'); // behaviour, not in the past 3 months
    expect(cssrsRisk({ q6: true, q6r: false })).toBe('moderate');
    expect(cssrsRisk({ q6: true, q6r: true })).toBe('high');
    expect(cssrsRisk({ q2: true, q4: true })).toBe('high');
    expect(cssrsRisk({ q2: true, q5: true })).toBe('high');
    expect(cssrsRisk({ q1: true, q2: true, q3: true, q4: false, q5: false, q6: false })).toBe('moderate');
  });

  it('asks 3 to 5 only after yes to 2, and the 3 month question only after yes to 6', () => {
    const shown = (cs: Parameters<typeof cssrsVisible>[0]) => CSSRS_QUESTIONS.map(([k]) => k).filter((k) => cssrsVisible(cs, k));
    expect(shown({})).toEqual(['q1', 'q2', 'q6']);
    expect(shown({ q2: true })).toEqual(['q1', 'q2', 'q3', 'q4', 'q5', 'q6']);
    expect(shown({ q6: true })).toEqual(['q1', 'q2', 'q6', 'q6r']);
  });

  it('clears the follow-up answers when the gate answer becomes no', () => {
    expect(cssrsAnswer({ q2: true, q3: true, q4: true, q5: true }, 'q2', false)).toEqual({
      q2: false,
      q3: undefined,
      q4: undefined,
      q5: undefined,
    });
    expect(cssrsAnswer({ q6: true, q6r: true }, 'q6', false)).toEqual({ q6: false, q6r: undefined });
    expect(cssrsAnswer({ q1: true }, 'q2', true)).toEqual({ q1: true, q2: true });
  });
});

describe('PsychRatingScales', () => {
  it('lists the nine PHQ-9 items as named radio groups and scores live', async () => {
    const onAnswersChange = vi.fn();
    render(<PsychRatingScales onAnswersChange={onAnswersChange} />);
    expect(screen.getByRole('tab', { name: /PHQ-9/ })).toHaveAttribute('aria-selected', 'true');
    for (const item of PHQ9_ITEMS) expect(screen.getByRole('radiogroup', { name: item })).toBeInTheDocument();
    expect(screen.getByText('0 of 9 answered')).toBeInTheDocument();
    await userEvent.click(within(screen.getByRole('radiogroup', { name: PHQ9_ITEMS[0] })).getByRole('radio', { name: 'Nearly every day (3)' }));
    expect(onAnswersChange).toHaveBeenLastCalledWith({ phq9: [3] });
    expect(screen.getByText('1 of 9 answered')).toBeInTheDocument();
    expect(within(screen.getByRole('radiogroup', { name: PHQ9_ITEMS[0] })).getByRole('radio', { name: 'Nearly every day (3)' })).toHaveAttribute(
      'aria-checked',
      'true'
    );
  });

  it('shows the band only when complete, with the change since the last score', () => {
    render(
      <PsychRatingScales
        defaultAnswers={{ phq9: [2, 2, 1, 2, 1, 1, 1, 0, 1] }}
        history={[{ date: '08/01/2026', phq9: 17, gad7: 13, cssrs: 'none' }]}
      />
    );
    expect(screen.getByText('Moderate')).toBeInTheDocument();
    expect(screen.getByText('Change since 08/01/2026:', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('−6 points')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /PHQ-9/ })).toHaveTextContent('11');
  });

  it('escalates a positive item 9 and opens the C-SSRS screen', async () => {
    render(<PsychRatingScales defaultAnswers={{ phq9: [0, 0, 0, 0, 0, 0, 0, 0, 1] }} />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('PHQ-9 item 9 is positive');
    await userEvent.click(within(alert).getByRole('button', { name: 'Open C-SSRS Screen' }));
    expect(screen.getByRole('tab', { name: /C-SSRS/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('radiogroup', { name: q('q1') })).toBeInTheDocument();
  });

  it('walks the C-SSRS screen from no risk to high risk', async () => {
    const onAnswersChange = vi.fn();
    render(<PsychRatingScales defaultTab="cssrs" onAnswersChange={onAnswersChange} />);
    const yes = (id: CssrsQuestionId) => userEvent.click(within(screen.getByRole('radiogroup', { name: q(id) })).getByRole('radio', { name: 'Yes' }));
    const no = (id: CssrsQuestionId) => userEvent.click(within(screen.getByRole('radiogroup', { name: q(id) })).getByRole('radio', { name: 'No' }));
    expect(screen.getByText('No risk identified')).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup', { name: q('q3') })).toBeNull();
    expect(screen.queryByRole('radiogroup', { name: q('q6r') })).toBeNull();

    await yes('q1');
    expect(screen.getByText('Low risk')).toBeInTheDocument();
    expect(screen.getByText('Low risk: give resources')).toBeInTheDocument();

    await yes('q2');
    expect(screen.getByRole('radiogroup', { name: q('q3') })).toBeInTheDocument();
    await yes('q3');
    expect(screen.getByText('Moderate risk')).toBeInTheDocument();
    expect(screen.getByText('Moderate risk: safety plan and same-day behavioral health review')).toBeInTheDocument();

    await yes('q4');
    expect(screen.getByText('High risk')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('High risk: do not leave the patient alone');
    expect(screen.getByRole('button', { name: 'Call Crisis Team' })).toBeInTheDocument();

    // A no to question 2 hides and clears 3 to 5: back to low.
    await no('q2');
    expect(screen.queryByRole('radiogroup', { name: q('q3') })).toBeNull();
    expect(onAnswersChange).toHaveBeenLastCalledWith({ cssrs: { q1: true, q2: false, q3: undefined, q4: undefined, q5: undefined } });
    expect(screen.getByText('Low risk')).toBeInTheDocument();

    // Past behaviour: moderate; within 3 months: high.
    await yes('q6');
    expect(screen.getByText('Moderate risk')).toBeInTheDocument();
    await yes('q6r');
    expect(screen.getByText('High risk')).toBeInTheDocument();
    await no('q6');
    expect(screen.queryByRole('radiogroup', { name: q('q6r') })).toBeNull();
    expect(screen.getByText('Low risk')).toBeInTheDocument();
  });

  it('calls the crisis actions', async () => {
    const onCallCrisisTeam = vi.fn();
    const onStartSafetyPlan = vi.fn();
    render(
      <PsychRatingScales
        defaultTab="cssrs"
        defaultAnswers={{ cssrs: { q1: true, q2: true, q5: true } }}
        onCallCrisisTeam={onCallCrisisTeam}
        onStartSafetyPlan={onStartSafetyPlan}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Call Crisis Team' }));
    await userEvent.click(screen.getByRole('button', { name: 'Start Safety Plan' }));
    expect(onCallCrisisTeam).toHaveBeenCalledTimes(1);
    expect(onStartSafetyPlan).toHaveBeenCalledTimes(1);
  });

  it('marks the C-SSRS tab when there is risk', () => {
    render(<PsychRatingScales defaultAnswers={{ cssrs: { q1: true } }} />);
    expect(screen.getByRole('tab', { name: /C-SSRS/ })).toHaveTextContent('!');
  });

  it('switches tabs and scores the GAD-7', async () => {
    const onTabChange = vi.fn();
    render(<PsychRatingScales defaultAnswers={{ gad7: [1, 2, 1] }} onTabChange={onTabChange} />);
    await userEvent.click(screen.getByRole('tab', { name: /GAD-7/ }));
    expect(onTabChange).toHaveBeenCalledWith('gad7');
    for (const item of GAD7_ITEMS) expect(screen.getByRole('radiogroup', { name: item })).toBeInTheDocument();
    expect(screen.getByText('3 of 7 answered')).toBeInTheDocument();
    expect(screen.getByText('of 21 points')).toBeInTheDocument();
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', screen.getByRole('tab', { name: /GAD-7/ }).id);
  });

  it('locks answers when read-only', async () => {
    const onAnswersChange = vi.fn();
    render(<PsychRatingScales readOnly defaultTab="cssrs" onAnswersChange={onAnswersChange} />);
    const radio = within(screen.getByRole('radiogroup', { name: q('q1') })).getByRole('radio', { name: 'Yes' });
    expect(radio).toBeDisabled();
    await userEvent.click(radio);
    expect(onAnswersChange).not.toHaveBeenCalled();
  });

  it('is controllable', async () => {
    const onAnswersChange = vi.fn();
    const { rerender } = render(<PsychRatingScales tab="gad7" answers={{ gad7: [3] }} onAnswersChange={onAnswersChange} />);
    await userEvent.click(within(screen.getByRole('radiogroup', { name: GAD7_ITEMS[1] })).getByRole('radio', { name: 'Several days (1)' }));
    expect(onAnswersChange).toHaveBeenCalledWith({ gad7: [3, 1] });
    expect(screen.getByText('1 of 7 answered')).toBeInTheDocument(); // still the controlled value
    rerender(<PsychRatingScales tab="gad7" answers={{ gad7: [3, 1] }} onAnswersChange={onAnswersChange} />);
    expect(screen.getByText('2 of 7 answered')).toBeInTheDocument();
  });
});
