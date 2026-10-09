import { forwardRef, useState, type FormEvent, type HTMLAttributes } from 'react';
import { useRangeContext, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useDomId } from '../../internal/hooks';
import { NURSING_CONTEXT, num, Value } from '../../internal/nursing';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';

/** 'in' (intake) | 'out' (output) */
export type IntakeOutputKind = 'in' | 'out';

/** One intake or output entry. */
export interface IntakeOutputEntry {
  /** Time ('09:15') */
  time: string;
  /** 'in' | 'out' */
  kind: IntakeOutputKind;
  /** Source ('PO', 'IV', 'Urine', 'Drain') */
  category: string;
  /** Volume in mL */
  amount: number;
  /** Note ('JP right') */
  note?: string;
}

/** Totals of a list of entries. */
export interface IntakeOutputTotals {
  /** Total intake in mL */
  intake: number;
  /** Total output in mL */
  output: number;
  /** Intake minus output in mL */
  net: number;
  /** Urine output (Urine, Foley, Void) in mL */
  urine: number;
  /** Running balance after each entry, in order */
  running: number[];
}

/** Intake, output, net balance, urine total and running balance of `entries`, in their order. */
export function intakeOutputTotals(entries: readonly IntakeOutputEntry[]): IntakeOutputTotals {
  let intake = 0;
  let output = 0;
  let urine = 0;
  const running: number[] = [];
  for (const e of entries) {
    const a = num(e.amount) || 0;
    if (e.kind === 'in') intake += a;
    else {
      output += a;
      if (/urine|foley|void/i.test(e.category)) urine += a;
    }
    running.push(intake - output);
  }
  return { intake, output, net: intake - output, urine, running };
}

export interface IntakeOutputPanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Entries in time order (initial list; entries added here are appended); default [] */
  entries?: IntakeOutputEntry[];
  /** Weight in kg, for urine output in mL/kg/h; default none (no rate) */
  weightKg?: number;
  /** Hours the entries cover, for mL/kg/h; default none (no rate) */
  hours?: number;
  /** Urine output target in mL/kg/h; default 0.5 */
  uoTarget?: number;
  /** Intake sources; default ['PO', 'IV', 'IV piggyback', 'Blood', 'Tube feed'] */
  inCategories?: string[];
  /** Output sources; default ['Urine', 'Emesis', 'Stool', 'Drain', 'NG', 'Blood loss'] */
  outCategories?: string[];
  /** Default time of a new entry; default '' */
  now?: string;
  /** Opens the add form at first; default false */
  defaultAdding?: boolean;
  /** View only: no Add entry; default false */
  readOnly?: boolean;
  /** Called with the new entry when one is saved */
  onAdd?: (entry: IntakeOutputEntry) => void;
  /** Card title; default 'Intake and Output' */
  title?: string;
  /** Shift line; default none */
  subtitle?: string;
  /** Which shared reference range flags use; default 'inpatient' when no global context is set */
  rangeContext?: RangeContextId;
}

const IN_DEFAULT = ['PO', 'IV', 'IV piggyback', 'Blood', 'Tube feed'];
const OUT_DEFAULT = ['Urine', 'Emesis', 'Stool', 'Drain', 'NG', 'Blood loss'];

interface Draft {
  time: string;
  kind: IntakeOutputKind;
  category: string;
  amount: string;
}

