import { forwardRef, useState, type HTMLAttributes } from 'react';
import type { RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { chartMeasure, Val, withRangeProvider, type ChartValueOverride } from '../../internal/chartPanels';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Button } from '../Button/Button';
import type { IconName } from '../Icon/Icon';
import { Select } from '../Select/Select';
import { TextField } from '../TextField/TextField';

export type CdsIndicator = 'info' | 'warning' | 'critical';
export type CdsCardState = 'open' | 'accepted' | 'overridden';

/** A value behind the card. */
export interface CdsValue {
  /** Measure code ('K', 'eGFR', 'Vanc'...) */
  code: string;
  /** The measured number, unrounded */
  value: number;
  /** Lab range, unit or decimals; wins over the shared registry; default none */
  over?: ChartValueOverride;
}

/** A CDS Hooks suggestion. */
export interface CdsSuggestion {
  /** Button label ('Order BMP in 1 week') */
  label: string;
  /** Shown as the primary button; default false */
  isRecommended?: boolean;
}

/** A CDS Hooks link. */
export interface CdsLink {
  /** Link label */
  label: string;
  /** Target URL; without it the link is a button that calls onLink; default none */
  url?: string;
  /** 'absolute' | 'smart' (launches a SMART app); default 'absolute' */
  type?: 'absolute' | 'smart';
}

/** A coded override reason. */
export interface CdsOverrideReason {
  /** Reason code sent to onOverride */
  code: string;
  /** Reason text */
  display: string;
}

/** One CDS Hooks card. */
export interface CdsCard {
  /** One-line summary */
  summary: string;
  /** Detail text; default none */
  detail?: string;
  /** 'info' | 'warning' | 'critical' */
  indicator: CdsIndicator;
  /** Rule source; default none */
  source?: { label: string; url?: string };
  /** Values behind the card; default none */
  values?: CdsValue[];
  /** Suggestions to apply; default none */
  suggestions?: CdsSuggestion[];
  /** Links; default none */
  links?: CdsLink[];
  /** Coded override reasons ('Other' with free text is always offered); default none */
  overrideReasons?: CdsOverrideReason[];
}

