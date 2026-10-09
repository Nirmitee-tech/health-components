import { forwardRef, useState, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Checkbox } from '../Checkbox/Checkbox';
import { Tabs } from '../Tabs/Tabs';

/** One order inside an order set. */
export interface OrderSetItem {
  /** Order name ("Hemoglobin A1c") */
  name: string;
  /** Order type shown as a tag: 'Lab' (blue), 'Medication' (purple), anything else ('Imaging', 'Referral') neutral */
  type: string;
  /** What it will order ("LOINC 4548-4"); default none */
  detail?: string;
  /** Ticked when the set opens; `false` leaves it off; default true */
  default?: boolean;
}

/** One order set (a tab). */
export interface OrderSet {
  /** Set name on the tab ("Diabetes follow-up") */
  name: string;
  /** The orders in the set */
  items: OrderSetItem[];
}

export interface OrderSetPickerProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onChange'> {
  /** Array<{name, items: Array<{name, type, detail?, default?}>}>. Required */
  sets: OrderSet[];
  /** Line under the title (patient and service); default none */
  subtitle?: string;
  /** Index of the shown set (controlled); default undefined (uncontrolled) */
  current?: number;
  /** Index of the set shown first (uncontrolled); default 0 */
  defaultCurrent?: number;
  /** Called with the index of the newly shown set; default none */
  onCurrentChange?: (index: number) => void;
  /** Called by Sign Orders with the ticked items of the shown set; default none */
  onSign?: (items: OrderSetItem[], set: OrderSet) => void;
}

function tagTone(type: string): BadgeTone {
  if (type === 'Lab') return 'info';
  if (type === 'Medication') return 'ai';
  return 'neutral';
}

const defaults = (set: OrderSet | undefined): boolean[] => (set ? set.items.map((i) => i.default !== false) : []);

/** OrderSetPicker shows order sets as tabs and lets the provider tick the labs, imaging, meds and referrals to sign together. */
export const OrderSetPicker = forwardRef<HTMLElement, OrderSetPickerProps>(function OrderSetPicker(
  { sets, subtitle, current, defaultCurrent = 0, onCurrentChange, onSign, className, id, ...rest },
  ref
) {
  const base = useDomId('osp', id);
  const [cur, setCur] = useControllableState(current, defaultCurrent, onCurrentChange);
  // Ticks are kept per set, so switching tabs and back does not lose the provider's choices.
  const [ticks, setTicks] = useState<Record<number, boolean[]>>({});
  const set = sets[cur];
  const items = set?.items ?? [];
  const on = ticks[cur] ?? defaults(set);
  const count = on.filter(Boolean).length;
  const tabsId = `${base}-tabs`;
  const panelId = `${base}-panel`;

  return (
    <Card ref={ref} id={id} title="Order sets" subtitle={subtitle} className={cx('co-osp', className)} {...rest}>
      <Tabs
        id={tabsId}
        variant="pill"
        label="Order set"
        value={String(cur)}
        onChange={(v) => setCur(Number(v))}
        items={sets.map((s, i) => ({ id: String(i), label: s.name, count: s.items.length, panelId }))}
      />
      <div role="tabpanel" id={panelId} aria-labelledby={`${tabsId}-${cur}`}>
        <ul className="co-list">
          {items.map((it, i) => (
            <li key={it.name} className="co-li">
              <Checkbox
                label={it.name}
                description={it.detail}
                checked={!!on[i]}
                onChange={() => {
                  const next = on.slice();
                  next[i] = !next[i];
                  setTicks({ ...ticks, [cur]: next });
                }}
              />
              <Badge tone={tagTone(it.type)} size="sm">
                {it.type}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
      <div className="co-card-f">
        <span className="co-mi-s co-ml" aria-live="polite">
          {`${count} of ${items.length} selected`}
        </span>
        <Button
          variant="primary"
          disabled={count === 0}
          onClick={() => {
            if (set) onSign?.(items.filter((_, i) => on[i]), set);
          }}
        >
          Sign Orders
        </Button>
      </div>
    </Card>
  );
});