/** IntakeOutputPanel lists intake and output entries for a shift with a running balance, totals and urine output in mL/kg/h. */
export const IntakeOutputPanel = forwardRef<HTMLElement, IntakeOutputPanelProps>(function IntakeOutputPanel(
  {
    entries: entriesProp,
    weightKg,
    hours: hoursProp,
    uoTarget = 0.5,
    inCategories,
    outCategories,
    now = '',
    defaultAdding = false,
    readOnly = false,
    onAdd,
    title = 'Intake and Output',
    subtitle,
    rangeContext,
    ...rest
  },
  ref
) {
  const ctx = useRangeContext(NURSING_CONTEXT, rangeContext);
  const idBase = useDomId('co-io');
  const inCats = inCategories && inCategories.length ? inCategories : IN_DEFAULT;
  const outCats = outCategories && outCategories.length ? outCategories : OUT_DEFAULT;
  const [added, setAdded] = useState<IntakeOutputEntry[]>([]);
  const [form, setForm] = useState<Draft>({ time: now, kind: 'in', category: inCats[0]!, amount: '' });
  const [adding, setAdding] = useState(defaultAdding && !readOnly);
  const entries = (entriesProp || []).concat(added);
  const t = intakeOutputTotals(entries);
  const cats = form.kind === 'in' ? inCats : outCats;
  const hours = num(hoursProp);
  const weight = num(weightKg);
  const uoRate = hours && weight ? t.urine / weight / hours : null;
  const uoLow = uoRate !== null && uoRate < uoTarget;
  const amountOk = num(form.amount) !== null && Number(form.amount) >= 0;

  const add = (e: FormEvent) => {
    e.preventDefault();
    if (!amountOk) return;
    const entry: IntakeOutputEntry = { time: form.time, kind: form.kind, category: form.category, amount: Number(form.amount) };
    setAdded((a) => a.concat([entry]));
    setForm({ ...form, amount: '' });
    setAdding(false);
    onAdd?.(entry);
  };

  return (
    <Card
      ref={ref}
      title={title}
      subtitle={subtitle}
      actions={
        readOnly ? (
          <Badge tone="neutral" icon="lock">
            View only
          </Badge>
        ) : (
          <Button size="sm" iconLeft="plus" aria-expanded={adding} onClick={() => setAdding(!adding)}>
            Add entry
          </Button>
        )
      }
      {...rest}
    >
      <div className="nu-io-sum">
        <div>
          <div className="l">Intake</div>
          <div className="n">
            <Value measure="ml" value={t.intake} label="Intake" rangeContext={ctx} />
          </div>
        </div>
        <div>
          <div className="l">Output</div>
          <div className="n">
            <Value measure="ml" value={t.output} label="Output" rangeContext={ctx} />
          </div>
        </div>
        <div>
          <div className="l">Net balance</div>
          <div className="n">
            <Value measure="ml" value={t.net} signed label="Net balance" rangeContext={ctx} />
          </div>
        </div>
      </div>
      {uoRate !== null ? (
        <Alert
          tone={uoLow ? 'warning' : 'info'}
          title={
            <span>
              Urine output <Value measure="uoRate" value={uoRate} range={{ low: uoTarget }} rangeContext={ctx} /> over {hours} h
            </span>
          }
        >
          {uoLow ? 'Below the target. ' : 'At or above the target. '}
          <span>
            Uses weight <Value measure="weight" value={weight} rangeContext={ctx} />.
          </span>
        </Alert>
      ) : null}
      {adding && !readOnly ? (
        <form className="nu-panel nu-row nu-io-form" onSubmit={add} aria-label="Add intake or output entry">
          <label className="nu-lbl" htmlFor={idBase + '-time'}>
            Time
            <input
              id={idBase + '-time'}
              className="nu-inp nu-num nu-w80"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </label>
          <label className="nu-lbl" htmlFor={idBase + '-kind'}>
            Type
            <select
              id={idBase + '-kind'}
              className="nu-inp"
              value={form.kind}
              onChange={(e) => {
                const k = e.target.value as IntakeOutputKind;
                setForm({ ...form, kind: k, category: (k === 'in' ? inCats : outCats)[0]! });
              }}
            >
              <option value="in">Intake</option>
              <option value="out">Output</option>
            </select>
          </label>
          <label className="nu-lbl" htmlFor={idBase + '-cat'}>
            Source
            <select
              id={idBase + '-cat'}
              className="nu-inp"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {cats.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="nu-lbl" htmlFor={idBase + '-amt'}>
            Amount (mL)
            <input
              id={idBase + '-amt'}
              className="nu-inp nu-num nu-w90"
              inputMode="numeric"
              value={form.amount}
              aria-invalid={form.amount !== '' && !amountOk ? true : undefined}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </label>
          <Button size="sm" variant="primary" type="submit" className="nu-end">
            Save
          </Button>
        </form>
      ) : null}
      <div className="nu-tbx">
        <table className="nu-t">
          <caption className="co-sr">Intake and output entries with running balance</caption>
          <thead>
            <tr>
              {['Time', 'Type', 'Source', 'Intake', 'Output', 'Running balance'].map((c, i) => (
                <th key={c} scope="col" className={i > 2 ? 'nu-th-r' : undefined}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.length ? (
              entries.map((e, i) => {
                const bal = t.running[i]!;
                return (
                  <tr key={i}>
                    <td className="nu-num">{e.time}</td>
                    <td>{e.kind === 'in' ? 'Intake' : 'Output'}</td>
                    <td>
                      {e.category}
                      {e.note ? <span className="nu-muted"> {e.note}</span> : null}
                    </td>
                    <td className="nu-c">{e.kind === 'in' ? <Value measure="ml" value={e.amount} label="Intake" rangeContext={ctx} /> : null}</td>
                    <td className="nu-c">{e.kind === 'out' ? <Value measure="ml" value={e.amount} label="Output" rangeContext={ctx} /> : null}</td>
                    <td className="nu-c">
                      <span className={cx('nu-bal', bal > 0 ? 'pos' : bal < 0 ? 'neg' : '')}>
                        <Value measure="ml" value={bal} signed label="Running balance" rangeContext={ctx} />
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="nu-muted">
                  No intake or output charted this shift.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
});
