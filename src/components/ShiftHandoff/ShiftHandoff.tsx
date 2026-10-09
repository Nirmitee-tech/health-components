import { forwardRef, type HTMLAttributes } from 'react';
import { useRangeContext, type RangeContextId } from '../../clinical';
import { useControllableState } from '../../internal/hooks';
import { NURSING_CONTEXT, Value, type NursingRange } from '../../internal/nursing';
import type { IconName } from '../Icon/Icon';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';

/** One formatted value in an SBAR section. */
export interface HandoffValue {
  /** Label ('HR') */
  label: string;
  /** Measure key ('hr', 'bp', 'map', 'glucose'...) */
  measure: string;
  /** Value ('92/54' for bp) */
  value: number | string;
  /** UCUM unit when the measure has none */
  unit?: string;
  /** Decimals when the measure has none */
  dp?: number;
  /** Range passed with the value; wins over the shared registry */
  range?: NursingRange;
}

/** One SBAR section: text, values and/or a list. */
export interface HandoffSection {
  /** Paragraph */
  text?: string;
  /** Bulleted items */
  items?: string[];
  /** Formatted values */
  values?: HandoffValue[];
}

/** A header flag (isolation, fall risk, code status). */
export interface HandoffFlag {
  /** Text */
  label: string;
  /** Badge tone; default 'warning' */
  tone?: BadgeTone;
  /** Badge icon; default none */
  icon?: IconName;
}

export interface ShiftHandoffProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** S: Situation; default none (shows Not filled in) */
  situation?: HandoffSection;
  /** B: Background */
  background?: HandoffSection;
  /** A: Assessment */
  assessment?: HandoffSection;
  /** R: Recommendation */
  recommendation?: HandoffSection;
  /** What is due in the next 4 hours; default none */
  pending?: string[];
  /** Header flags; default none */
  flags?: HandoffFlag[];
  /** Giving nurse */
  from?: string;
  /** Receiving nurse */
  to?: string;
  /** Controlled accepted state */
  acknowledged?: boolean;
  /** Initial accepted state (uncontrolled); default false */
  defaultAcknowledged?: boolean;
  /** When it was accepted ('19:12'); default none */
  ackTime?: string;
  /** Called when the receiving nurse accepts */
  onAcknowledge?: () => void;
  /** Card title; default 'Shift Handoff (SBAR)' */
  title?: string;
  /** Unit line; default none */
  subtitle?: string;
  /** Which shared reference range flags use; a value's own range still wins; default 'inpatient' when no global context is set */
  rangeContext?: RangeContextId;
}

/**
 * ShiftHandoff is the SBAR nurse-to-nurse report: Situation, Background, Assessment with formatted values,
 * Recommendation, what is due next, and the receiving nurse accepting it.
 */
export const ShiftHandoff = forwardRef<HTMLElement, ShiftHandoffProps>(function ShiftHandoff(
  {
    situation,
    background,
    assessment,
    recommendation,
    pending,
    flags,
    from,
    to,
    acknowledged,
    defaultAcknowledged = false,
    ackTime,
    onAcknowledge,
    title = 'Shift Handoff (SBAR)',
    subtitle,
    rangeContext,
    ...rest
  },
  ref
) {
  const ctx = useRangeContext(NURSING_CONTEXT, rangeContext);
  const [ack, setAck] = useControllableState(acknowledged, defaultAcknowledged);
  const sec: Array<[string, string, HandoffSection | undefined]> = [
    ['S', 'Situation', situation],
    ['B', 'Background', background],
    ['A', 'Assessment', assessment],
    ['R', 'Recommendation', recommendation],
  ];
  const block = (x: HandoffSection | undefined) => {
    if (!x || (!x.text && !x.values?.length && !x.items?.length)) return <span className="nu-muted">Not filled in</span>;
    return (
      <div>
        {x.text ? <div>{x.text}</div> : null}
        {x.values && x.values.length ? (
          <div className="nu-kv">
            {x.values.map((v, i) => (
              <span key={i}>
                <span className="l">{v.label}</span>
                <Value measure={v.measure} value={v.value} range={v.range} unit={v.unit} dp={v.dp} label={v.label} rangeContext={ctx} />
              </span>
            ))}
          </div>
        ) : null}
        {x.items && x.items.length ? (
          <ul className="nu-ul">
            {x.items.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  };
  return (
    <Card
      ref={ref}
      title={title}
      subtitle={subtitle}
      actions={
        flags && flags.length ? (
          <div className="nu-row">
            {flags.map((f, i) => (
              <Badge key={i} tone={f.tone || 'warning'} size="sm" icon={f.icon}>
                {f.label}
              </Badge>
            ))}
          </div>
        ) : undefined
      }
      {...rest}
    >
      <div className="nu-sbar">
        {sec.map((s) => [
          <div key={s[0] + 'k'} className="k" aria-hidden="true">
            {s[0]}
          </div>,
          <div key={s[0] + 'v'} className="v">
            <h4>{s[1]}</h4>
            {block(s[2])}
          </div>,
        ])}
      </div>
      {pending && pending.length ? (
        <div className="nu-pending">
          <b>Due in the next 4 hours</b>
          <ul className="nu-ul">
            {pending.map((t, i) => (
              <li key={i} className="nu-num">
                {t}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="nu-row nu-handoff-f">
        <span className="nu-muted">{'From ' + (from || '') + ' to ' + (to || '')}</span>
        <span className="nu-sp" />
        {ack ? (
          <Badge tone="success" icon="check">
            {'Received by ' + (to || 'receiving nurse') + (ackTime ? ' at ' + ackTime : '')}
          </Badge>
        ) : (
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              setAck(true);
              onAcknowledge?.();
            }}
          >
            Accept handoff
          </Button>
        )}
      </div>
    </Card>
  );
});
