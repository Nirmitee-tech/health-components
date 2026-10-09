import { useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { Alert } from '../Alert/Alert';
import { StatusTag } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { DescriptionList } from '../DescriptionList/DescriptionList';
import { IconButton } from '../IconButton/IconButton';
import { KebabMenu } from '../Menu/Menu';

/** One coverage on file. */
export interface Coverage {
  /** Payer name; also the row key, so keep it unique */
  payer: string;
  /** Plan name ("Plan G") */
  plan: string;
  /** Member ID */
  memberId: string;
  /** Group number; default "None" */
  group?: string;
  /** Subscriber ("Spouse: Maria Edwards"); default "Self" */
  subscriber?: string;
  /** Eligibility status (see StatusTag kind 'eligibility'); default "Not Checked" */
  status?: string;
  /** When eligibility was last checked; default "Never" */
  checked?: string;
}

/** Actions in a coverage's More menu. */
export type CoverageAction = 'view-card' | 'history' | 'prior-auth' | 'inactivate';

export interface CoverageRowProps extends HTMLAttributes<HTMLDivElement> {
  /** The coverage */
  coverage: Coverage;
  /** Position in billing order, 0-based */
  index: number;
  /** Last in the order (disables Move down); default false */
  last?: boolean;
  /** Shows the reorder arrows; default false */
  editable?: boolean;
  /** Moves the coverage up (-1) or down (1); default none */
  onMove?: (index: number, direction: -1 | 1) => void;
  /** Check Eligibility; default none */
  onCheckEligibility?: (coverage: Coverage) => void;
  /** An item of the More menu; default none */
  onAction?: (action: CoverageAction, coverage: Coverage) => void;
}

const ORDER = ['Primary', 'Secondary', 'Tertiary'];

/** CoverageRow is one coverage in billing order: order word with arrows, payer, plan, eligibility and member details. */
export function CoverageRow({
  coverage: c,
  index,
  last = false,
  editable = false,
  onMove,
  onCheckEligibility,
  onAction,
  className,
  ...rest
}: CoverageRowProps) {
  return (
    <div className={cx('co-cov', index === 0 && 'is-first', className)} {...rest}>
      <div className="co-cov-ord">
        <b>{ORDER[index] ?? `#${index + 1}`}</b>
        {editable ? (
          <div className="co-row co-gap-6">
            <IconButton
              icon="chevron-up"
              size="sm"
              label={`Move ${c.payer} up`}
              data-cov-move="up"
              disabled={index === 0}
              onClick={() => onMove?.(index, -1)}
            />
            <IconButton
              icon="chevron-down"
              size="sm"
              label={`Move ${c.payer} down`}
              data-cov-move="down"
              disabled={last}
              onClick={() => onMove?.(index, 1)}
            />
          </div>
        ) : null}
      </div>
      <div className="co-cov-b">
        <div className="co-row co-gap-8">
          <h3>{c.payer}</h3>
          <span className="co-muted">{c.plan}</span>
          <StatusTag kind="eligibility" status={c.status || 'Not Checked'} size="sm" />
        </div>
        <DescriptionList
          compact
          items={[
            ['Member ID', c.memberId],
            ['Group', c.group || 'None'],
            ['Subscriber', c.subscriber || 'Self'],
            ['Last checked', c.checked || 'Never'],
          ]}
        />
      </div>
      <div className="co-row co-gap-6 co-cov-act">
        <Button size="sm" onClick={() => onCheckEligibility?.(c)}>
          Check Eligibility
        </Button>
        <KebabMenu
          label={`More for ${c.payer}`}
          items={[
            { label: 'View card images', onSelect: () => onAction?.('view-card', c) },
            { label: 'Eligibility history', onSelect: () => onAction?.('history', c) },
            { label: 'Start prior auth', onSelect: () => onAction?.('prior-auth', c) },
            { divider: true },
            { label: 'Make inactive', danger: true, onSelect: () => onAction?.('inactivate', c) },
          ]}
        />
      </div>
    </div>
  );
}

export interface InsuranceCoverageCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Coverages in billing order (controlled): Array<{payer, plan, memberId, group?, subscriber?, status?, checked?}>; default uncontrolled */
  coverages?: Coverage[];
  /** Initial coverages in billing order (uncontrolled); default [] */
  defaultCoverages?: Coverage[];
  /** Called with the new order after a move; default none */
  onReorder?: (coverages: Coverage[]) => void;
  /** Suggested order text; shows the order warning; default none */
  suggested?: string;
  /** Self-pay warning (no active coverage); default false */
  selfPay?: boolean;
  /** No arrows and no Add Coverage; default false */
  readOnly?: boolean;
  /** Add Coverage; default none */
  onAdd?: () => void;
  /** Apply Suggested Order in the order warning; default none */
  onApplySuggested?: () => void;
  /** Keep Current Order in the order warning; default none */
  onKeepOrder?: () => void;
  /** Check Eligibility on a coverage; default none */
  onCheckEligibility?: (coverage: Coverage) => void;
  /** An item of a coverage's More menu; default none */
  onCoverageAction?: (action: CoverageAction, coverage: Coverage) => void;
}

