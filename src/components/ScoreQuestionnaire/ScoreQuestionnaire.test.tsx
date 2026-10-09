import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ScoreQuestionnaire, scoreBand } from './ScoreQuestionnaire';

const gad7 = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7'];
const phq9 = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9'];

describe('ScoreQuestionnaire', () => {
  it('shows the total, maximum, band and answered count', () => {
    render(<ScoreQuestionnaire instrument="GAD-7" title="Anxiety" questions={gad7} answers={[2, 2, 1, 2, 1, 1, null]} />);
    expect(screen.getByRole('heading', { name: 'GAD-7: Anxiety' })).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('/ 21')).toBeInTheDocument();
    expect(screen.getByText('Mild')).toBeInTheDocument();
    expect(screen.getByText(/6 of 7 answered/)).toBeInTheDocument();
  });

  it('updates the score when an answer is chosen', async () => {
    const onChange = vi.fn();
    render(<ScoreQuestionnaire instrument="GAD-7" questions={gad7} onChange={onChange} />);
    const group = screen.getByRole('radiogroup', { name: 'Q1' });
    await userEvent.click(within(group).getByRole('radio', { name: 'Nearly every day (3)' }));
    expect(within(group).getByRole('radio', { name: 'Nearly every day (3)' })).toHaveAttribute('aria-checked', 'true');
    expect(onChange).toHaveBeenLastCalledWith([3, null, null, null, null, null, null]);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('moves and chooses with the arrow keys (roving tab stop)', async () => {
    render(<ScoreQuestionnaire instrument="GAD-7" questions={gad7} />);
    const group = screen.getByRole('radiogroup', { name: 'Q2' });
    const radios = within(group).getAllByRole('radio');
    expect(radios.map((r) => r.tabIndex)).toEqual([0, -1, -1, -1]);
    radios[0]!.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(radios[1]).toHaveFocus();
    expect(radios[1]).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{End}');
    expect(radios[3]).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(radios[0]).toHaveFocus();
    expect(radios[0]).toHaveAttribute('aria-checked', 'true');
  });

  it('flags a positive PHQ-9 item 9', () => {
    const { rerender } = render(<ScoreQuestionnaire instrument="PHQ-9" questions={phq9} answers={[0, 0, 0, 0, 0, 0, 0, 0, 0]} />);
    expect(screen.queryByText('Item 9 is positive')).not.toBeInTheDocument();
    rerender(<ScoreQuestionnaire instrument="PHQ-9" questions={phq9} value={[2, 3, 2, 2, 1, 2, 1, 1, 1]} />);
    expect(screen.getByText('Item 9 is positive')).toBeInTheDocument();
    expect(screen.getByText('Moderately severe')).toBeInTheDocument();
  });

  it('maps scores to bands', () => {
    expect(scoreBand('GAD-7', 0)?.label).toBe('Minimal');
    expect(scoreBand('GAD-7', 15)?.label).toBe('Severe');
    expect(scoreBand('PHQ-9', 20)?.label).toBe('Severe');
    expect(scoreBand('PHQ-9', 28)).toBeUndefined();
  });
});
