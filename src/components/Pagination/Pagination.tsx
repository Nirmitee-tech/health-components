import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { Button } from '../Button/Button';

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  /** Total number of records. Required */
  total: number;
  /** Current page, 1-based (controlled) */
  page?: number;
  /** Initial page (uncontrolled); default 1 */
  defaultPage?: number;
  /** Rows per page (controlled) */
  pageSize?: number;
  /** Initial rows per page (uncontrolled); default 10 */
  defaultPageSize?: number;
  /** Rows-per-page choices, or false to hide the selector; default [5, 10, 25, 50] */
  pageSizes?: readonly number[] | false;
  /** Called with the new page; default none */
  onPage?: (page: number) => void;
  /** Called with the new rows per page (the page also resets to 1); default none */
  onPageSize?: (size: number) => void;
  /** Accessible name of the nav landmark; default "Pagination" */
  label?: string;
}

/** Pagination shows the record range and lets staff change rows per page and move between pages. */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    total,
    page,
    defaultPage = 1,
    pageSize,
    defaultPageSize = 10,
    pageSizes = [5, 10, 25, 50],
    onPage,
    onPageSize,
    label = 'Pagination',
    className,
    ...rest
  },
  ref
) {
  const [rawPage, setPage] = useControllableState(page, defaultPage, onPage);
  const [ps, setPs] = useControllableState(pageSize, defaultPageSize, onPageSize);
  const size = ps > 0 ? ps : 10;
  const count = Math.max(0, total || 0);
  const pc = Math.max(1, Math.ceil(count / size));
  const current = Math.min(Math.max(1, rawPage), pc);
  const from = count ? (current - 1) * size + 1 : 0;
  const to = Math.min(count, current * size);
  const sizes = pageSizes === false ? null : pageSizes.includes(size) ? pageSizes : [...pageSizes, size].sort((a, b) => a - b);

  return (
    <nav ref={ref} className={cx('co-pag', className)} aria-label={label} {...rest}>
      <span>{count ? `Showing ${from}-${to} of ${count}` : 'No records'}</span>
      <div className="co-row co-gap-6">
        {sizes ? (
          <label className="co-row co-gap-6">
            {'Rows per page '}
            <select
              className="co-inp co-inp-sm co-pag-sel"
              value={size}
              onChange={(e) => {
                setPs(Number(e.target.value));
                if (current !== 1) setPage(1);
              }}
            >
              {sizes.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <Button size="sm" disabled={current <= 1} onClick={() => setPage(current - 1)}>
          Previous
        </Button>
        <span aria-live="polite">{`Page ${current} of ${pc}`}</span>
        <Button size="sm" disabled={current >= pc} onClick={() => setPage(current + 1)}>
          Next
        </Button>
      </div>
    </nav>
  );
});
