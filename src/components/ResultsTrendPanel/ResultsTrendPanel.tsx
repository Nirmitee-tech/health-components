import { forwardRef, type HTMLAttributes } from 'react';
import { number, useRangeContext, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { chartMeasure, chartValue, rangeText, Val, withContext, withRangeProvider, type ChartValueOverride } from '../../internal/chartPanels';
import { Card } from '../Card/Card';
import { EmptyState } from '../EmptyState/EmptyState';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { Sparkline } from '../Sparkline/Sparkline';

/** One dated value of a trended test. */
export interface ResultsTrendPoint {
  /** Draw date ('10/01/2026'); points with the same date share a table column */
  date: string;
  /** The measured number, unrounded */
  value: number;
}

/** One trended test. */
export interface ResultsTrendItem {
  /** Measure code: a section key ('Na', 'K', 'Cr', 'Hgb'...), a shared fmt key or a LOINC code */
  code: string;
  /** Lab range, unit or decimals sent with the result; wins over the shared registry; default none */
  over?: ChartValueOverride;
  /** Values, oldest first */
  points: ResultsTrendPoint[];
}

/** A group of tests, usually one LOINC panel. */
export interface ResultsTrendGroup {
  /** Group name ('Basic metabolic panel') */
  name: string;
  /** LOINC panel code; default none */
  panel?: string;
  /** Tests in the group */
  items: ResultsTrendItem[];
}

export type ResultsTrendView = 'grid' | 'table';

export interface ResultsTrendPanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Groups of trended tests; default none (empty state) */
  groups?: ResultsTrendGroup[];
  /** Shown view (controlled): 'grid' (sparkline tiles) | 'table' (date by test); default uncontrolled */
  view?: ResultsTrendView;
  /** Initial view: 'grid' | 'table'; default 'grid' */
  defaultView?: ResultsTrendView;
  /** Called when the view changes; default none */
  onViewChange?: (view: ResultsTrendView) => void;
  /** Most recent dates shown as table columns; default all */
  maxColumns?: number;
  /** Card title; default 'Results Trend' */
  title?: string;
  /** Card subtitle; default none */
  subtitle?: string;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

const time = (d: string) => {
  const t = new Date(d).getTime();
  return isNaN(t) ? 0 : t;
};

/** ResultsTrendPanel shows many lab results over time, grouped by LOINC panel, as a grid of sparkline tiles or as a date-by-test table. */
export const ResultsTrendPanel = forwardRef<HTMLElement, ResultsTrendPanelProps>(function ResultsTrendPanel(
  { groups: groupsProp, view: viewProp, defaultView = 'grid', onViewChange, maxColumns, title = 'Results Trend', subtitle, rangeContext, ...rest },
  ref
) {
  const ctx = useRangeContext(null, rangeContext);
  const [view, setView] = useControllableState<ResultsTrendView>(viewProp, defaultView, onViewChange);
  const groups = groupsProp || [];
  let dates: string[] = [];
  groups.forEach((g) => g.items.forEach((it) => it.points.forEach((pt) => (dates.includes(pt.date) ? null : dates.push(pt.date)))));
  dates.sort((a, b) => time(a) - time(b));
  if (maxColumns) dates = dates.slice(-maxColumns);

  return withRangeProvider(
    rangeContext,
    <Card
      ref={ref}
      title={title}
      subtitle={subtitle}
      actions={
        <SegmentedControl
          size="sm"
          label="View"
          value={view}
          onChange={(v) => setView(v as ResultsTrendView)}
          options={[
            { value: 'grid', label: 'Sparklines' },
            { value: 'table', label: 'Table' },
          ]}
        />
      }
      {...rest}
    >
      {!groups.length ? (
        <EmptyState compact title="No results in this period">
          Widen the date range or check outside records.
        </EmptyState>
      ) : view === 'grid' ? (
        <div>
          {groups.map((g) => (
            <section key={g.name} aria-label={g.name}>
              <div className="cp-sec">{g.name + (g.panel ? ' . LOINC panel ' + g.panel : '')}</div>
              <div className="cp-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))' }}>
                {g.items.map((it) => {
                  const last = it.points[it.points.length - 1];
                  const prev = it.points[it.points.length - 2];
                  if (!last) return null;
                  const r = chartValue(it.code, last.value, withContext(it.over, ctx));
                  const delta = prev ? Number(last.value) - Number(prev.value) : null;
                  return (
                    <div key={it.code} className={cx('cp-tile', r.flag && 'is-' + r.flag)}>
                      <div className="co-row co-gap-6" style={{ justifyContent: 'space-between' }}>
                        <b>{r.m.name}</b>
                        <span className="co-mi-s">{'LOINC ' + (r.m.loinc || 'none')}</span>
                      </div>
                      <div className="co-row co-gap-8" style={{ justifyContent: 'space-between' }}>
                        <Val code={it.code} value={last.value} over={it.over} label={r.m.name} />
                        <Sparkline
                          values={it.points.map((x) => Number(x.value))}
                          color={r.flag ? 'var(--co-danger)' : 'var(--co-primary)'}
                          label={r.m.name + ' trend'}
                        />
                      </div>
                      <span className="cp-rr">{'Ref ' + r.range}</span>
                      <span className="co-mi-s">
                        {last.date +
                          (delta != null && prev
                            ? ' . ' +
                              (delta > 0 ? '+' : delta < 0 ? '−' : '±') +
                              number(Math.abs(delta), r.m.dp) +
                              ' ' +
                              r.m.unit +
                              ' since ' +
                              prev.date
                            : ' . first result')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="co-tbx">
          <table className="co-table">
            <caption className="co-sr">Results by date</caption>
            <thead>
              <tr>
                <th className="co-th-plain" scope="col">
                  Test
                </th>
                <th className="co-th-plain" scope="col">
                  Reference
                </th>
                {dates.map((d) => (
                  <th key={d} className="co-th-plain co-num" scope="col">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            {groups.map((g) => (
              <tbody key={g.name}>
                <tr>
                  <th colSpan={dates.length + 2} scope="rowgroup" className="co-th-plain" style={{ background: 'var(--co-surface-alt)' }}>
                    {g.name}
                  </th>
                </tr>
                {g.items.map((it) => {
                  const m = chartMeasure(it.code, withContext(it.over, ctx));
                  return (
                    <tr key={it.code}>
                      <th scope="row" className="co-th-plain" style={{ background: 'none', fontWeight: 500 }}>
                        {m.name}
                        <span className="co-mi-s" style={{ display: 'block' }}>
                          {'LOINC ' + (m.loinc || 'none')}
                        </span>
                      </th>
                      <td>
                        <span className="cp-rr">{rangeText(m)}</span>
                      </td>
                      {dates.map((d) => {
                        const pt = it.points.find((x) => x.date === d);
                        return (
                          <td key={d} className="co-num">
                            {pt ? (
                              <Val code={it.code} value={pt.value} over={it.over} label={m.name + ' on ' + d} />
                            ) : (
                              <span className="co-mi-s" role="img" aria-label="Not drawn">
                                --
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            ))}
          </table>
        </div>
      )}
    </Card>
  );
});
