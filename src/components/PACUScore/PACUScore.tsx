import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { ALDRETE, AcuteTable, AcuteValue, aldrete, type AldreteScore, type AldreteValues } from '../../internal/acute';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';
import { Badge } from '../Badge/Badge';
import { Card } from '../Card/Card';

export { ALDRETE as ALDRETE_CRITERIA, aldrete } from '../../internal/acute';
export type { AldreteCriterion, AldreteItem, AldreteResult, AldreteScore, AldreteValues } from '../../internal/acute';

/** One earlier score in the history table. */
export interface PACUHistoryRow {
  /** 'HH:MM' */
  time: string;
  activity: number;
  respiration: number;
  circulation: number;
  consciousness: number;
  spo2: number;
}

export interface PACUScoreProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onChange' | 'defaultValue'> {
  /** Item scores (controlled); default uncontrolled */
  values?: AldreteValues;
  /** Initial item scores (uncontrolled), 0 | 1 | 2 each; default {} */
  defaultValues?: AldreteValues;
  /** Earlier scores by time; default [] */
  history?: PACUHistoryRow[];
  /** Radio group name prefix when several are on a page; default a generated unique prefix */
  name?: string;
  /** Locked review; default false */
  readOnly?: boolean;
  /** Line under the title; default none */
  subtitle?: string;
  /** Called with every item score when one changes; default none */
  onChange?: (values: AldreteValues) => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'ed' when no global context is set */
  rangeContext?: RangeContextId;
}

const TARGET = { lo: 9, hi: 10 };

/**
 * PACUScore scores recovery with the modified Aldrete scale (activity, respiration, circulation, consciousness, oxygen
 * saturation; 0 to 2 each, total out of 10) and shows when the patient meets phase I discharge criteria.
 */
export const PACUScore = forwardRef<HTMLElement, PACUScoreProps>(function PACUScore(
  { values, defaultValues, history = [], name, readOnly = false, subtitle, onChange, rangeContext, ...rest },
  ref
) {
  const [v, setV] = useControllableState<AldreteValues>(values, defaultValues || {}, onChange);
  const prefix = useDomId('co-pacu', name);
  const r = aldrete(v);
  const ro = readOnly;
  return (
    <Card
      ref={ref}
      title="PACU Score (modified Aldrete)"
      subtitle={subtitle}
      actions={
        r.total == null ? null : (
          <Badge tone={r.ready ? 'success' : r.complete ? 'warning' : 'neutral'} icon={r.ready ? 'check' : undefined}>
            {r.ready ? 'Meets discharge criteria' : r.complete ? 'Not ready' : 'Incomplete'}
          </Badge>
        )
      }
      {...rest}
    >
      <RangeContextProvider value={rangeContext}>
        <div className="co-pacu-list">
          {ALDRETE.map((c) => (
            <fieldset key={c.id} className="co-pacu-fs">
              <legend>{c.label}</legend>
              <div className="co-pacu-opts">
                {c.opts.map((o, i) => {
                  const on = v[c.id] === i;
                  return (
                    <label key={i} className={cx('co-pacu-opt', on && 'is-on', ro && 'is-ro')}>
                      <input
                        type="radio"
                        className="co-box co-radio"
                        name={prefix + '-' + c.id}
                        value={i}
                        checked={on}
                        disabled={ro}
                        onChange={() => setV({ ...v, [c.id]: i as AldreteScore })}
                      />
                      <span>
                        <b className="co-ac-num">{i + ' '}</b>
                        {o}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
        <div role="status" aria-live="polite" className="co-row co-gap-8 co-ac-wrap co-ac-status is-compact">
          <span className="co-kl">Total</span>
          {r.total == null ? (
            <span className="co-mi-s">Not scored</span>
          ) : (
            <AcuteValue measure="score" value={r.total} range={TARGET} />
          )}
          <span className="co-mi-s">Discharge from phase I at 9 or more with no item scored 0.</span>
        </div>
        {history.length ? (
          <AcuteTable label="Earlier PACU scores" className="co-pacu-hist">
            <thead>
              <tr>
                {['Time', 'Activity', 'Resp', 'Circ', 'Conscious', 'SpO2', 'Total'].map((h) => (
                  <th key={h} scope="col" className="co-th-plain co-num">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((row, i) => {
                const rr = aldrete(row);
                return (
                  <tr key={row.time + i}>
                    <td className="co-num co-ac-num">{row.time}</td>
                    {ALDRETE.map((c) => (
                      <td key={c.id} className="co-num co-ac-num">
                        {row[c.id]}
                      </td>
                    ))}
                    <td className="co-num">
                      <AcuteValue measure="score" value={rr.total} range={TARGET} shortFlag />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </AcuteTable>
        ) : null}
      </RangeContextProvider>
    </Card>
  );
});
