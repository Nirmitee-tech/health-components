import { forwardRef } from 'react';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card, type CardProps } from '../Card/Card';
import { ProgressBar } from '../ProgressBar/ProgressBar';

/** One quality measure with its counts. */
export interface QualityMeasureData {
  /** Measure name ("Controlling High Blood Pressure") */
  name: string;
  /** Measure id ("CMS165v12") */
  id: string;
  /** Reporting period ("Jan to Sep 2026") */
  period: string;
  /** Patients meeting the measure */
  numerator: number;
  /** Patients in the measure */
  denominator: number;
  /** Excluded patients; default none */
  exclusions?: number;
  /** Target rate in percent */
  target: number;
  /** Lower is better (CMS122); default false */
  inverse?: boolean;
  /** Data source line; default "CareOS eCQM engine, sample data" */
  source?: string;
}

export interface QualityMeasureCardProps extends Omit<CardProps, 'title' | 'subtitle' | 'children'> {
  /** {name, id, period, numerator, denominator, exclusions?, target, inverse?, source?}; required */
  measure: QualityMeasureData;
  /** Called by the "View N patients with gaps" link; default none */
  onViewGaps?: (measure: QualityMeasureData) => void;
}

/** Rate in percent with one decimal; 0 when the denominator is 0. */
export function measureRate(m: Pick<QualityMeasureData, 'numerator' | 'denominator'>): number {
  return m.denominator ? Math.round((m.numerator / m.denominator) * 1000) / 10 : 0;
}

/** QualityMeasureCard shows one quality measure: rate, target (including inverse measures), numerator and denominator, and the gap list link. */
export const QualityMeasureCard = forwardRef<HTMLElement, QualityMeasureCardProps>(function QualityMeasureCard(
  { measure: m, onViewGaps, ...rest },
  ref
) {
  const rate = measureRate(m);
  const good = m.inverse ? rate <= m.target : rate >= m.target;
  // For an inverse measure the numerator counts patients with the gap (e.g. A1c > 9%).
  const gaps = m.inverse ? m.numerator : m.denominator - m.numerator;
  return (
    <Card ref={ref} title={m.name} subtitle={`${m.id} . ${m.period}`} {...rest}>
      <div className="co-row">
        <span className="co-kv">{`${rate}%`}</span>
        <Badge tone={good ? 'success' : 'warning'} icon={good ? 'check' : 'alert'}>
          {`${good ? 'Meets' : 'Below'} target ${m.target}%${m.inverse ? ' (lower is better)' : ''}`}
        </Badge>
      </div>
      <ProgressBar compact label={m.name} value={rate} tone={good ? 'success' : 'warning'} />
      <span className="co-mi-s">
        {`${m.numerator} of ${m.denominator} patients${m.exclusions ? `, ${m.exclusions} excluded` : ''}. Source: ${
          m.source || 'CareOS eCQM engine, sample data'
        }`}
      </span>
      <Button size="sm" variant="link" onClick={() => onViewGaps?.(m)}>
        {`View ${gaps} patients with gaps`}
      </Button>
    </Card>
  );
});
