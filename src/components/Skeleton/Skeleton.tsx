import { forwardRef, type CSSProperties, type HTMLAttributes, type Ref } from 'react';
import { cx } from '../../internal/cx';

export type SkeletonVariant = 'text' | 'row' | 'card' | 'avatar';

export interface SkeletonProps extends HTMLAttributes<HTMLElement> {
  /** 'text' | 'row' | 'card' | 'avatar'; default 'text' */
  variant?: SkeletonVariant;
  /** Text lines (variant text); the last line is shorter; default 1 */
  lines?: number;
  /** Table rows (variant row); default 3 */
  rows?: number;
  /** CSS width of text lines; default '100%' */
  width?: CSSProperties['width'];
  /** Accessible name (aria-label); default "Loading" ("Loading rows" for variant row) */
  label?: string;
}

/** Skeleton shows grey placeholder shapes while content loads. The pulse stops under prefers-reduced-motion. */
export const Skeleton = forwardRef<HTMLElement, SkeletonProps>(function Skeleton(
  { variant = 'text', lines = 1, rows = 3, width, label, className, ...rest },
  ref
) {
  if (variant === 'avatar') {
    return (
      <span
        ref={ref as Ref<HTMLSpanElement>}
        className={cx('co-sk co-sk-c', className)}
        style={{ width: 40, height: 40 }}
        aria-hidden="true"
        {...rest}
      />
    );
  }
  const busy = { role: 'status', 'aria-busy': true, 'aria-label': label ?? (variant === 'row' ? 'Loading rows' : 'Loading') } as const;
  if (variant === 'row') {
    return (
      <div ref={ref as Ref<HTMLDivElement>} className={className} {...busy} {...rest}>
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="co-sk-row">
            <span className="co-sk co-sk-c" />
            <span className="co-sk" style={{ width: '28%' }} />
            <span className="co-sk" style={{ width: '18%' }} />
            <span className="co-sk" style={{ width: '22%' }} />
          </div>
        ))}
      </div>
    );
  }
  if (variant === 'card') {
    return (
      <div ref={ref as Ref<HTMLDivElement>} className={cx('co-card', className)} {...busy} {...rest}>
        <span className="co-sk" style={{ width: '40%', height: 16 }} />
        <span className="co-sk" style={{ width: '90%' }} />
        <span className="co-sk" style={{ width: '70%' }} />
      </div>
    );
  }
  return (
    <div ref={ref as Ref<HTMLDivElement>} className={cx('co-sk-lines', className)} {...busy} {...rest}>
      {Array.from({ length: Math.max(1, lines) }, (_, j) => (
        <span key={j} className="co-sk" style={{ width: lines > 1 && j === lines - 1 ? '60%' : (width ?? '100%') }} />
      ))}
    </div>
  );
});
