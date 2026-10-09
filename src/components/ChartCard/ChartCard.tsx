import { forwardRef, type ReactNode } from 'react';
import { useControllableState } from '../../internal/hooks';
import { Card, type CardProps } from '../Card/Card';
import { EmptyState } from '../EmptyState/EmptyState';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { Skeleton } from '../Skeleton/Skeleton';

export interface ChartCardProps extends Omit<CardProps, 'title' | 'subtitle' | 'actions' | 'children'> {
  /** Card title, what the chart shows ("Denials by payer"). Required */
  title: string;
  /** Line under the title; default none */
  subtitle?: ReactNode;
  /** Period choices shown as a small SegmentedControl ("7d", "30d", "90d"); default none */
  periods?: string[];
  /** Selected period (controlled); default uncontrolled */
  period?: string;
  /** Initially selected period (uncontrolled); default the first period */
  defaultPeriod?: string;
  /** (p) => void: called with the new period; default none */
  onPeriod?: (period: string) => void;
  /** Shows a skeleton instead of the chart; default false */
  loading?: boolean;
  /** Empty message; shows an EmptyState instead of the chart; default none */
  empty?: string;
  /** Muted line naming the data source and time; default none */
  source?: ReactNode;
  /** Header actions, shown after the period switch; default none */
  actions?: ReactNode;
  /** The chart. */
  children?: ReactNode;
}

/** ChartCard wraps any chart in a Card with a title, period switch, loading and empty states, and a source line. */
export const ChartCard = forwardRef<HTMLElement, ChartCardProps>(function ChartCard(
  { title, subtitle, periods, period, defaultPeriod, onPeriod, loading = false, empty, source, actions, children, ...rest },
  ref
) {
  const [per, setPer] = useControllableState(period, defaultPeriod ?? periods?.[0] ?? '', onPeriod);
  const periodSwitch =
    periods && periods.length ? (
      <SegmentedControl size="sm" label="Period" value={per} onChange={setPer} options={periods} />
    ) : null;
  const headerActions =
    periodSwitch && actions ? (
      <div className="co-row co-gap-8">
        {periodSwitch}
        {actions}
      </div>
    ) : (
      periodSwitch ?? actions
    );

  return (
    <Card ref={ref} title={title} subtitle={subtitle} actions={headerActions} aria-busy={loading || undefined} {...rest}>
      {loading ? (
        <Skeleton variant="card" label={`Loading ${title}`} />
      ) : empty ? (
        <EmptyState compact kind="empty" title={empty} />
      ) : (
        children
      )}
      {source ? <div className="co-help">{source}</div> : null}
    </Card>
  );
});
