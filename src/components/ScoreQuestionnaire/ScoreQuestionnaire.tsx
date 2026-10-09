import { forwardRef, useRef, type HTMLAttributes, type KeyboardEvent } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { Alert } from '../Alert/Alert';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Card } from '../Card/Card';

export type ScoreInstrument = 'GAD-7' | 'PHQ-9';
/** One answer: 0 (Not at all) to 3 (Nearly every day), or null when not answered yet. */
export type ScoreAnswer = 0 | 1 | 2 | 3 | null;

/** A severity band: score range, label and badge tone. */
export interface ScoreBand {
  min: number;
  max: number;
  label: string;
  tone: BadgeTone;
}

/** The answer choices shared by GAD-7 and PHQ-9, scored 0 to 3. */
export const scoreChoices = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] as const;

/** Published severity cut-offs per instrument. */
export const scoreBands: Record<ScoreInstrument, ScoreBand[]> = {
  'GAD-7': [
    { min: 0, max: 4, label: 'Minimal', tone: 'success' },
    { min: 5, max: 9, label: 'Mild', tone: 'info' },
    { min: 10, max: 14, label: 'Moderate', tone: 'warning' },
    { min: 15, max: 21, label: 'Severe', tone: 'danger' },
  ],
  'PHQ-9': [
    { min: 0, max: 4, label: 'Minimal', tone: 'success' },
    { min: 5, max: 9, label: 'Mild', tone: 'info' },
    { min: 10, max: 14, label: 'Moderate', tone: 'warning' },
    { min: 15, max: 19, label: 'Moderately severe', tone: 'danger' },
    { min: 20, max: 27, label: 'Severe', tone: 'danger' },
  ],
};

/** The severity band for a total score, or undefined when the score is outside every band. */
export function scoreBand(instrument: ScoreInstrument, score: number): ScoreBand | undefined {
  return scoreBands[instrument]?.find((b) => score >= b.min && score <= b.max);
}

export interface ScoreQuestionnaireProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onChange'> {
  /** 'GAD-7' | 'PHQ-9'. Required */
  instrument: ScoreInstrument;
  /** The items, in order (string[]). Required */
  questions: string[];
  /** Initial answers, 0 to 3 per item, null for unanswered (uncontrolled); default [] */
  answers?: ScoreAnswer[];
  /** Controlled answers; default undefined (uncontrolled) */
  value?: ScoreAnswer[];
  /** Called with all answers after one changes; default none */
  onChange?: (answers: ScoreAnswer[]) => void;
  /** Title after the instrument name ("Generalized anxiety"); default "" */
  title?: string;
}

const EMPTY: ScoreAnswer[] = [];

/** ScoreQuestionnaire runs GAD-7 or PHQ-9 with a live total and severity band, and flags a positive PHQ-9 item 9. */
export const ScoreQuestionnaire = forwardRef<HTMLElement, ScoreQuestionnaireProps>(function ScoreQuestionnaire(
  { instrument, questions, answers = EMPTY, value, onChange, title = '', className, ...rest },
  ref
) {
  const [ans, setAns] = useControllableState(value, answers, onChange);
  const radios = useRef<Record<string, HTMLButtonElement | null>>({});
  const score = ans.reduce<number>((a, v) => a + (v ?? 0), 0);
  const done = questions.filter((_, i) => ans[i] != null).length;
  const band = scoreBand(instrument, score);
  const item9 = instrument === 'PHQ-9' && (ans[8] ?? 0) > 0;

  const answer = (i: number, v: ScoreAnswer) => {
    const next = questions.map((_, j) => (j === i ? v : (ans[j] ?? null)));
    setAns(next);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number, v: number) => {
    let n: number | undefined;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (v + 1) % 4;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (v + 3) % 4;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = 3;
    if (n === undefined) return;
    e.preventDefault();
    answer(i, n as ScoreAnswer);
    radios.current[`${i}-${n}`]?.focus();
  };

  return (
    <Card
      ref={ref}
      title={`${instrument}: ${title}`}
      subtitle="Over the last 2 weeks, how often have you been bothered by the following problems?"
      className={cx('co-sq', className)}
      actions={
        <div className="co-score" aria-live="polite" aria-atomic="true">
          <span className="co-kv">{score}</span>
          <span className="co-mi-s">{` / ${questions.length * 3}`}</span>
          {band ? <Badge tone={band.tone}>{band.label}</Badge> : null}
        </div>
      }
      {...rest}
    >
      <ol className="co-q">
        {questions.map((q, i) => {
          const cur = ans[i] ?? null;
          return (
            <li key={i}>
              <div>{q}</div>
              <div className="co-seg co-seg-sm co-q-a" role="radiogroup" aria-label={q}>
                {scoreChoices.map((o, v) => {
                  const on = cur === v;
                  const focusable = cur == null ? v === 0 : on;
                  return (
                    <button
                      key={v}
                      ref={(el) => {
                        radios.current[`${i}-${v}`] = el;
                      }}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      tabIndex={focusable ? 0 : -1}
                      className={on ? 'is-on' : undefined}
                      onClick={() => answer(i, v as ScoreAnswer)}
                      onKeyDown={(e) => onKeyDown(e, i, v)}
                    >
                      {`${o} (${v})`}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>
      {item9 ? (
        <Alert tone="error" title="Item 9 is positive">
          Do a suicide risk assessment (C-SSRS) before the patient leaves.
        </Alert>
      ) : null}
      <div className="co-help">
        {`${done} of ${questions.length} answered. Score bands from the published ${instrument} cut-offs. A score is a screen, not a diagnosis.`}
      </div>
    </Card>
  );
});
