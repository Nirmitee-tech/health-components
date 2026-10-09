import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { StatusTag, type StatusKind } from '../Badge/Badge';
import { Icon } from '../Icon/Icon';

export type TimelineStatus = 'done' | 'current' | 'pending' | 'failed';

/** One step of a Timeline. */
export interface TimelineItem {
  /** Step title. */
  title: ReactNode;
  /** When it happened or is expected; default none */
  time?: string;
  /** Who did it; default none */
  by?: string;
  /** 'done' | 'current' | 'pending' | 'failed'; default 'done' */
  status?: TimelineStatus;
  /** Detail under the meta line; default none */
  body?: ReactNode;
  /** Status word shown as a StatusTag; default none */
  tag?: string;
  /** StatusTag kind for `tag`; default 'pa' */
  kind?: StatusKind;
  /** Stable React key; default the index */
  id?: string | number;
}

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  /** Steps in order. Required */
  items: ReadonlyArray<TimelineItem>;
}

/** Timeline lists the steps of a prior authorization, referral or claim in order, with done, current, pending and failed states. */
export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline({ items, className, ...rest }, ref) {
  return (
    <ol ref={ref} className={cx('co-tl', className)} {...rest}>
      {items.map((it, i) => {
        const st = it.status ?? 'done';
        const meta = [it.time, it.by].filter(Boolean).join(' . ');
        return (
          <li key={it.id ?? i} className={cx('co-tl-i', `co-tl-${st}`)} aria-current={st === 'current' ? 'step' : undefined}>
            <span className="co-tl-dot" aria-hidden="true">
              {st === 'done' ? (
                <Icon name="check" size={12} strokeWidth={3} />
              ) : st === 'failed' ? (
                <Icon name="x" size={12} strokeWidth={3} />
              ) : null}
            </span>
            <div className="co-tl-b">
              <div className="co-tl-t">
                <b>{it.title}</b>
                {it.tag ? <StatusTag kind={it.kind ?? 'pa'} status={it.tag} size="sm" /> : null}
              </div>
              {meta ? <div className="co-help">{meta}</div> : null}
              {it.body ? <div className="co-tl-body">{it.body}</div> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
});
