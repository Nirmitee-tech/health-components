import { forwardRef, useRef, useState, type HTMLAttributes } from 'react';
import { unitLabel, useRangeContext, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { format, isCritical, measureOf, num, NURSING_CONTEXT, Spark, Value, type NursingRange } from '../../internal/nursing';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Icon } from '../Icon/Icon';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';

export type { NursingRange };

/** One measure (row) of a Flowsheet. */
export interface FlowsheetRow {
  /** Row id */
  id: string;
  /** Group the row sits under; default 'Vitals' */
  group?: string;
  /** Row label */
  label: string;
  /** Measure key: a fmt.MEASURES key ('hr', 'temp', 'spo2', 'glucose'...), 'bp' ('124/78'), or a nursing key ('map', 'gcs', 'o2', 'ml', 'rate'); none for text rows */
  measure?: string;
  /** Patient-specific or age-based range; wins over the shared registry */
  range?: NursingRange;
  /** Value per column id */
  values?: Record<string, number | string>;
}

/** One charting time (column) of a Flowsheet. */
export interface FlowsheetColumn {
  /** Column id */
  id: string;
  /** Header text ('08:00') */
  label: string;
  /** Set on columns added with Add column */
  isNew?: boolean;
}

/** 'grid' | 'graph' */
export type FlowsheetView = 'grid' | 'graph';

export interface FlowsheetProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onChange'> {
  /** Measures down the side; required */
  rows: FlowsheetRow[];
  /** Charting times across the top; required */
  columns: FlowsheetColumn[];
  /** Id of the current column (marked with a left rule); default none */
  nowColumn?: string;
  /** Label for an added column, from the current columns; default 'New' */
  nextTime?: (columns: FlowsheetColumn[]) => string;
  /** Controlled view: 'grid' | 'graph' */
  view?: FlowsheetView;
  /** Initial view (uncontrolled); default 'grid' */
  defaultView?: FlowsheetView;
  /** Called when the view changes */
  onViewChange?: (view: FlowsheetView) => void;
  /** Initially collapsed group names; default [] */
  defaultCollapsed?: string[];
  /** Cell open for editing at first, as 'rowId|colId'; default none */
  defaultEditing?: string;
  /** View only: no editing, no Add column; default false */
  readOnly?: boolean;
  /** Called when a cell is saved */
  onChange?: (rowId: string, colId: string, value: string) => void;
  /** Called when a column is added */
  onAddColumn?: (column: FlowsheetColumn) => void;
  /** Card title; default 'Flowsheet' */
  title?: string;
  /** Patient and unit line; default none */
  subtitle?: string;
  /** Scroll height of the grid in px; default none */
  maxHeight?: number;
  /** Which shared reference range flags use; a row's own range still wins; default 'inpatient' when no global context is set */
  rangeContext?: RangeContextId;
}

const groupOf = (r: FlowsheetRow) => r.group || 'Vitals';

/**
 * Flowsheet is the nurse charting grid: measures down the side, times across the top, with add column, edit in
 * place, abnormal shading, collapsible groups and a graph view.
 */
