import { Fragment, forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';

/** One label and value pair. */
export type DescriptionItem = readonly [label: ReactNode, value: ReactNode];

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  /** Array of [label, value] pairs. Required */
  items: ReadonlyArray<DescriptionItem>;
  /** Narrower label column (120px instead of 160px); default false */
  compact?: boolean;
}

/** DescriptionList shows label and value pairs in two columns, such as Patient, Date of Birth and MRN. */
export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(function DescriptionList(
  { items, compact = false, className, ...rest },
  ref
) {
  return (
    <dl ref={ref} className={cx('co-kv', compact && 'co-kv-compact', className)} {...rest}>
      {items.map(([label, value], i) => (
        <Fragment key={i}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </Fragment>
      ))}
    </dl>
  );
});
