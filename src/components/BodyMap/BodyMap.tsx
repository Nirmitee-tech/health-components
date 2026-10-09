import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { Badge } from '../Badge/Badge';
import { Card } from '../Card/Card';

/** One numbered mark on the body outline. */
export interface BodyMapMark {
  /** Horizontal position in the 200 by 260 frame */
  x: number;
  /** Vertical position in the 200 by 260 frame */
  y: number;
  /** Body site ("Left upper chest") */
  site: string;
  /** Description ("6 mm, irregular border, two colors") */
  desc: string;
  /** Red pin and Biopsy tag instead of Monitor; default false */
  concern?: boolean;
}

export interface BodyMapProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Array<{x, y, site, desc, concern?}> in a 200 by 260 frame; default [] */
  marks?: BodyMapMark[];
  /** Card title; default "Body map" */
  title?: string;
  /** Line under the title (patient and date); default none */
  subtitle?: string;
}

const EMPTY: BodyMapMark[] = [];

/** BodyMap marks numbered lesions on a body outline with a matching list, for dermatology and wound care. */
export const BodyMap = forwardRef<HTMLElement, BodyMapProps>(function BodyMap(
  { marks = EMPTY, title = 'Body map', subtitle, className, ...rest },
  ref
) {
  const n = marks.length;
  return (
    <Card ref={ref} title={title} subtitle={subtitle} className={cx('co-bodymap', className)} {...rest}>
      <div className="co-row co-bodymap-row">
        <svg
          viewBox="0 0 200 260"
          width={180}
          height={234}
          role="img"
          aria-label={`Body map with ${n} marked ${n === 1 ? 'lesion' : 'lesions'}`}
        >
          <g fill="var(--co-surface-muted)" stroke="var(--co-border-strong)" strokeWidth={1.5}>
            <circle cx={100} cy={30} r={20} />
            <rect x={72} y={54} width={56} height={100} rx={18} />
            <rect x={46} y={58} width={20} height={90} rx={10} />
            <rect x={134} y={58} width={20} height={90} rx={10} />
            <rect x={76} y={150} width={20} height={100} rx={10} />
            <rect x={104} y={150} width={20} height={100} rx={10} />
          </g>
          {marks.map((m, i) => (
            <g key={i}>
              <circle
                cx={m.x}
                cy={m.y}
                r={8}
                fill={m.concern ? 'var(--co-danger)' : 'var(--co-primary)'}
                stroke="var(--co-surface)"
                strokeWidth={2}
              />
              <text
                x={m.x}
                y={m.y + 3.5}
                textAnchor="middle"
                style={{ font: '700 9px var(--co-font-sans)', fill: m.concern ? 'var(--co-on-status)' : 'var(--co-primary-ink)' }}
              >
                {i + 1}
              </text>
            </g>
          ))}
        </svg>
        <ol className="co-list co-bodymap-list">
          {marks.map((m, i) => (
            <li key={i} className="co-li">
              <span className={cx('co-pin-n', m.concern && 'is-bad')} aria-hidden="true">
                {i + 1}
              </span>
              <div className="co-li-b">
                <b>{m.site}</b>
                <span className="co-mi-s">{m.desc}</span>
              </div>
              {m.concern ? <Badge tone="danger">Biopsy</Badge> : <Badge>Monitor</Badge>}
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
});
