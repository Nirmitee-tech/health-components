import { forwardRef, useState, type ForwardedRef, type HTMLAttributes } from 'react';
import type { RangeContextId } from '../../clinical';
import { useControllableState } from '../../internal/hooks';
import { format, RadioButtons, scoreTotal, type NursingScoreItem } from '../../internal/nursing';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Card } from '../Card/Card';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';

/** 'numeric' (0 to 10) | 'faces' (age 3+) | 'flacc' (nonverbal) */
export type PainScaleMode = 'numeric' | 'faces' | 'flacc';

/** What onChange receives. */
export interface PainScaleChange {
  mode: PainScaleMode;
  score: number;
}

export interface PainScaleProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onChange' | 'defaultValue'> {
  /** Scales offered; one entry hides the switch; default ['numeric', 'faces', 'flacc'] */
  modes?: PainScaleMode[];
  /** Controlled scale */
  mode?: PainScaleMode;
  /** Initial scale (uncontrolled); default 'numeric' */
  defaultMode?: PainScaleMode;
  /** Called when the scale changes */
  onModeChange?: (mode: PainScaleMode) => void;
  /** Controlled numeric or faces score, 0 to 10 (null = not scored) */
  value?: number | null;
  /** Initial numeric or faces score, 0 to 10 (uncontrolled); default none */
  defaultValue?: number;
  /** Initial FLACC answers: option index (0 to 2) per category face, legs, activity, cry, consol; default {} */
  defaultFlacc?: Record<string, number>;
  /** Patient pain goal (0 to 10); default none */
  goal?: number;
  /** Reassessment window shown when above goal; default '60 min' */
  reassess?: string;
  /** Not selectable; default false */
  readOnly?: boolean;
  /** Called with the scale and score when a score is picked (FLACC: once all five categories are scored) */
  onChange?: (e: PainScaleChange) => void;
  /** Card title; default 'Pain Assessment' */
  title?: string;
  /** Patient line; default none */
  subtitle?: string;
  /** Accepted for API consistency with the nursing set; the pain score is never flagged; default 'inpatient' */
  rangeContext?: RangeContextId;
}

/** The five FLACC categories, each scored 0 to 2. */
export const FLACC_ITEMS: readonly NursingScoreItem[] = [
  {
    id: 'face',
    label: 'Face',
    options: [
      { label: 'No expression or smile', points: 0 },
      { label: 'Occasional grimace, withdrawn', points: 1 },
      { label: 'Frequent frown, clenched jaw', points: 2 },
    ],
  },
  {
    id: 'legs',
    label: 'Legs',
    options: [
      { label: 'Normal or relaxed', points: 0 },
      { label: 'Uneasy, restless, tense', points: 1 },
      { label: 'Kicking or drawn up', points: 2 },
    ],
  },
  {
    id: 'activity',
    label: 'Activity',
    options: [
      { label: 'Lying quietly, moves easily', points: 0 },
      { label: 'Squirming, shifting', points: 1 },
      { label: 'Arched, rigid or jerking', points: 2 },
    ],
  },
  {
    id: 'cry',
    label: 'Cry',
    options: [
      { label: 'No cry', points: 0 },
      { label: 'Moans, whimpers', points: 1 },
      { label: 'Crying steadily, screams', points: 2 },
    ],
  },
  {
    id: 'consol',
    label: 'Consolability',
    options: [
      { label: 'Content, relaxed', points: 0 },
      { label: 'Reassured by touch or talk', points: 1 },
      { label: 'Hard to console', points: 2 },
    ],
  },
];

const FACE_WORDS = ['No hurt', 'Hurts a little bit', 'Hurts a little more', 'Hurts even more', 'Hurts a whole lot', 'Hurts worst'];
const MODE_LABEL: Record<PainScaleMode, string> = { numeric: 'Numeric 0 to 10', faces: 'Faces (age 3+)', flacc: 'FLACC (nonverbal)' };

/** Pain severity band: 0 No pain, 1-3 Mild, 4-6 Moderate, 7-10 Severe. */
export function painBand(n: number): { tone: BadgeTone; label: string } {
  return n === 0
    ? { tone: 'success', label: 'No pain' }
    : n <= 3
      ? { tone: 'neutral', label: 'Mild' }
      : n <= 6
        ? { tone: 'warning', label: 'Moderate' }
        : { tone: 'danger', label: 'Severe' };
}

/** A drawn face (not the licensed Wong-Baker artwork), level 0 to 5. */
function Face({ level: s }: { level: number }) {
  const mouth = `M8 ${16 - (2.5 - s) * 0.8} Q12 ${16 + (2.5 - s) * 1.4} 16 ${16 - (2.5 - s) * 0.8}`;
  return (
    <svg viewBox="0 0 24 24" width={34} height={34} aria-hidden="true">
      <circle cx={12} cy={12} r={10} fill="none" stroke="currentColor" strokeWidth={1.6} />
      <circle cx={8.5} cy={9.5} r={1.1} fill="currentColor" />
      <circle cx={15.5} cy={9.5} r={1.1} fill="currentColor" />
      {s >= 3 ? <path d="M6.5 7.2l3 1M17.5 7.2l-3 1" stroke="currentColor" strokeWidth={1.4} /> : null}
      <path d={mouth} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
      {s === 5 ? <path d="M7 12.2v2" stroke="var(--co-primary)" strokeWidth={1.4} /> : null}
    </svg>
  );
}

