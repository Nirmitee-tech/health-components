import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { StatCard, type StatCardProps } from '../StatCard/StatCard';

/** One KPI: StatCard props. `label` identifies it and is what `selected` matches. */
export type KPIGridItem = Omit<StatCardProps, 'selected' | 'onClick'>;

export interface KPIGridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect' | 'children'> {
  /** StatCard props[]. Required */
  items: KPIGridItem[];
  /** Cards become a single-select filter (toggle buttons); default false */
  filter?: boolean;
  /** Label of the selected card, or null for none (controlled); default uncontrolled */
  selected?: string | null;
  /** Initially selected label (uncontrolled); default none */
  defaultSelected?: string | null;
  /** (label | null) => void: selecting the selected card again clears it; default none */
  onSelect?: (label: string | null) => void;
  /** Accessible name of the filter group; default none */
  label?: string;
}

/** KPIGrid lays out StatCards in a responsive grid and can make them a single-select filter for the table below. */
export const KPIGrid = forwardRef<HTMLDivElement, KPIGridProps>(function KPIGrid(
  { items, filter = false, selected, defaultSelected = null, onSelect, label, className, ...rest },
  ref
) {
  const [sel, setSel] = useControllableState<string | null>(selected, defaultSelected, onSelect);
  return (
    <div
      ref={ref}
      className={cx('co-kpis', className)}
      role={filter ? 'group' : undefined}
      aria-label={filter ? label : undefined}
      {...rest}
    >
      {items.map((k) =>
        filter ? (
          <StatCard
            key={k.label}
            {...k}
            selected={sel === k.label}
            onClick={() => setSel(sel === k.label ? null : k.label)}
          />
        ) : (
          <StatCard key={k.label} {...k} />
        )
      )}
    </div>
  );
});
