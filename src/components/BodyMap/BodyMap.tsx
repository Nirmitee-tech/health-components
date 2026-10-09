import { forwardRef, useState, type HTMLAttributes } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { V } from '../../internal/specialty';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { EmptyState } from '../EmptyState/EmptyState';
import { Icon } from '../Icon/Icon';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';

/** Which outline a mark sits on. */
export type BodyMapView = 'front' | 'back';
/** Status of a lesion: pin colour and tag. */
export type BodyMapMarkType = 'monitor' | 'new' | 'biopsy' | 'treated';

/** A dated photo of a lesion; no `src` shows a camera placeholder. */
export interface BodyMapPhoto {
  src?: string;
  /** Date the photo was taken; required */
  date: string;
}

/** One numbered mark on the body outline. */
export interface BodyMapMark {
  /** Horizontal position in the 200 by 262 frame */
  x: number;
  /** Vertical position in the 200 by 262 frame */
  y: number;
  /** Outline the mark is on; default 'front' */
  view?: BodyMapView;
  /** Number shown on the pin; default its position in `marks` plus 1 */
  n?: number;
  /** Body site ("Left upper chest") */
  site: string;
  /** [length, width] in mm */
  size?: readonly [number, number?] | readonly number[];
  /** Earlier length in mm */
  prevSize?: number;
  /** Date of the earlier size */
  prevDate?: string;
  /** Status; default 'monitor' ('biopsy' when the legacy `concern` is true) */
  type?: BodyMapMarkType;
  /** Description ("Irregular border, two colors") */
  desc?: string;
  /** Dated photos */
  photos?: ReadonlyArray<BodyMapPhoto>;
  /** Legacy: red pin and Biopsy tag; use `type: 'biopsy'` */
  concern?: boolean;
}

export interface BodyMapProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Marks in a 200 by 262 frame; default [] */
  marks?: ReadonlyArray<BodyMapMark>;
  /** First view shown (uncontrolled); default 'front' */
  view?: BodyMapView;
  /** Shown view (controlled); default uncontrolled */
  currentView?: BodyMapView;
  /** Called when the view changes; default none */
  onViewChange?: (view: BodyMapView) => void;
  /** Called with the mark number when a pin is clicked; default none */
  onMarkSelect?: (n: number) => void;
  /** Card title; default 'Body map' */
  title?: string;
  /** Line under the title (patient and date); default none */
  subtitle?: string;
  /** Hides Add Photo; default false */
  readOnly?: boolean;
  /** Add Photo action; default none */
  onAddPhoto?: () => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

const LTYPE: Record<BodyMapMarkType, { tone: BadgeTone; label: string }> = {
  monitor: { tone: 'neutral', label: 'Monitor' },
  biopsy: { tone: 'danger', label: 'Biopsy' },
  treated: { tone: 'success', label: 'Treated' },
  new: { tone: 'warning', label: 'New' },
};

function Figure({ view }: { view: BodyMapView }) {
  return (
    <g fill="var(--co-surface-muted)" stroke="var(--co-border-strong)" strokeWidth={1.5}>
      <circle cx={100} cy={30} r={20} />
      <rect x={92} y={48} width={16} height={10} />
      <rect x={70} y={56} width={60} height={100} rx={18} />
      <rect x={44} y={60} width={20} height={92} rx={10} />
      <rect x={136} y={60} width={20} height={92} rx={10} />
      <rect x={74} y={150} width={22} height={104} rx={10} />
      <rect x={104} y={150} width={22} height={104} rx={10} />
      {view === 'back' ? (
        <path d="M100 60V150" strokeDasharray="3 3" />
      ) : (
        <path d="M90 26h.01M110 26h.01M94 38q6 4 12 0" fill="none" />
      )}
    </g>
  );
}

function Thumb({ src, alt, date }: { src?: string; alt: string; date: string }) {
  return (
    <figure className="co-thumb">
      {src ? (
        <img className="co-thumb-i" src={src} alt={alt} />
      ) : (
        <div className="co-thumb-i co-thumb-ph" role="img" aria-label={alt}>
          <Icon name="camera" size={18} />
        </div>
      )}
      <figcaption>{date}</figcaption>
    </figure>
  );
}

type NumberedMark = BodyMapMark & { n: number; view: BodyMapView; type: BodyMapMarkType };

const EMPTY: ReadonlyArray<BodyMapMark> = [];

/**
 * BodyMap marks numbered lesions on front and back body outlines, with size in millimetres, change since last visit,
 * status and dated photos for each one.
 */