function PainScaleBase(
  {
    modes: modesProp,
    mode: modeProp,
    defaultMode = 'numeric',
    onModeChange,
    value,
    defaultValue,
    defaultFlacc,
    goal,
    reassess = '60 min',
    readOnly = false,
    onChange,
    title = 'Pain Assessment',
    subtitle,
    rangeContext: _rangeContext,
    ...rest
  }: PainScaleProps,
  ref: ForwardedRef<HTMLElement>
) {
  const modes = modesProp && modesProp.length ? modesProp : (['numeric', 'faces', 'flacc'] as PainScaleMode[]);
  const [mode, setMode] = useControllableState<PainScaleMode>(modeProp, defaultMode, onModeChange);
  const [n, setN] = useControllableState<number | null>(value, defaultValue != null ? defaultValue : null);
  const [fl, setFl] = useState<Record<string, number>>(defaultFlacc || {});
  const flN = FLACC_ITEMS.filter((it) => fl[it.id] != null && it.options[fl[it.id]!]).length;
  const flTotal = scoreTotal(FLACC_ITEMS, fl);
  const score = mode === 'flacc' ? flTotal : n;
  const band = score != null ? painBand(score) : null;
  const pick = (v: number) => {
    setN(v);
    onChange?.({ mode, score: v });
  };

  let body;
  if (mode === 'numeric') {
    body = (
      <RadioButtons
        className="nu-scale"
        label="Pain 0 to 10"
        readOnly={readOnly}
        value={n}
        options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => ({ key: i, content: i }))}
        onChange={pick}
      />
    );
  } else if (mode === 'faces') {
    body = (
      <RadioButtons
        className="nu-faces"
        label="Faces pain scale, 0 to 10"
        readOnly={readOnly}
        value={n != null && n % 2 === 0 ? n / 2 : null}
        options={[0, 1, 2, 3, 4, 5].map((i) => ({
          key: i,
          content: (
            <>
              <Face level={i} />
              <b className="nu-num">{i * 2}</b>
              <span className="nu-muted nu-face-word">{FACE_WORDS[i]}</span>
            </>
          ),
        }))}
        onChange={(i) => pick(i * 2)}
      />
    );
  } else {
    body = (
      <div>
        {FLACC_ITEMS.map((it) => (
          <RadioButtons
            key={it.id}
            className="nu-item"
            label={it.label}
            readOnly={readOnly}
            value={fl[it.id] ?? null}
            header={<h4>{it.label}</h4>}
            wrapClassName="nu-opts"
            options={it.options.map((o, i) => ({
              key: i,
              content: (
                <>
                  {o.label}
                  <span className="nu-pt">{o.points}</span>
                </>
              ),
            }))}
            onChange={(i) => {
              const nv = { ...fl, [it.id]: i };
              setFl(nv);
              const total = scoreTotal(FLACC_ITEMS, nv);
              if (total !== null) onChange?.({ mode: 'flacc', score: total });
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <Card ref={ref} title={title} subtitle={subtitle} {...rest}>
      {modes.length > 1 ? (
        <div className="nu-bar">
          <SegmentedControl
            size="sm"
            label="Pain scale"
            value={mode}
            onChange={(m) => setMode(m as PainScaleMode)}
            options={modes.map((m) => ({ value: m, label: MODE_LABEL[m] }))}
          />
        </div>
      ) : null}
      {body}
      <div className="nu-total" role="status" aria-live="polite">
        <div>
          <div className="nu-muted">Pain score</div>
          <span className="nu-big">{score != null ? format('pain', score, { noFlag: true }).text : '--'}</span>
          <span className="nu-muted"> /10</span>
        </div>
        {band ? (
          <Badge tone={band.tone}>{band.label}</Badge>
        ) : (
          <span className="nu-muted">{mode === 'flacc' ? flN + ' of 5 categories scored' : 'Not scored'}</span>
        )}
        <span className="nu-sp" />
        {score != null && goal != null ? (
          <span className="nu-ink2 nu-goal">
            {score > goal
              ? 'Above the patient goal of ' + goal + '. Intervene and reassess within ' + reassess + '.'
              : 'At or below the patient goal of ' + goal + '.'}
          </span>
        ) : null}
      </div>
    </Card>
  );
}

/**
 * PainScale records pain on the 0 to 10 numeric scale, a faces scale for children, or FLACC for patients who cannot
 * self-report, with severity band and goal check.
 */
export const PainScale = Object.assign(forwardRef<HTMLElement, PainScaleProps>(PainScaleBase), { flacc: FLACC_ITEMS });
PainScale.displayName = 'PainScale';
