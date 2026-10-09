import { forwardRef, useState, type HTMLAttributes, type KeyboardEvent } from 'react';
import { useRangeContext, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useDomId } from '../../internal/hooks';
import { chartMeasure, chartValue, FLAG_WORDS, Val, withContext, withRangeProvider, type ChartValueOverride } from '../../internal/chartPanels';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';

/** One flowsheet column. */
export interface StructuredDataGridColumn {
  /** Row field this column edits */
  key: string;
  /** Column header ('HR') */
  label: string;
  /** Measure code ('HR', 'SBP', 'K'...): formats the value and warns outside its reference range; default none */
  code?: string;
  /** Lab range, unit or decimals for `code`; wins over the shared registry; default none */
  over?: ChartValueOverride;
  /** 'number' | 'text' | 'select'; default 'number' */
  type?: 'number' | 'text' | 'select';
  /** Options of a select column; default none */
  options?: string[];
  /** Hard lower limit a person could have; below it the save is blocked; default none */
  min?: number;
  /** Hard upper limit; above it the save is blocked; default none */
  max?: number;
  /** A value is required to save; default false */
  required?: boolean;
  /** Shown but not editable (time, run date); default false */
  readOnly?: boolean;
}

/** One flowsheet row: column key to the text typed. */
export type StructuredDataGridRow = Record<string, string>;

export interface StructuredDataGridProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Columns; required */
  columns: StructuredDataGridColumn[];
  /** Initial rows; the grid keeps its own copy as the user types; default none */
  rows?: StructuredDataGridRow[];
  /** Card title, also the grid's accessible name; default none */
  title?: string;
  /** Card subtitle; default none */
  subtitle?: string;
  /** Whole grid read only; default false */
  readOnly?: boolean;
  /** Called with the rows when Save passes the checks; default none */
  onSave?: (rows: StructuredDataGridRow[]) => void;
  /** Called with the rows after every edit; default none */
  onRowsChange?: (rows: StructuredDataGridRow[]) => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

/** A cell check result. */
interface CellIssue {
  level: 'bad' | 'warn';
  msg: string;
}

/*
 * Validation layers, weakest first: required (something typed), parse (it is a number), plausible (inside hard
 * limits a person could have), reference (inside the normal range: a warning, never a block). None of these proves
 * the reading is right.
 */
function checkCell(col: StructuredDataGridColumn, raw: string | undefined, ctx: RangeContextId): CellIssue | null {
  if (raw == null || raw === '') return col.required ? { level: 'bad', msg: 'Required' } : null;
  if (col.type === 'select' || col.type === 'text') return null;
  if (!/^-?\d+(\.\d+)?$/.test(String(raw).trim())) return { level: 'bad', msg: 'Numbers only' };
  const v = Number(raw);
  if ((col.min != null && v < col.min) || (col.max != null && v > col.max)) {
    return { level: 'bad', msg: 'Outside ' + col.min + ' to ' + col.max + '. Check entry.' };
  }
  if (col.code) {
    const r = chartValue(col.code, v, withContext(col.over, ctx));
    if (r.flag) return { level: 'warn', msg: (FLAG_WORDS[r.flag] ?? r.flag) + ' (ref ' + r.range + ')' };
  }
  return null;
}

/**
 * StructuredDataGrid is a spreadsheet-like flowsheet for entering many numbers at once, with checks that block
 * impossible values and warn on out-of-range ones.
 */
