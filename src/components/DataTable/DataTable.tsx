import { Fragment, isValidElement, useMemo, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';
import { KebabMenu, type MenuItem } from '../Menu/Menu';
import { Pagination } from '../Pagination/Pagination';
import { Skeleton } from '../Skeleton/Skeleton';

/** A row id: the value of `rowKey`. */
export type DataTableRowId = string | number;
export type DataTableSortDir = 'asc' | 'desc';

/** The active sort: column key and direction. */
export interface DataTableSort {
  /** Column key. */
  key: string;
  /** 'asc' | 'desc' */
  dir: DataTableSortDir;
}

/** A value a column can sort by. */
export type DataTableSortValue = string | number | boolean | Date | null | undefined;

/** One column of a DataTable. */
export interface DataTableColumn<T> {
  /** Field of the row shown in this column (and sorted by); also the React key. */
  key: (keyof T & string) | (string & {});
  /** Header text. */
  label: ReactNode;
  /** Header becomes a sort button; default false */
  sortable?: boolean;
  /** 'left' | 'right' (numbers, with tabular figures); default 'left' */
  align?: 'left' | 'right';
  /** Custom cell content; default the field value */
  render?(row: T): ReactNode;
  /** Value to sort by when the field is not directly comparable (dates as MM/DD/YYYY); default the field value */
  sortValue?(row: T): DataTableSortValue;
}

export interface DataTableProps<T extends object>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  /** Array<{key, label, sortable?, align?, render?, sortValue?}>. Required */
  columns: ReadonlyArray<DataTableColumn<T>>;
  /** The records. Required */
  rows: ReadonlyArray<T>;
  /** Field that identifies a row, or a function returning the id; default "id" */
  rowKey?: (keyof T & string) | ((row: T) => DataTableRowId);
  /** Row checkboxes and a select-all-on-page checkbox; default false */
  selectable?: boolean;
  /** Selected row ids (controlled) */
  selected?: DataTableRowId[];
  /** Initially selected row ids (uncontrolled); default [] */
  defaultSelected?: DataTableRowId[];
  /** Called with the new selected ids; default none */
  onSelectedChange?: (ids: DataTableRowId[]) => void;
  /** (selectedIds) => node: actions shown in the bulk bar while rows are selected; default none */
  bulkActions?: (selectedIds: DataTableRowId[]) => ReactNode;
  /** (row) => MenuItem[]: a kebab menu at the end of each row; default none */
  rowMenu?: (row: T) => MenuItem[];
  /** (row) => node: makes rows expandable; default none */
  renderExpanded?: (row: T) => ReactNode;
  /** Expanded row ids (controlled) */
  expanded?: DataTableRowId[];
  /** Initially expanded row ids (uncontrolled); default [] */
  defaultExpanded?: DataTableRowId[];
  /** Called with the new expanded ids; default none */
  onExpandedChange?: (ids: DataTableRowId[]) => void;
  /** Shows skeleton rows and hides pagination; default false */
  loading?: boolean;
  /** Text when there are no rows; default "No records match your search or filters." */
  emptyText?: ReactNode;
  /** Node when there are no rows (an EmptyState); wins over emptyText; default none */
  emptyState?: ReactNode;
  /** Initial rows per page; default 10 */
  pageSize?: number;
  /** Rows-per-page choices, or false to hide the selector; default [5, 10, 25, 50] */
  pageSizes?: readonly number[] | false;
  /** Called with the new rows per page; default none */
  onPageSizeChange?: (size: number) => void;
  /** Current page, 1-based (controlled) */
  page?: number;
  /** Initial page (uncontrolled); default 1 */
  defaultPage?: number;
  /** Called with the new page; default none */
  onPageChange?: (page: number) => void;
  /** Paginate the rows; default true */
  pagination?: boolean;
  /** Active sort (controlled); null for none */
  sort?: DataTableSort | null;
  /** Initial sort {key, dir} (uncontrolled); default none */
  defaultSort?: DataTableSort | null;
  /** Called with the new sort; default none */
  onSortChange?: (sort: DataTableSort | null) => void;
  /** Toolbar above the table (search, filters); replaced by the bulk bar while rows are selected; default none */
  toolbar?: ReactNode;
  /** Screen reader caption; default none */
  caption?: string;
}

const DEFAULT_EMPTY = 'No records match your search or filters.';

function field<T>(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key];
}

function toNode(v: unknown): ReactNode {
  if (v == null || typeof v === 'boolean') return null;
  if (typeof v === 'string' || typeof v === 'number' || isValidElement(v)) return v as ReactNode;
  if (v instanceof Date) return v.toLocaleDateString();
  return String(v);
}

