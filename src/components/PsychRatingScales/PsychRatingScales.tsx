import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';
import { SpecHeading, SpecTable, V } from '../../internal/specialty';
import { Alert } from '../Alert/Alert';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { Tabs } from '../Tabs/Tabs';

/** A scale scored 0 to 3 per item. */
export type LikertScale = 'phq9' | 'gad7';
/** A tab of the card. */
export type PsychScaleTab = LikertScale | 'cssrs';
/** Answers to a Likert scale, 0 to 3 per item; null or a hole for unanswered. */
export type LikertAnswers = ReadonlyArray<number | null | undefined>;
/** C-SSRS screen question ids. */
export type CssrsQuestionId = 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q6r';
/** C-SSRS screen answers: true yes, false no, undefined not asked. */
export type CssrsAnswers = Partial<Record<CssrsQuestionId, boolean>>;
/** C-SSRS screen risk level. */
export type CssrsRisk = 'none' | 'low' | 'moderate' | 'high';

/** All answers of the card. */
export interface PsychAnswers {
  phq9?: LikertAnswers;
  gad7?: LikertAnswers;
  cssrs?: CssrsAnswers;
}

/** An earlier screening. */
export interface PsychHistoryEntry {
  date: string;
  phq9?: number | null;
  gad7?: number | null;
  cssrs?: CssrsRisk | null;
}

export interface PsychRatingScalesProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Answers (controlled); default uncontrolled */
  answers?: PsychAnswers;
  /** First answers (uncontrolled) {phq9?, gad7?, cssrs?}; default {} */
  defaultAnswers?: PsychAnswers;
  /** Called with every answer change; default none */
  onAnswersChange?: (answers: PsychAnswers) => void;
  /** Tab shown (controlled); default uncontrolled */
  tab?: PsychScaleTab;
  /** First tab (uncontrolled): 'phq9' | 'gad7' | 'cssrs'; default 'phq9' */
  defaultTab?: PsychScaleTab;
  /** Called with the new tab; default none */
  onTabChange?: (tab: PsychScaleTab) => void;
  /** Earlier scores, oldest first; default [] */
  history?: ReadonlyArray<PsychHistoryEntry>;
  /** Card title; default 'Rating scales' */
  title?: string;
  /** Line under the title; default none */
  subtitle?: string;
  /** Locks the answers; default false */
  readOnly?: boolean;
  /** Call Crisis Team action (high risk); default none */
  onCallCrisisTeam?: () => void;
  /** Start Safety Plan action (moderate or high risk); default none */
  onStartSafetyPlan?: () => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

/** PHQ-9 items. */
export const PHQ9_ITEMS: readonly string[] = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself, or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading or watching television',
  'Moving or speaking so slowly that other people could have noticed, or the opposite: being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead, or of hurting yourself in some way',
];
/** GAD-7 items. */
export const GAD7_ITEMS: readonly string[] = [
  'Feeling nervous, anxious or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen',
];
/** Answer options, scored by index 0 to 3. */
export const LIKERT_OPTIONS: readonly string[] = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];

/** Published severity bands: [from, to, label, tone]. */
export const SCALE_BANDS: Readonly<Record<LikertScale, ReadonlyArray<readonly [number, number, string, BadgeTone]>>> = {
  phq9: [
    [0, 4, 'Minimal', 'success'],
    [5, 9, 'Mild', 'info'],
    [10, 14, 'Moderate', 'warning'],
    [15, 19, 'Moderately severe', 'danger'],
    [20, 27, 'Severe', 'danger'],
  ],
  gad7: [
    [0, 4, 'Minimal', 'success'],
    [5, 9, 'Mild', 'info'],
    [10, 14, 'Moderate', 'warning'],
    [15, 21, 'Severe', 'danger'],
  ],
};