export interface ClinicalDecisionSupportCardProps extends HTMLAttributes<HTMLDivElement> {
  /** The CDS Hooks card; required */
  card: CdsCard;
  /** Card state (controlled): 'open' | 'accepted' | 'overridden'; default uncontrolled */
  state?: CdsCardState;
  /** Initial state; default 'open' */
  defaultState?: CdsCardState;
  /** Called when the state changes; default none */
  onStateChange?: (state: CdsCardState) => void;
  /** Reason shown for an already overridden card; default 'recorded' */
  overrideReason?: string;
  /** Called with the reason code ('other' plus the typed text for Other) when the user overrides; default none */
  onOverride?: (reasonCode: string, text?: string) => void;
  /** Called with the suggestion the user applies; default none */
  onAccept?: (suggestion: CdsSuggestion) => void;
  /** Called when a link without `url` is clicked; default none */
  onLink?: (link: CdsLink) => void;
  /** Shows 'Overrides are logged with the reason.'; default true */
  feedback?: boolean;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

/** Badge, icon and words of each indicator. */
export const cdsIndicators: Record<CdsIndicator, { icon: IconName; tone: BadgeTone; label: string }> = {
  info: { icon: 'info', tone: 'info', label: 'Info' },
  warning: { icon: 'alert', tone: 'warning', label: 'Warning' },
  critical: { icon: 'alert-circle', tone: 'danger', label: 'Critical' },
};

/**
 * ClinicalDecisionSupportCard renders one CDS Hooks card: info, warning or critical indicator, summary, detail, the
 * values behind it, suggestions to apply, links, and an override that needs a reason.
 */
export const ClinicalDecisionSupportCard = forwardRef<HTMLDivElement, ClinicalDecisionSupportCardProps>(
  function ClinicalDecisionSupportCard(
    {
      card: c,
      state: stateProp,
      defaultState = 'open',
      onStateChange,
      overrideReason,
      onOverride,
      onAccept,
      onLink,
      feedback = true,
      rangeContext,
      className,
      ...rest
    },
    ref
  ) {
    const ind = cdsIndicators[c.indicator] || cdsIndicators.info;
    const [state, setState] = useControllableState<CdsCardState>(stateProp, defaultState, onStateChange);
    const [reason, setReason] = useState('');
    const [other, setOther] = useState('');
    const [overriding, setOverriding] = useState(false);
    const reasons = c.overrideReasons || [];
    const critical = c.indicator === 'critical';

    if (state === 'accepted' || state === 'overridden') {
      const shown =
        reason === 'other' ? other : reasons.find((r) => r.code === reason)?.display || reason || overrideReason || 'recorded';
      return withRangeProvider(
        rangeContext,
        <div ref={ref} className={cx('cp-cds', className)} role="status" {...rest}>
          <div className="co-row co-gap-6">
            <Badge tone={state === 'accepted' ? 'success' : 'neutral'} icon={state === 'accepted' ? 'check' : 'x'}>
              {state === 'accepted' ? 'Suggestion applied' : 'Overridden'}
            </Badge>
            <span>{c.summary}</span>
          </div>
          {state === 'overridden' ? <span className="co-mi-s">{'Reason: ' + shown}</span> : null}
        </div>
      );
    }

    return withRangeProvider(
      rangeContext,
      <div
        ref={ref}
        className={cx('cp-cds', 'cp-cds-' + (c.indicator || 'info'), className)}
        role={critical ? 'alert' : 'region'}
        aria-label={ind.label + ' decision support: ' + c.summary}
        {...rest}
      >
        <div className="co-row co-gap-8" style={{ justifyContent: 'space-between' }}>
          <div className="co-row co-gap-6">
            <Badge tone={ind.tone} icon={ind.icon}>
              {ind.label}
            </Badge>
            <b>{c.summary}</b>
          </div>
          {c.source ? (
            <span className="co-mi-s">
              {'Source: '}
              {c.source.url ? (
                <a href={c.source.url} target="_blank" rel="noopener noreferrer">
                  {c.source.label}
                </a>
              ) : (
                c.source.label
              )}
            </span>
          ) : null}
        </div>
        {c.detail ? <div>{c.detail}</div> : null}
        {c.values ? (
          <div className="cp-chips">
            {c.values.map((v, i) => {
              const name = chartMeasure(v.code, v.over).name;
              return (
                <span key={i} className="co-row co-gap-6">
                  <span className="co-mi-s">{name}</span>
                  <Val code={v.code} value={v.value} over={v.over} label={name} showRange />
                </span>
              );
            })}
          </div>
        ) : null}
        {c.suggestions && c.suggestions.length ? (
          <div className="co-row co-gap-8" style={{ flexWrap: 'wrap' }}>
            {c.suggestions.map((s, i) => (
              <Button
                key={i}
                size="sm"
                variant={s.isRecommended ? 'primary' : 'secondary'}
                onClick={() => {
                  setState('accepted');
                  onAccept?.(s);
                }}
              >
                {s.label}
              </Button>
            ))}
          </div>
        ) : null}
        {c.links && c.links.length ? (
          <div className="co-row co-gap-8">
            {c.links.map((l, i) => (
              <Button
                key={i}
                size="sm"
                variant="link"
                iconRight={l.type === 'smart' ? 'expand' : undefined}
                href={l.url}
                target={l.url ? '_blank' : undefined}
                onClick={l.url ? undefined : () => onLink?.(l)}
              >
                {l.label}
              </Button>
            ))}
          </div>
        ) : null}
        {overriding ? (
          <div className="co-dt">
            <Select
              label="Override reason"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              options={[{ value: '', label: 'Choose a reason' }]
                .concat(reasons.map((r) => ({ value: r.code, label: r.display })))
                .concat([{ value: 'other', label: 'Other (type it)' }])}
            />
            {reason === 'other' ? <TextField label="Reason" required value={other} onChange={(v) => setOther(v)} /> : null}
            <div className="co-row co-gap-8">
              <Button
                size="sm"
                variant={critical ? 'danger' : 'secondary'}
                disabled={!reason || (reason === 'other' && !other.trim())}
                onClick={() => {
                  setState('overridden');
                  if (reason === 'other') onOverride?.(reason, other.trim());
                  else onOverride?.(reason);
                }}
              >
                Override and Continue
              </Button>
              <Button size="sm" variant="tertiary" onClick={() => setOverriding(false)}>
                Back
              </Button>
            </div>
          </div>
        ) : (
          <div className="co-row co-gap-8">
            <Button size="sm" variant="tertiary" onClick={() => setOverriding(true)}>
              {critical ? 'Override' : 'Dismiss'}
            </Button>
            {feedback ? <span className="co-mi-s">Overrides are logged with the reason.</span> : null}
          </div>
        )}
      </div>
    );
  }
);