export const Flowsheet = forwardRef<HTMLElement, FlowsheetProps>(function Flowsheet(
  {
    rows,
    columns,
    nowColumn,
    nextTime,
    view: viewProp,
    defaultView = 'grid',
    onViewChange,
    defaultCollapsed,
    defaultEditing,
    readOnly = false,
    onChange,
    onAddColumn,
    title = 'Flowsheet',
    subtitle,
    maxHeight,
    rangeContext,
    ...rest
  },
  ref
) {
  const ctx = useRangeContext(NURSING_CONTEXT, rangeContext);
  /* Columns added here and cells edited here overlay the props, so new props still flow through. */
  const [added, setAdded] = useState<FlowsheetColumn[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [collapsed, setCollapsed] = useState<string[]>(defaultCollapsed || []);
  const [editing, setEditingState] = useState<string | null>(defaultEditing || null);
  /* The open cell, read by blur: Enter and Escape close the cell before the input's blur fires. */
  const editingRef = useRef<string | null>(editing);
  const setEditing = (k: string | null) => {
    editingRef.current = k;
    setEditingState(k);
  };
  const [view, setView] = useControllableState<FlowsheetView>(viewProp, defaultView, onViewChange);
  const valueAt = (r: FlowsheetRow, colId: string): number | string | undefined => {
    const k = r.id + '|' + colId;
    return Object.prototype.hasOwnProperty.call(edits, k) ? edits[k] : (r.values || {})[colId];
  };
  const [draft, setDraft] = useState<string>(() => {
    if (!defaultEditing) return '';
    const [rowId, colId] = defaultEditing.split('|');
    const r0 = rows.find((r) => r.id === rowId);
    const v0 = r0 && colId ? (r0.values || {})[colId] : undefined;
    return v0 == null ? '' : String(v0);
  });
  const seq = useRef(0);
  const cols = columns.concat(added);
  const groups: string[] = [];
  rows.forEach((r) => {
    if (!groups.includes(groupOf(r))) groups.push(groupOf(r));
  });

  const commit = (rowId: string, colId: string, v: string) => {
    if (editingRef.current !== rowId + '|' + colId) return;
    setEdits((e) => ({ ...e, [rowId + '|' + colId]: v }));
    setEditing(null);
    onChange?.(rowId, colId, v);
  };
  const addCol = () => {
    seq.current += 1;
    const c: FlowsheetColumn = { id: `c${cols.length + 1}-new${seq.current}`, label: nextTime ? nextTime(cols) : 'New', isNew: true };
    setAdded((a) => a.concat([c]));
    onAddColumn?.(c);
  };
  const fmtCell = (r: FlowsheetRow, colId: string) => format(r.measure, valueAt(r, colId), { range: r.range, context: ctx });
  const countAbnormal = (list: FlowsheetRow[]) => {
    let n = 0;
    list.forEach((r) => cols.forEach((c) => (fmtCell(r, c.id).flag ? n++ : null)));
    return n;
  };
  const abnormal = countAbnormal(rows);

  const toolbar = (
    <div className="nu-bar">
      <SegmentedControl
        size="sm"
        label="View"
        value={view}
        onChange={(v) => setView(v as FlowsheetView)}
        options={[
          { value: 'grid', label: 'Grid' },
          { value: 'graph', label: 'Graph' },
        ]}
      />
      {abnormal ? (
        <Badge tone="warning" icon="alert" size="sm">
          {abnormal} abnormal
        </Badge>
      ) : (
        <Badge tone="success" size="sm">
          All in range
        </Badge>
      )}
      <span className="nu-sp" />
      {readOnly ? (
        <Badge tone="neutral" icon="lock">
          View only
        </Badge>
      ) : (
        <Button size="sm" iconLeft="plus" onClick={addCol}>
          Add column
        </Button>
      )}
    </div>
  );

  let body;
  if (view === 'graph') {
    const numeric = rows.filter((r) => r.measure && measureOf(r.measure) && r.measure !== 'bp' && r.measure !== 'ml');
    body = (
      <div className="nu-graph">
        {numeric.map((r) => {
          const vals = cols.map((c) => valueAt(r, c.id));
          let last: number | string | undefined;
          vals.forEach((v) => {
            if (num(v) !== null) last = v;
          });
          return (
            <div key={r.id} className="nu-gc">
              <h4>
                <span>{r.label}</span>
                {last !== undefined ? <Value measure={r.measure} value={last} range={r.range} rangeContext={ctx} /> : null}
              </h4>
              <Spark values={vals} measure={r.measure} label={r.label} range={r.range} rangeContext={ctx} />
              <div className="nu-muted nu-num">{cols[0] ? cols[0].label + ' to ' + cols[cols.length - 1]!.label : ''}</div>
            </div>
          );
        })}
      </div>
    );
  } else {
    body = (
      <div className="nu-tbx" style={maxHeight != null ? { maxHeight } : undefined}>
        <table className="nu-t">
          <caption className="co-sr">{title}. Rows are measures, columns are times.</caption>
          <thead>
            <tr>
              <th className="nu-rh" scope="col">
                Measure
              </th>
              {cols.map((c) => (
                <th key={c.id} scope="col" className={cx('nu-num nu-th-r', c.id === nowColumn && 'nu-now')}>
                  {c.label}
                  {c.isNew ? <span className="co-sr"> new column</span> : null}
                </th>
              ))}
            </tr>
          </thead>
          {groups.map((g) => {
            const open = !collapsed.includes(g);
            const gRows = rows.filter((r) => groupOf(r) === g);
            const nAb = open ? 0 : countAbnormal(gRows);
            return (
              <tbody key={g}>
                <tr className="nu-grp">
                  <th colSpan={cols.length + 1} scope="colgroup">
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setCollapsed(open ? collapsed.concat([g]) : collapsed.filter((x) => x !== g))}
                    >
                      <Icon name={open ? 'chevron-down' : 'chevron-right'} size={14} />
                      {g}
                      <span className="nu-muted">({gRows.length})</span>
                      {!open && nAb ? (
                        <Badge tone="warning" size="sm">
                          {nAb} abnormal
                        </Badge>
                      ) : null}
                    </button>
                  </th>
                </tr>
                {open
                  ? gRows.map((r) => {
                      const m = measureOf(r.measure);
                      const unit = r.measure === 'bp' ? unitLabel('mm[Hg]') : m ? unitLabel(m.unit) : '';
                      return (
                        <tr key={r.id}>
                          <th scope="row" className="nu-rh">
                            {r.label}
                            {unit ? <span className="nu-muted"> ({unit})</span> : null}
                          </th>
                          {cols.map((c) => {
                            const key = r.id + '|' + c.id;
                            const v = valueAt(r, c.id);
                            const f = fmtCell(r, c.id);
                            const isEd = !readOnly && editing === key;
                            const crit = isCritical(f.flag);
                            const cellName = r.label + ' at ' + c.label;
                            let content;
                            if (isEd) {
                              content = (
                                <input
                                  autoFocus
                                  aria-label={cellName}
                                  value={draft}
                                  inputMode={r.measure === 'bp' || !r.measure ? 'text' : 'decimal'}
                                  onChange={(e) => setDraft(e.target.value)}
                                  onBlur={() => commit(r.id, c.id, draft)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      commit(r.id, c.id, draft);
                                    }
                                    if (e.key === 'Escape') setEditing(null);
                                  }}
                                />
                              );
                            } else if (readOnly) {
                              content = <Value measure={r.measure} value={v} range={r.range} hideUnit rangeContext={ctx} />;
                            } else {
                              content = (
                                <button
                                  type="button"
                                  aria-label={
                                    'Edit ' + cellName + (v != null && v !== '' ? ', now ' + f.text + (f.unit ? ' ' + f.unit : '') : ', empty')
                                  }
                                  onClick={() => {
                                    setDraft(v == null ? '' : String(v));
                                    setEditing(key);
                                  }}
                                >
                                  <Value measure={r.measure} value={v} range={r.range} hideUnit tooltip={false} rangeContext={ctx} />
                                </button>
                              );
                            }
                            return (
                              <td
                                key={c.id}
                                className={cx(
                                  'nu-c',
                                  isEd && 'is-edit',
                                  !isEd && f.flag && (crit ? 'is-crit' : 'is-abn'),
                                  c.id === nowColumn && 'nu-now'
                                )}
                              >
                                {content}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            );
          })}
        </table>
      </div>
    );
  }

  return (
    <Card ref={ref} title={title} subtitle={subtitle} {...rest}>
      {toolbar}
      {body}
      <div className="nu-muted nu-foot">
        Shaded cells are outside the reference range for this patient. Hover a value to see the range used. Select a cell
        to chart a value.
      </div>
    </Card>
  );
});