/** The C-SSRS screen questions in order. */
export const CSSRS_QUESTIONS: ReadonlyArray<readonly [CssrsQuestionId, string]> = [
  ['q1', 'In the past month, have you wished you were dead or wished you could go to sleep and not wake up?'],
  ['q2', 'In the past month, have you actually had any thoughts of killing yourself?'],
  ['q3', 'Have you been thinking about how you might do this?'],
  ['q4', 'Have you had these thoughts and had some intention of acting on them?'],
  ['q5', 'Have you started to work out or worked out the details of how to kill yourself? Do you intend to carry out this plan?'],
  ['q6', 'Have you ever done anything, started to do anything, or prepared to do anything to end your life?'],
  ['q6r', 'Was that within the past 3 months?'],
];

/** A scale's score. `band` is null until every item is answered. */
export interface ScaleScore {
  total: number;
  answered: number;
  of: number;
  complete: boolean;
  band: string | null;
  tone: BadgeTone;
  /** PHQ-9 item 9 (thoughts of self-harm) above 0 */
  item9: boolean;
}

/** Scores a PHQ-9 (9 items) or GAD-7 (7 items): sum of answers, band from the published cut-offs once complete. */
export function scoreScale(kind: LikertScale, ans: LikertAnswers | null | undefined): ScaleScore {
  const qs = kind === 'phq9' ? 9 : 7;
  const a: Array<number | null | undefined> = [];
  const src = ans || [];
  for (let i = 0; i < qs; i++) a.push(i < src.length ? src[i] : undefined);
  const done = a.filter((x) => x != null).length;
  const total = a.reduce<number>((s, x) => s + (x || 0), 0);
  const b = done === qs ? SCALE_BANDS[kind].find((r) => total >= r[0] && total <= r[1]) || null : null;
  return {
    total,
    answered: done,
    of: qs,
    complete: done === qs,
    band: b ? b[2] : null,
    tone: b ? b[3] : 'neutral',
    item9: kind === 'phq9' && (a[8] || 0) > 0,
  };
}

/**
 * C-SSRS screen triage: Q1-2 only = low, Q3 = moderate, Q4/Q5 = high, Q6 within 3 months = high, Q6 earlier = moderate.
 */
export function cssrsRisk(r: CssrsAnswers | null | undefined): CssrsRisk {
  const a = r || {};
  if (a.q4 || a.q5 || (a.q6 && a.q6r)) return 'high';
  if (a.q3 || a.q6) return 'moderate';
  if (a.q1 || a.q2) return 'low';
  return 'none';
}

/** Which C-SSRS questions are asked: 3 to 5 only after yes to 2; the 3 month question only after yes to 6. */
export function cssrsVisible(cs: CssrsAnswers, k: CssrsQuestionId): boolean {
  return k === 'q1' || k === 'q2' || k === 'q6' || (!!cs.q2 && (k === 'q3' || k === 'q4' || k === 'q5')) || (k === 'q6r' && !!cs.q6);
}

/** C-SSRS answers after one change: a no to 2 clears 3 to 5; a no to 6 clears the 3 month question. */
export function cssrsAnswer(cs: CssrsAnswers, k: CssrsQuestionId, v: boolean): CssrsAnswers {
  const n: CssrsAnswers = { ...cs, [k]: v };
  if (k === 'q2' && !v) {
    n.q3 = undefined;
    n.q4 = undefined;
    n.q5 = undefined;
  }
  if (k === 'q6' && !v) n.q6r = undefined;
  return n;
}

const RISK: Record<CssrsRisk, { tone: BadgeTone; label: string }> = {
  none: { tone: 'success', label: 'No risk identified' },
  low: { tone: 'warning', label: 'Low risk' },
  moderate: { tone: 'danger', label: 'Moderate risk' },
  high: { tone: 'danger', label: 'High risk' },
};

function YesNo({ label, value, disabled, onChange }: { label: string; value?: boolean; disabled?: boolean; onChange: (v: boolean) => void }) {
  return (
    <SegmentedControl
      size="sm"
      label={label}
      value={value == null ? '' : value ? 'yes' : 'no'}
      options={[
        { value: 'yes', label: 'Yes', disabled },
        { value: 'no', label: 'No', disabled },
      ]}
      onChange={(v) => onChange(v === 'yes')}
    />
  );
}

