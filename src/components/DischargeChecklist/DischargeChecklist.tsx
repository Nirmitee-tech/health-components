import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { useControllableState } from '../../internal/hooks';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Checkbox } from '../Checkbox/Checkbox';
import { ProgressBar } from '../ProgressBar/ProgressBar';

/** One discharge task. */
export interface DischargeItem {
  /** Task ('Home oxygen delivered') */
  label: string;
  /** Detail under the label; default none */
  detail?: string;
  /** Required before discharge; default false */
  required?: boolean;
  /** Done; default false */
  done?: boolean;
  /** Filled from the chart: cannot be ticked by hand; default false */
  auto?: boolean;
  /** Who owns it while open ('Case management'); default none */
  owner?: string;
  /** Who completed it; default none */
  by?: string | null;
}

export interface DischargeChecklistProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Array of { label, detail, required, done, auto, owner, by }: the starting list (uncontrolled); required */
  items: DischargeItem[];
  /** The list (controlled); pair with onItemsChange; default uncontrolled */
  itemsValue?: DischargeItem[];
  /** Called with the new list when a task is ticked or unticked; default none */
  onItemsChange?: (items: DischargeItem[]) => void;
  /** Patient name; default none */
  patient?: string;
  /** Expected discharge; default 'not set' */
  edd?: string;
  /** Name stamped on ticks; default 'You' */
  user?: string;
  /** View only; default false */
  readOnly?: boolean;
  /** Called by Ready for Discharge (enabled once every required task is done); default none */
  onReady?: () => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'inpatient' when no global context is set */
  rangeContext?: RangeContextId;
}

/** DischargeChecklist tracks the tasks that must be done before a patient leaves, who owns each one, and turns on Ready for Discharge only when the required ones are done. */
export const DischargeChecklist = forwardRef<HTMLElement, DischargeChecklistProps>(function DischargeChecklist(
  {
    items: initialItems,
    itemsValue,
    onItemsChange,
    patient,
    edd = 'not set',
    user = 'You',
    readOnly = false,
    onReady,
    rangeContext,
    ...rest
  },
  ref
) {
  const [items, setItems] = useControllableState(itemsValue, initialItems, onItemsChange);
  const done = items.filter((i) => i.done).length;
  const req = items.filter((i) => i.required && !i.done).length;
  return (
    <RangeContextProvider value={rangeContext}>
      <Card
        ref={ref}
        title="Discharge Readiness"
        subtitle={(patient ? patient + ' · ' : '') + 'Expected discharge ' + edd}
        actions={
          <Button variant="primary" size="sm" disabled={req > 0 || readOnly} onClick={onReady}>
            {req ? req + ' required left' : 'Ready for Discharge'}
          </Button>
        }
        {...rest}
      >
        <ProgressBar
          value={done}
          max={items.length || 1}
          label="Discharge tasks"
          valueText={done + ' of ' + items.length + ' done'}
          tone={req ? 'warning' : 'success'}
        />
        <ul className="ip-chk" style={{ marginTop: 10 }}>
          {items.map((it, i) => (
            <li key={i}>
              <Checkbox
                label={it.label + (it.required ? ' (required)' : '')}
                description={it.detail}
                checked={!!it.done}
                disabled={readOnly || it.auto}
                onChange={() => {
                  const next = items.slice();
                  next[i] = {
                    ...it,
                    done: !it.done,
                    by: !it.done ? user : null,
                  };
                  setItems(next);
                }}
              />
              <span className="ip-chk-m">
                {it.done
                  ? (it.auto ? 'From chart' : 'Done') + (it.by ? ' by ' + it.by : '')
                  : it.owner
                    ? 'Owner: ' + it.owner
                    : ''}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </RangeContextProvider>
  );
});