function compare(a: DataTableSortValue, b: DataTableSortValue): number {
  if (a == null || a === '') return b == null || b === '' ? 0 : 1; // empty values last
  if (b == null || b === '') return -1;
  const x = a instanceof Date ? a.getTime() : a;
  const y = b instanceof Date ? b.getTime() : b;
  if (typeof x === 'number' && typeof y === 'number') return x - y;
  if (typeof x === 'string' && typeof y === 'string') return x.localeCompare(y, undefined, { numeric: true, sensitivity: 'base' });
  return x > y ? 1 : x < y ? -1 : 0;
}

/**
 * DataTable lists records with sorting, row selection with bulk actions, a row menu, expandable rows,
 * empty and loading states, and pagination with rows per page.
 */
export function DataTable<T extends object>({
  columns,
  rows,
  rowKey = 'id' as keyof T & string,
  selectable = false,
  selected,
  defaultSelected = [],
  onSelectedChange,
  bulkActions,
  rowMenu,
  renderExpanded,
  expanded,
  defaultExpanded = [],
  onExpandedChange,
  loading = false,
  emptyText,
  emptyState,
  pageSize: initialPageSize = 10,
  pageSizes,
  onPageSizeChange,
  page,
  defaultPage = 1,
  onPageChange,
  pagination = true,
  sort,
  defaultSort = null,
  onSortChange,
  toolbar,
  caption,
  className,
  id,
  ...rest
}: DataTableProps<T>) {
  const baseId = useDomId('co-dt', id);
  const [currentSort, setSort] = useControllableState<DataTableSort | null>(sort, defaultSort, onSortChange);
  const [sel, setSel] = useControllableState<DataTableRowId[]>(selected, defaultSelected, onSelectedChange);
  const [exp, setExp] = useControllableState<DataTableRowId[]>(expanded, defaultExpanded, onExpandedChange);
  const [rawPage, setPage] = useControllableState(page, defaultPage, onPageChange);
  const [ps, setPs] = useControllableState<number>(undefined, initialPageSize, onPageSizeChange);

  const getId = (r: T): DataTableRowId =>
    typeof rowKey === 'function' ? rowKey(r) : (field(r, rowKey) as DataTableRowId);
  const firstKey = columns[0]?.key;
  const rowName = (r: T): string => {
    const v = firstKey ? field(r, firstKey) : undefined;
    return typeof v === 'string' || typeof v === 'number' ? String(v) : String(getId(r));
  };

  const sorted = useMemo(() => {
    if (!currentSort) return rows;
    const col = columns.find((c) => c.key === currentSort.key);
    const value = (r: T): DataTableSortValue =>
      col?.sortValue ? col.sortValue(r) : (field(r, currentSort.key) as DataTableSortValue);
    const d = currentSort.dir === 'desc' ? -1 : 1;
    return rows
      .map((r, i) => ({ r, i, v: value(r) }))
      .sort((a, b) => {
        const empties = (a.v == null || a.v === '') !== (b.v == null || b.v === '');
        const c = compare(a.v, b.v);
        // Empty values stay last in both directions; ties keep their original order.
        return (empties ? c : c * d) || a.i - b.i;
      })
      .map((x) => x.r);
  }, [rows, columns, currentSort]);

  const size = ps > 0 ? ps : 10;
  const pageCount = Math.max(1, Math.ceil(sorted.length / size));
  const currentPage = Math.min(Math.max(1, rawPage), pageCount);
  const paged = pagination ? sorted.slice((currentPage - 1) * size, currentPage * size) : sorted;

  const isSel = (rid: DataTableRowId) => sel.includes(rid);
  const pageIds = paged.map(getId);
  const allOn = pageIds.length > 0 && pageIds.every(isSel);
  const someOn = pageIds.some(isSel);

  const toggleSel = (rid: DataTableRowId) => setSel(isSel(rid) ? sel.filter((x) => x !== rid) : [...sel, rid]);
  const toggleAll = () =>
    setSel(allOn ? sel.filter((x) => !pageIds.includes(x)) : [...sel, ...pageIds.filter((x) => !sel.includes(x))]);
  const toggleExp = (rid: DataTableRowId) =>
    setExp(exp.includes(rid) ? exp.filter((x) => x !== rid) : [...exp, rid]);

  const onSortClick = (key: string) => {
    const on = currentSort?.key === key;
    setSort(on && currentSort?.dir === 'asc' ? { key, dir: 'desc' } : { key, dir: 'asc' });
  };

  const ncol = columns.length + (selectable ? 1 : 0) + (rowMenu ? 1 : 0) + (renderExpanded ? 1 : 0);
  const bulkOn = selectable && sel.length > 0 && !!bulkActions;

  let body: ReactNode;
  if (loading) {
    body = [0, 1, 2, 3].map((i) => (
      <tr key={i}>
        <td colSpan={ncol}>
          <Skeleton variant="text" width={`${90 - i * 12}%`} label={i === 0 ? 'Loading rows' : undefined} aria-hidden={i === 0 ? undefined : true} />
        </td>
      </tr>
    ));
  } else if (paged.length === 0) {
    body = (
      <tr>
        <td colSpan={ncol} className="co-td-empty">
          {emptyState ?? emptyText ?? DEFAULT_EMPTY}
        </td>
      </tr>
    );
  } else {
    body = paged.map((r) => {
      const rid = getId(r);
      const on = isSel(rid);
      const open = exp.includes(rid);
      const name = rowName(r);
      const xId = `${baseId}-x-${String(rid).replace(/\s+/g, '-')}`;
      return (
        <Fragment key={rid}>
          <tr className={cx(on && 'is-sel')}>
            {renderExpanded ? (
              <td className="co-td-x">
                <IconButton
                  icon={open ? 'chevron-down' : 'chevron-right'}
                  label={`${open ? 'Collapse' : 'Expand'} ${name}`}
                  size="sm"
                  aria-expanded={open}
                  aria-controls={open ? xId : undefined}
                  onClick={() => toggleExp(rid)}
                />
              </td>
            ) : null}
            {selectable ? (
              <td className="co-td-x">
                <input
                  type="checkbox"
                  className="co-box"
                  checked={on}
                  aria-label={`Select ${name}`}
                  onChange={() => toggleSel(rid)}
                />
              </td>
            ) : null}
            {columns.map((c) => (
              <td key={c.key} className={c.align === 'right' ? 'co-num' : undefined}>
                {c.render ? c.render(r) : toNode(field(r, c.key))}
              </td>
            ))}
            {rowMenu ? (
              <td className="co-td-x">
                <KebabMenu items={rowMenu(r)} label={`Actions for ${name}`} />
              </td>
            ) : null}
          </tr>
          {open && renderExpanded ? (
            <tr className="co-tr-x" id={xId}>
              <td colSpan={ncol}>{renderExpanded(r)}</td>
            </tr>
          ) : null}
        </Fragment>
      );
    });
  }

  return (
    <div className={cx('co-dt', className)} id={id} {...rest}>
      {toolbar || bulkOn ? (
        <div className="co-dt-bar">
          {bulkOn ? (
            <div className="co-row co-gap-8 co-bulk" role="region" aria-label="Bulk actions">
              <b>{sel.length} selected</b>
              {bulkActions?.(sel)}
              <Button variant="link" onClick={() => setSel([])}>
                Clear selection
              </Button>
            </div>
          ) : (
            toolbar
          )}
        </div>
      ) : null}
      <div className="co-tbx">
        <table className="co-table" aria-busy={loading || undefined}>
          {caption ? <caption className="co-sr">{caption}</caption> : null}
          <thead>
            <tr>
              {renderExpanded ? (
                <th className="co-td-x" scope="col">
                  <span className="co-sr">Expand</span>
                </th>
              ) : null}
              {selectable ? (
                <th className="co-td-x" scope="col">
                  <input
                    type="checkbox"
                    className="co-box"
                    aria-label="Select all on this page"
                    checked={allOn}
                    disabled={loading || pageIds.length === 0}
                    ref={(el) => {
                      if (el) el.indeterminate = someOn && !allOn;
                    }}
                    onChange={toggleAll}
                  />
                </th>
              ) : null}
              {columns.map((c) => {
                const on = currentSort?.key === c.key;
                const dir = on ? currentSort?.dir : undefined;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    className={cx(c.align === 'right' && 'co-num', !c.sortable && 'co-th-plain')}
                    aria-sort={on ? (dir === 'desc' ? 'descending' : 'ascending') : c.sortable ? 'none' : undefined}
                  >
                    {c.sortable ? (
                      <button type="button" className="co-th" onClick={() => onSortClick(c.key)}>
                        {c.label}
                        <Icon name={on ? (dir === 'desc' ? 'sort-down' : 'sort-up') : 'sort'} size={12} />
                      </button>
                    ) : (
                      c.label
                    )}
                  </th>
                );
              })}
              {rowMenu ? (
                <th className="co-td-x" scope="col">
                  <span className="co-sr">Actions</span>
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>{body}</tbody>
        </table>
      </div>
      {!pagination || loading ? null : (
        <Pagination
          total={rows.length}
          page={currentPage}
          pageSize={size}
          pageSizes={pageSizes}
          onPage={setPage}
          onPageSize={setPs}
          label={caption ? `${caption} pagination` : 'Pagination'}
        />
      )}
    </div>
  );
}
