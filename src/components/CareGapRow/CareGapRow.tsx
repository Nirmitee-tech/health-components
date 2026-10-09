import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { Badge } from '../Badge/Badge';
import { Icon } from '../Icon/Icon';
import { SplitButton } from '../SplitButton/SplitButton';

/** State of a care gap. */
export type CareGapStatus = 'open' | 'closed' | 'excluded';

/** One care gap. */
export interface CareGapData {
  /** Measure name ("Colorectal cancer screening (CMS130)") */
  measure: string;
  /** Patient name; default none (on the chart) */
  patient?: string;
  /** Evidence or reason ("Last FIT 08/2023"); default none */
  detail?: string;
  /** Due text ("Now"); default none */
  due?: string;
  /** 'open' | 'closed' | 'excluded' */
  status: CareGapStatus;
  /** Label of the action that closes the gap; default "Order" */
  action?: string;
}

/** Which action of an open gap was chosen. */
export type CareGapAction = 'primary' | 'record-outside' | 'exclude';

export interface CareGapRowProps extends HTMLAttributes<HTMLDivElement> {
  /** {measure, patient?, detail?, due?, status: open|closed|excluded, action?}; required */
  gap: CareGapData;
  /** Called with the chosen action of an open gap: the main action, Record Outside Result or Mark Excluded; default none */
  onAction?: (action: CareGapAction, gap: CareGapData) => void;
}

const STATUS_LABEL: Record<CareGapStatus, string> = { open: 'Open', closed: 'Closed', excluded: 'Excluded' };

/** CareGapRow is one open, closed or excluded care gap with the action that closes it. */
export const CareGapRow = forwardRef<HTMLDivElement, CareGapRowProps>(function CareGapRow(
  { gap: g, onAction, className, ...rest },
  ref
) {
  const meta = [g.patient, g.detail, g.due ? `Due ${g.due}` : null].filter(Boolean).join(' . ');
  return (
    <div ref={ref} className={cx('co-li', className)} {...rest}>
      <Icon name={g.status === 'closed' ? 'check' : 'alert'} size={16} />
      <div className="co-li-b">
        <b>{g.measure}</b>
        {meta ? <span className="co-mi-s">{meta}</span> : null}
      </div>
      <Badge tone={g.status === 'closed' ? 'success' : g.status === 'excluded' ? 'neutral' : 'warning'}>
        {STATUS_LABEL[g.status] ?? 'Open'}
      </Badge>
      {g.status === 'open' ? (
        <SplitButton
          size="sm"
          variant="secondary"
          label={g.action || 'Order'}
          menuLabel={`More actions for ${g.measure}`}
          onClick={() => onAction?.('primary', g)}
          items={[
            { label: 'Record Outside Result', onSelect: () => onAction?.('record-outside', g) },
            { label: 'Mark Excluded (reason)', onSelect: () => onAction?.('exclude', g) },
          ]}
        />
      ) : null}
    </div>
  );
});
