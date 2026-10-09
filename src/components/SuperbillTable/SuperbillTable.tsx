import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';

/** One billable code on the fee sheet. */
export interface SuperbillCode {
  /** CPT or HCPCS code */
  code: string;
  /** Short description */
  label: string;
  /** Fee in dollars */
  fee: number;
}

/** A fee sheet section, e.g. "Office visits, established". */
export interface SuperbillGroup {
  /** Section name */
  name: string;
  /** Codes in the section */
  codes: SuperbillCode[];
}

export interface SuperbillTableProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Fee sheet sections. Required */
  groups: SuperbillGroup[];
  /** Controlled selected codes; default undefined (uncontrolled) */
  selected?: string[];
  /** Initially selected codes when uncontrolled; default [] */
  defaultSelected?: string[];
  /** Called with the new list of selected codes */
  onSelectedChange?: (codes: string[]) => void;
  /** Line under the title (patient, date, specialty); default none */
  subtitle?: string;
  /** Called when Print is pressed; default none */
  onPrint?: () => void;
  /** Called with the selected codes when Send to Billing is pressed; default none */
  onSend?: (codes: string[]) => void;
}

function money(n: number): string {
  const v = Number(n) || 0;
  return (v < 0 ? '-$' : '$') + Math.abs(v).toFixed(2);
}

const EMPTY: string[] = [];

/** SuperbillTable is the tick-box fee sheet grouped by visit type with fees and a running total. */
export const SuperbillTable = forwardRef<HTMLElement, SuperbillTableProps>(function SuperbillTable(
  { groups, selected: selectedProp, defaultSelected = EMPTY, onSelectedChange, subtitle, onPrint, onSend, className, ...rest },
  ref
) {
  const [sel, setSel] = useControllableState<string[]>(selectedProp, defaultSelected, onSelectedChange);
  const total = groups.reduce(
    (sum, g) => sum + g.codes.filter((c) => sel.includes(c.code)).reduce((x, c) => x + c.fee, 0),
    0
  );
  const toggle = (code: string) => setSel(sel.includes(code) ? sel.filter((x) => x !== code) : [...sel, code]);
  return (
    <Card
      ref={ref}
      className={className}
      title="Superbill"
      subtitle={subtitle}
      actions={
        <b aria-live="polite" aria-atomic="true">
          {`Total ${money(total)}`}
        </b>
      }
      footer={
        <>
          <Button onClick={onPrint}>Print</Button>
          <Button variant="primary" onClick={() => onSend?.(sel)}>
            Send to Billing
          </Button>
        </>
      }
      {...rest}
    >
      <div className="co-superbill">
        {groups.map((g) => (
          <fieldset key={g.name} className="co-fs">
            <legend className="co-kl">{g.name}</legend>
            {g.codes.map((c) => {
              const on = sel.includes(c.code);
              return (
                <label key={c.code} className={cx('co-sb-row', on && 'is-on')}>
                  <input type="checkbox" className="co-box" checked={on} onChange={() => toggle(c.code)} />
                  <span className="co-code">{c.code}</span>
                  <span style={{ flex: 1 }}>{c.label}</span>
                  <span className="co-num">{money(c.fee)}</span>
                </label>
              );
            })}
          </fieldset>
        ))}
      </div>
    </Card>
  );
});