export const BodyMap = forwardRef<HTMLElement, BodyMapProps>(function BodyMap(
  {
    marks: marksProp = EMPTY,
    view: initialView = 'front',
    currentView,
    onViewChange,
    onMarkSelect,
    title = 'Body map',
    subtitle,
    readOnly = false,
    onAddPhoto,
    rangeContext,
    className,
    ...rest
  },
  ref
) {
  const marks: NumberedMark[] = marksProp.map((m, i) => ({
    n: i + 1,
    ...m,
    view: m.view || 'front',
    type: m.type || (m.concern ? 'biopsy' : 'monitor'),
  }));
  const [view, setView] = useControllableState<BodyMapView>(currentView, initialView, onViewChange);
  const [cur, setCur] = useState<number | null>(null);
  const shown = marks.filter((m) => m.view === view);
  const cnt = (v: BodyMapView) => marks.filter((m) => m.view === v).length;
  const select = (n: number) => {
    setCur(n);
    onMarkSelect?.(n);
  };
  return (
    <RangeContextProvider value={rangeContext}>
      <Card
        ref={ref}
        className={cx('co-bodymap', className)}
        title={title}
        subtitle={subtitle}
        actions={
          readOnly ? null : (
            <Button size="sm" iconLeft="camera" onClick={onAddPhoto}>
              Add Photo
            </Button>
          )
        }
        {...rest}
      >
        <SegmentedControl
          size="sm"
          label="View"
          value={view}
          onChange={(v) => setView(v as BodyMapView)}
          options={[
            { value: 'front', label: 'Front', count: cnt('front') },
            { value: 'back', label: 'Back', count: cnt('back') },
          ]}
        />
        <div className="co-row co-bodymap-row">
          <svg
            viewBox="0 0 200 262"
            width={180}
            height={236}
            role="img"
            aria-label={
              (view === 'back' ? 'Back' : 'Front') +
              ' view with ' +
              shown.length +
              ' marked lesions. Patient left is on the ' +
              (view === 'back' ? 'left' : 'right') +
              ' of the drawing.'
            }
          >
            <Figure view={view} />
            <text x={6} y={258} className="co-bodymap-lr">
              {view === 'back' ? 'L' : 'R'}
            </text>
            <text x={188} y={258} className="co-bodymap-lr">
              {view === 'back' ? 'R' : 'L'}
            </text>
            {shown.map((m) => (
              // Mouse shortcut only: the list beside the drawing repeats every mark in text, so nothing is lost without it.
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <g key={m.n} className="co-bodymap-pin" onClick={() => select(m.n)}>
                {cur === m.n ? <circle cx={m.x} cy={m.y} r={12} fill="none" stroke="var(--co-ink)" strokeWidth={2} /> : null}
                <circle
                  cx={m.x}
                  cy={m.y}
                  r={8}
                  fill={
                    m.type === 'biopsy' ? 'var(--co-danger)' : m.type === 'new' ? 'var(--co-warning-strong)' : 'var(--co-primary)'
                  }
                  stroke="var(--co-surface)"
                  strokeWidth={2}
                />
                <text x={m.x} y={m.y + 3.5} textAnchor="middle" className="co-bodymap-pin-t">
                  {m.n}
                </text>
              </g>
            ))}
          </svg>
          <ol className="co-list co-bodymap-list">
            {shown.length ? (
              shown.map((m) => {
                const t = LTYPE[m.type] || LTYPE.monitor;
                return (
                  <li key={m.n} className={cx('co-li co-bodymap-li', cur === m.n && 'is-on')}>
                    <span className={cx('co-pin-n', m.type === 'biopsy' && 'is-bad')} aria-hidden="true">
                      {m.n}
                    </span>
                    <div className="co-li-b">
                      <b>{m.site}</b>
                      <span className="co-mi-s">
                        <span>Size </span>
                        <V k="mm" v={m.size && m.size[0]} />
                        {m.size && m.size[1] != null ? (
                          <>
                            {' × '}
                            <V k="mm" v={m.size[1]} />
                          </>
                        ) : null}
                      </span>
                      {m.prevSize ? (
                        <span className="co-mi-s">
                          Was <V k="mm" v={m.prevSize} />
                          {' on ' + m.prevDate}
                        </span>
                      ) : null}
                      <span className="co-mi-s">{m.desc}</span>
                    </div>
                    <Badge tone={t.tone}>{t.label}</Badge>
                    {m.photos && m.photos.length ? (
                      <div className="co-row co-gap-6 co-bodymap-photos">
                        {m.photos.map((ph, j) => (
                          <Thumb key={j} src={ph.src} date={ph.date} alt={'Photo of lesion ' + m.n + ', ' + m.site + ', ' + ph.date} />
                        ))}
                      </div>
                    ) : (
                      <span className="co-mi-s co-bodymap-photos">No photos yet</span>
                    )}
                  </li>
                );
              })
            ) : (
              <li>
                <EmptyState compact title={'No lesions marked on the ' + view} />
              </li>
            )}
          </ol>
        </div>
      </Card>
    </RangeContextProvider>
  );
});