const EMPTY_ANSWERS: PsychAnswers = {};
const EMPTY_HISTORY: ReadonlyArray<PsychHistoryEntry> = [];

/**
 * PsychRatingScales gives PHQ-9, GAD-7 and the C-SSRS screen in tabs, scores them live with the published bands, and
 * escalates suicide risk with the actions to take.
 */
export const PsychRatingScales = forwardRef<HTMLElement, PsychRatingScalesProps>(function PsychRatingScales(
  {
    answers,
    defaultAnswers = EMPTY_ANSWERS,
    onAnswersChange,
    tab: tabProp,
    defaultTab = 'phq9',
    onTabChange,
    history = EMPTY_HISTORY,
    title = 'Rating scales',
    subtitle,
    readOnly = false,
    onCallCrisisTeam,
    onStartSafetyPlan,
    rangeContext,
    className,
    id,
    ...rest
  },
  ref
) {
  const uid = useDomId('co-psy', id);
  const [tab, setTab] = useControllableState<PsychScaleTab>(tabProp, defaultTab, onTabChange);
  const [all, setAll] = useControllableState<PsychAnswers>(answers, defaultAnswers, onAnswersChange);
  const phq = all.phq9 || [];
  const gad = all.gad7 || [];
  const cs = all.cssrs || {};
  const sp = scoreScale('phq9', phq);
  const sg = scoreScale('gad7', gad);
  const risk = cssrsRisk(cs);
  const R = RISK[risk];
  const tabsId = uid + '-tabs';
  const panelId = uid + '-panel';

  function likert(kind: LikertScale, qs: readonly string[], ans: LikertAnswers) {
    const sc = scoreScale(kind, ans);
    const lastH = history.length ? history[history.length - 1] : undefined;
    const prev = lastH ? lastH[kind] : null;
    const set = (i: number, v: number) => {
      const n = ans.slice();
      while (n.length < i) n.push(undefined);
      n[i] = v;
      setAll({ ...all, [kind]: n });
    };
    return (
      <div>
        <div className="co-row co-gap-8 co-psy-score" aria-live="polite">
          <span className="co-sp-big">
            <V k="pts" v={sc.total} noUnit />
          </span>
          <span className="co-mi-s co-sp-inline">{'of ' + qs.length * 3 + ' points'}</span>
          {sc.band ? <Badge tone={sc.tone}>{sc.band}</Badge> : <Badge tone="outline">{sc.answered + ' of ' + sc.of + ' answered'}</Badge>}
          {prev != null && sc.complete && lastH ? (
            <span className="co-mi-s co-sp-inline">
              {'Change since ' + lastH.date + ': '}
              <V k="pts" v={sc.total - prev} over={{ sign: true }} />
            </span>
          ) : null}
        </div>
        <div className="co-mi-s co-psy-prompt">Over the last 2 weeks, how often have you been bothered by the following problems?</div>
        <ol className="co-q">
          {qs.map((q, i) => (
            <li key={i} className={kind === 'phq9' && i === 8 && (ans[8] || 0) > 0 ? 'is-alert' : undefined}>
              <div>{q}</div>
              <SegmentedControl
                size="sm"
                className="co-q-a"
                label={q}
                value={ans[i] == null ? '' : String(ans[i])}
                options={LIKERT_OPTIONS.map((o, v) => ({ value: String(v), label: o + ' (' + v + ')', disabled: readOnly }))}
                onChange={(v) => set(i, Number(v))}
              />
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <RangeContextProvider value={rangeContext}>
      <Card ref={ref} id={id} className={cx('co-psy', className)} title={title} subtitle={subtitle} {...rest}>
        <Tabs
          id={tabsId}
          label="Scale"
          value={tab}
          onChange={(t) => setTab(t as PsychScaleTab)}
          items={[
            { id: 'phq9', label: 'PHQ-9', count: sp.complete ? sp.total : undefined, alert: sp.item9, panelId },
            { id: 'gad7', label: 'GAD-7', count: sg.complete ? sg.total : undefined, panelId },
            { id: 'cssrs', label: 'C-SSRS screen', count: risk !== 'none' ? '!' : undefined, alert: risk !== 'none', panelId },
          ]}
        />
        <div className="co-psy-body" role="tabpanel" id={panelId} aria-labelledby={tabsId + '-' + tab}>
          {sp.item9 && tab !== 'cssrs' ? (
            <Alert
              tone="error"
              title="PHQ-9 item 9 is positive"
              actions={
                <Button size="sm" variant="danger" onClick={() => setTab('cssrs')}>
                  Open C-SSRS Screen
                </Button>
              }
            >
              Complete the C-SSRS screen before the patient leaves.
            </Alert>
          ) : null}
          {tab === 'phq9' ? (
            likert('phq9', PHQ9_ITEMS, phq)
          ) : tab === 'gad7' ? (
            likert('gad7', GAD7_ITEMS, gad)
          ) : (
            <div>
              {risk === 'high' ? (
                <Alert
                  tone="error"
                  title="High risk: do not leave the patient alone"
                  actions={
                    <>
                      <Button size="sm" variant="danger-solid" onClick={onCallCrisisTeam}>
                        Call Crisis Team
                      </Button>
                      <Button size="sm" onClick={onStartSafetyPlan}>
                        Start Safety Plan
                      </Button>
                    </>
                  }
                >
                  Arrange an immediate safety evaluation (emergency department or crisis team). Remove access to means.
                  Document who was notified and when.
                </Alert>
              ) : risk === 'moderate' ? (
                <Alert
                  tone="warning"
                  title="Moderate risk: safety plan and same-day behavioral health review"
                  actions={
                    <Button size="sm" onClick={onStartSafetyPlan}>
                      Start Safety Plan
                    </Button>
                  }
                >
                  Complete a safety plan with the patient, discuss means safety, and book behavioral health follow-up within
                  24 to 72 hours.
                </Alert>
              ) : risk === 'low' ? (
                <Alert tone="info" title="Low risk: give resources">
                  Share the 988 Suicide and Crisis Lifeline and consider a behavioral health referral.
                </Alert>
              ) : null}
              <div className="co-row co-gap-8 co-psy-result" aria-live="polite">
                <span className="co-kl">Screen result</span>
                <Badge tone={R.tone} icon={risk === 'none' ? 'check' : 'alert'}>
                  {R.label}
                </Badge>
              </div>
              <ol className="co-q">
                {CSSRS_QUESTIONS.filter(([k]) => cssrsVisible(cs, k)).map(([k, q]) => (
                  <li key={k}>
                    <div>{q}</div>
                    <YesNo
                      label={q}
                      value={cs[k]}
                      disabled={readOnly}
                      onChange={(v) => setAll({ ...all, cssrs: cssrsAnswer(cs, k, v) })}
                    />
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
        {history.length ? <SpecHeading>History</SpecHeading> : null}
        {history.length ? (
          <SpecTable
            caption="Scale history"
            cols={['Date', 'PHQ-9', 'GAD-7', 'C-SSRS']}
            num={[1, 2]}
            rows={history.map((r) => [
              r.date,
              <V key="p" k="pts" v={r.phq9} />,
              <V key="g" k="pts" v={r.gad7} />,
              r.cssrs && RISK[r.cssrs] ? (
                <Badge key="c" tone={RISK[r.cssrs].tone} size="sm">
                  {RISK[r.cssrs].label}
                </Badge>
              ) : (
                '-'
              ),
            ])}
          />
        ) : null}
        <div className="co-help">
          Bands from the published PHQ-9 and GAD-7 cut-offs. A drop of 5 or more PHQ-9 points is a meaningful change. A score
          is a screen, not a diagnosis; the clinician decides the risk level.
        </div>
      </Card>
    </RangeContextProvider>
  );
});