export const StructuredDataGrid = forwardRef<HTMLElement, StructuredDataGridProps>(function StructuredDataGrid(
  { columns, rows: rowsProp, title, subtitle, readOnly = false, onSave, onRowsChange, rangeContext, id, ...rest },
  ref
) {
  const ctx = useRangeContext(null, rangeContext);
  const base = useDomId('cp-sg', id);
  const cols = columns || [];
  const [rows, setRowsState] = useState<StructuredDataGridRow[]>(rowsProp || []);
  const [tried, setTried] = useState(false);
  const setRows = (next: StructuredDataGridRow[]) => {
    setRowsState(next);
    onRowsChange?.(next);
  };
  let issues = 0;
  let bad = 0;
  rows.forEach((r) =>
    cols.forEach((c) => {
      if (c.readOnly) return;
      const x = checkCell(c, r[c.key], ctx);
      if (x) {
        issues++;
        if (x.level === 'bad') bad++;
      }
    })
  );
  const set = (i: number, k: string, v: string) => setRows(rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  const focusCell = (el: HTMLElement, ri: number, ci: number) =>
    el.closest('table')?.querySelector<HTMLElement>(`[data-cell="${ri}-${ci}"]`) ?? null;

  const onKey = (e: KeyboardEvent<HTMLInputElement | HTMLSelectElement>, i: number, ci: number) => {
    const el = e.currentTarget;
    let target: HTMLElement | null = null;
    if (e.key === 'Enter' || (e.key === 'ArrowDown' && el.tagName === 'INPUT')) target = focusCell(el, i + 1, ci);
    else if (e.key === 'ArrowUp' && el.tagName === 'INPUT') target = focusCell(el, i - 1, ci);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      /* Inside text, the arrows move the caret; at its start or end they move to the next editable cell. */
      if (el instanceof HTMLInputElement) {
        const atStart = el.selectionStart === 0 && el.selectionEnd === 0;
        const atEnd = el.selectionStart === el.value.length && el.selectionEnd === el.value.length;
        if ((e.key === 'ArrowLeft' && !atStart) || (e.key === 'ArrowRight' && !atEnd)) return;
      }
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      for (let c = ci + dir; c >= 0 && c < cols.length && !target; c += dir) target = focusCell(el, i, c);
    }
    if (target) {
      e.preventDefault();
      target.focus();
    }
  };

  return withRangeProvider(
    rangeContext,
    <Card
      ref={ref}
      id={id}
      title={title}
      subtitle={subtitle}
      actions={
        readOnly ? (
          <Badge icon="lock">Read only</Badge>
        ) : (
          <Badge tone={bad ? 'danger' : issues ? 'warning' : 'success'}>
            {bad ? bad + ' to fix' : issues ? issues + ' out of range' : 'All valid'}
          </Badge>
        )
      }
      {...rest}
    >
      {tried && bad ? (
        <Alert tone="error" title={'Fix ' + bad + ' cell' + (bad > 1 ? 's' : '') + ' before saving'}>
          Cells outside the possible limits or not numbers block the save. Out-of-range values only warn.
        </Alert>
      ) : null}
      <div className="co-tbx">
        <table className="co-table cp-sg" role={readOnly ? undefined : 'grid'} aria-label={title || 'Flowsheet'}>
          <thead>
            <tr>
              {cols.map((c) => {
                const m = c.code ? chartMeasure(c.code, withContext(c.over, ctx)) : null;
                return (
                  <th key={c.key} className={cx('co-th-plain', m && 'co-num')} scope="col">
                    {c.label}
                    {m ? (
                      <span className="co-mi-s" style={{ display: 'block' }}>
                        {m.unit}
                      </span>
                    ) : null}
                    {c.required ? (
                      <span className="co-req" aria-hidden="true">
                        {' *'}
                      </span>
                    ) : null}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {cols.map((c, ci) => {
                  const x = c.readOnly ? null : checkCell(c, r[c.key], ctx);
                  const show = !!x && (tried || r[c.key] !== '' || x.level !== 'bad');
                  const first = cols[0] ? r[cols[0].key] : undefined;
                  const lbl = c.label + ', ' + (first || 'row ' + (i + 1));
                  const v = r[c.key];
                  if (c.readOnly || readOnly) {
                    return (
                      <td key={c.key} className={c.code ? 'co-num' : undefined}>
                        {c.code && v !== '' && v != null ? (
                          <Val code={c.code} value={v} over={c.over} label={lbl} />
                        ) : (
                          v || <span className="co-mi-s">--</span>
                        )}
                      </td>
                    );
                  }
                  const msgId = `${base}-msg-${i}-${ci}`;
                  return (
                    <td key={c.key} className={cx(show && x!.level === 'bad' && 'is-bad', show && x!.level === 'warn' && 'is-warn')}>
                      {c.type === 'select' ? (
                        <select
                          className="co-inp co-inp-sm"
                          aria-label={lbl}
                          aria-required={c.required || undefined}
                          aria-invalid={show && x!.level === 'bad' ? true : undefined}
                          aria-describedby={show ? msgId : undefined}
                          value={v || ''}
                          data-cell={i + '-' + ci}
                          onChange={(e) => set(i, c.key, e.target.value)}
                          onKeyDown={(e) => onKey(e, i, ci)}
                        >
                          {[''].concat(c.options || []).map((o) => (
                            <option key={o} value={o}>
                              {o || 'Choose'}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="co-inp co-inp-sm"
                          style={c.code ? { textAlign: 'right', fontVariantNumeric: 'tabular-nums' } : undefined}
                          inputMode={c.code ? 'decimal' : undefined}
                          aria-label={lbl + (c.code ? ' in ' + chartMeasure(c.code, c.over).unit : '')}
                          aria-required={c.required || undefined}
                          aria-invalid={show && x!.level === 'bad' ? true : undefined}
                          aria-describedby={show ? msgId : undefined}
                          value={v == null ? '' : v}
                          data-cell={i + '-' + ci}
                          onChange={(e) => set(i, c.key, e.target.value)}
                          onKeyDown={(e) => onKey(e, i, ci)}
                        />
                      )}
                      {show ? (
                        <span id={msgId} className="cp-msg" role={x!.level === 'bad' ? 'alert' : undefined}>
                          {x!.msg}
                        </span>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {readOnly ? null : (
        <div className="co-row co-gap-8" style={{ marginTop: 8 }}>
          <Button
            variant="primary"
            onClick={() => {
              setTried(true);
              if (!bad) onSave?.(rows);
            }}
          >
            Save Flowsheet
          </Button>
          <Button
            iconLeft="plus"
            onClick={() => {
              const o: StructuredDataGridRow = {};
              cols.forEach((c) => (o[c.key] = ''));
              setRows(rows.concat([o]));
            }}
          >
            Add Row
          </Button>
          <span className="co-mi-s">Enter or Down moves to the next row.</span>
        </div>
      )}
    </Card>
  );
});