/** InsuranceCoverageCard lists a patient's active coverages in billing order (COB), with reorder arrows, eligibility status and a suggested-order warning. */
export function InsuranceCoverageCard({
  coverages,
  defaultCoverages = [],
  onReorder,
  suggested,
  selfPay = false,
  readOnly = false,
  onAdd,
  onApplySuggested,
  onKeepOrder,
  onCheckEligibility,
  onCoverageAction,
  ...rest
}: InsuranceCoverageCardProps) {
  const [cov, setCov] = useControllableState(coverages, defaultCoverages, onReorder);
  const listRef = useRef<HTMLElement>(null);
  const [refocus, setRefocus] = useState<{ payer: string; dir: 'up' | 'down' } | null>(null);

  // A moved row's arrow can become disabled (top or bottom): keep focus on an arrow of the moved coverage.
  useEffect(() => {
    if (!refocus || !listRef.current) return;
    const row = Array.from(listRef.current.querySelectorAll<HTMLElement>('[data-cov-payer]')).find(
      (el) => el.dataset.covPayer === refocus.payer
    );
    const same = row?.querySelector<HTMLButtonElement>(`[data-cov-move="${refocus.dir}"]`);
    const other = row?.querySelector<HTMLButtonElement>(`[data-cov-move="${refocus.dir === 'up' ? 'down' : 'up'}"]`);
    (same && !same.disabled ? same : other)?.focus();
    setRefocus(null);
  }, [refocus]);

  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= cov.length) return;
    const n = cov.slice();
    [n[i], n[j]] = [n[j]!, n[i]!];
    setCov(n);
    setRefocus({ payer: cov[i]!.payer, dir: d < 0 ? 'up' : 'down' });
  };

  return (
    <Card
      title="Active coverage, in billing order"
      subtitle="Use the arrows to change who is billed first. The claim goes to the top card; its payment then goes to the next one (COB)."
      actions={
        readOnly ? null : (
          <Button size="sm" iconLeft="plus" onClick={onAdd}>
            Add Coverage
          </Button>
        )
      }
      {...rest}
      ref={listRef}
    >
      {selfPay ? (
        <Alert tone="warning" title="Self-pay">
          No active coverage on file. Claims stop; the cost estimate becomes a Good Faith Estimate.
        </Alert>
      ) : null}
      {suggested ? (
        <Alert
          tone="warning"
          title="The order on file does not match the suggested order"
          actions={
            <>
              <Button size="sm" variant="primary" onClick={onApplySuggested}>
                Apply Suggested Order
              </Button>
              <Button size="sm" onClick={onKeepOrder}>
                Keep Current Order
              </Button>
            </>
          }
        >
          {`Suggested: ${suggested}. A claim sent in the wrong order is denied by the payer (CARC 22). The suggestion comes from the coverage dates and plan types; a person confirms it.`}
        </Alert>
      ) : null}
      {cov.map((c, i) => (
          <CoverageRow
            key={c.payer}
            data-cov-payer={c.payer}
            coverage={c}
            index={i}
            last={i === cov.length - 1}
            editable={!readOnly}
            onMove={move}
            onCheckEligibility={onCheckEligibility}
            onAction={onCoverageAction}
          />
      ))}
    </Card>
  );
}
