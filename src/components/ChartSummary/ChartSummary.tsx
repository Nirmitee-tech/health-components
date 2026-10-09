import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import type { RangeContextId } from '../../clinical';
import { chartMeasure, Val, withRangeProvider } from '../../internal/chartPanels';
import { AllergyBadge, type AllergySeverity } from '../AllergyBadge/AllergyBadge';
import { Badge } from '../Badge/Badge';
import { Card } from '../Card/Card';
import { EmptyState } from '../EmptyState/EmptyState';
import { Icon } from '../Icon/Icon';

export type { ChartValueOverride } from '../../internal/chartPanels';

/** One result shown under a problem. */
export interface ChartSummaryResult {
  /** Measure code: a section key ('K', 'Cr', 'A1c', 'BNP'...), a shared fmt key or a LOINC code */
  code: string;
  /** The measured number, unrounded */
  value: number;
  /** When it was drawn ('09/22/2026'); default none */
  date?: string;
}

/** One active problem with the data that supports it. */
export interface ChartSummaryProblem {
  /** ICD-10-CM code ('E11.65') */
  code: string;
  /** Problem name */
  label: string;
  /** Onset ('2019'); default 'unknown' */
  onset?: string;
  /** Chronic condition; default false */
  chronic?: boolean;
  /** Owning specialty; default none */
  specialty?: string;
  /** Results that support it; default none */
  results?: ChartSummaryResult[];
  /** Medications that treat it; default none */
  meds?: string[];
  /** Current plan; default none */
  plan?: string;
  /** Care gap for this problem ('Retinal exam overdue'); default none */
  gap?: string;
}

/** One allergy. */
export interface ChartSummaryAllergy {
  /** Allergen ('Penicillin') */
  substance: string;
  /** 'severe' | 'moderate' | 'mild'; default 'moderate' */
  severity?: AllergySeverity;
}

/** One last-recorded vital sign. */
export interface ChartSummaryVital {
  /** Measure code ('SBP', 'HR', 'SpO2', 'Wt', 'Temp'...) */
  code: string;
  /** The measured number, unrounded */
  value: number;
}

export interface ChartSummaryProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Active problems with their results, medications, plan and gap; default none (empty state) */
  problems?: ChartSummaryProblem[];
  /** Allergies. undefined = not reviewed, [] = No Known Allergies; default undefined */
  allergies?: ChartSummaryAllergy[];
  /** Last recorded vitals; default none ('No vitals this year') */
  vitals?: ChartSummaryVital[];
  /** When the vitals were taken; default none */
  vitalsTaken?: string;
  /** Code status ('DNR/DNI'); default none */
  codeStatus?: string;
  /** Care gaps not tied to one problem; default none */
  gaps?: string[];
  /** Card title; default 'Chart Summary' */
  title?: string;
  /** Card subtitle (patient, age, MRN); default none */
  subtitle?: string;
  /** Header actions; default none */
  actions?: ReactNode;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

/**
 * ChartSummary is the one-page, problem-oriented summary: each active problem with the results, medications, plan
 * and care gap that belong to it, plus allergies, code status and last vitals.
 */
export const ChartSummary = forwardRef<HTMLElement, ChartSummaryProps>(function ChartSummary(
  { problems, allergies, vitals, vitalsTaken, codeStatus, gaps, title = 'Chart Summary', subtitle, actions, rangeContext, ...rest },
  ref
) {
  const probs = problems || [];
  const head = (
    <div className="co-row co-gap-8" style={{ flexWrap: 'wrap' }}>
      {allergies == null ? (
        <Badge tone="warning" icon="alert">
          Allergies not reviewed
        </Badge>
      ) : !allergies.length ? (
        <Badge tone="success" icon="check">
          No Known Allergies
        </Badge>
      ) : (
        allergies.map((a) => <AllergyBadge key={a.substance} substance={a.substance} severity={a.severity} />)
      )}
      {codeStatus ? <Badge tone="outline">{'Code status: ' + codeStatus}</Badge> : null}
    </div>
  );
  return withRangeProvider(
    rangeContext,
    <Card ref={ref} title={title} subtitle={subtitle} actions={actions} {...rest}>
      {head}
      <div className="cp-sec">Vitals, last recorded</div>
      {vitals && vitals.length ? (
        <div className="cp-chips">
          {vitals.map((v, i) => {
            const name = chartMeasure(v.code).name;
            return (
              <span key={i} className="co-row co-gap-6">
                <span className="co-mi-s">{name}</span>
                <Val code={v.code} value={v.value} label={name} />
              </span>
            );
          })}
          {vitalsTaken ? <span className="co-mi-s">{vitalsTaken}</span> : null}
        </div>
      ) : (
        <span className="co-mi-s">No vitals this year</span>
      )}
      <div className="cp-sec">Problems, with the data that supports each</div>
      {probs.length ? (
        <div>
          {probs.map((pr, i) => (
            <div key={i} className="cp-prob">
              <div>
                <div className="co-row co-gap-6">
                  <span className="co-code">{pr.code}</span>
                  <b>{pr.label}</b>
                </div>
                <div className="co-row co-gap-6" style={{ marginTop: 4 }}>
                  {pr.chronic ? (
                    <Badge tone="info" size="sm">
                      Chronic
                    </Badge>
                  ) : null}
                  {pr.specialty ? (
                    <Badge tone="outline" size="sm">
                      {pr.specialty}
                    </Badge>
                  ) : null}
                  <span className="co-mi-s">{'Onset ' + (pr.onset || 'unknown')}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {pr.results && pr.results.length ? (
                  <div className="cp-chips">
                    {pr.results.map((r, j) => {
                      const name = chartMeasure(r.code).name;
                      return (
                        <span key={j} className="co-row co-gap-6">
                          <span className="co-mi-s">{name}</span>
                          <Val code={r.code} value={r.value} label={name} />
                          {r.date ? <span className="co-mi-s">{r.date}</span> : null}
                        </span>
                      );
                    })}
                  </div>
                ) : null}
                {pr.meds && pr.meds.length ? (
                  <div className="cp-chips">
                    <Icon name="pill" size={14} />
                    {pr.meds.map((m, j) => (
                      <span key={j}>{m + (j < pr.meds!.length - 1 ? ';' : '')}</span>
                    ))}
                  </div>
                ) : null}
                {pr.plan ? (
                  <span>
                    <span className="co-mi-s">Plan: </span>
                    {pr.plan}
                  </span>
                ) : null}
                {pr.gap ? (
                  <Badge tone="warning" icon="clock">
                    {pr.gap}
                  </Badge>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState compact title="No active problems">
          Add problems so results and medications group under them.
        </EmptyState>
      )}
      {gaps && gaps.length ? (
        <div>
          <div className="cp-sec">Care gaps</div>
          <div className="cp-chips">
            {gaps.map((g, i) => (
              <Badge key={i} tone="warning" icon="alert">
                {g}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </Card>
  );
});
