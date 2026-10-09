import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import type { RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';
import { withRangeProvider } from '../../internal/chartPanels';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';

export interface SplitterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onResize'> {
  /** Accessible name ('Resize chart sections'); required */
  label: string;
  /** Current size of the pane it controls, in px; required */
  value: number;
  /** Smallest size in px; required */
  min: number;
  /** Largest size in px; required */
  max: number;
  /** Which side the controlled pane is on: 'left' grows with ArrowRight, 'right' grows with ArrowLeft; default 'left' */
  side?: 'left' | 'right';
  /** Arrow key step in px (Shift multiplies by 3); default 16 */
  step?: number;
  /** Id of the pane it resizes (aria-controls); default none */
  controls?: string;
  /** Called with the new size, already clamped to min and max */
  onResize: (size: number) => void;
}

/**
 * Splitter is a vertical window splitter (WAI-ARIA window splitter pattern): a focusable separator with
 * aria-valuenow. Drag it, or focus it and use Left and Right (Shift for bigger steps), Home and End for the
 * minimum and maximum, and Enter to collapse the pane to its minimum and restore it.
 */
export function Splitter({ label, value, min, max, side = 'left', step = 16, controls, onResize, className, ...rest }: SplitterProps) {
  const drag = useRef<{ x: number; w: number } | null>(null);
  const restore = useRef<number | null>(null);
  const cleanup = useRef<(() => void) | null>(null);
  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  useEffect(() => () => cleanup.current?.(), []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    drag.current = { x: e.clientX, w: value };
    const move = (ev: PointerEvent) => {
      if (!drag.current) return;
      const d = (ev.clientX - drag.current.x) * (side === 'right' ? -1 : 1);
      onResize(clamp(drag.current.w + d));
    };
    const up = () => {
      drag.current = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      cleanup.current = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    cleanup.current = up;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const s = e.shiftKey ? step * 3 : step;
    let d = e.key === 'ArrowRight' ? s : e.key === 'ArrowLeft' ? -s : 0;
    if (side === 'right') d = -d;
    let next: number | null = null;
    if (d) next = clamp(value + d);
    else if (e.key === 'Home') next = min;
    else if (e.key === 'End') next = max;
    else if (e.key === 'Enter') {
      if (value > min) {
        restore.current = value;
        next = min;
      } else {
        next = clamp(restore.current ?? max);
        restore.current = null;
      }
    }
    if (next == null) return;
    e.preventDefault();
    if (next !== value) onResize(next);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- a focusable separator is a widget (APG window splitter): it takes focus, arrow keys and drag.
    <div
      role="separator"
      tabIndex={0}
      className={cx('cp-split', className)}
      aria-orientation="vertical"
      aria-label={label}
      aria-controls={controls}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={value + ' pixels'}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      {...rest}
    />
  );
}

export interface SplitPaneChartLayoutProps extends HTMLAttributes<HTMLDivElement> {
  /** Left pane: chart section navigation; default none */
  nav?: ReactNode;
  /** Middle pane: the note */
  children?: ReactNode;
  /** Right pane: context (results, CDS cards); default none */
  context?: ReactNode;
  /** Right pane title; default 'Context' */
  rightTitle?: string;
  /** Accessible name of the middle pane; default 'Note' */
  mainLabel?: string;
  /** Initial left pane width in px (160 to 360); default 220 */
  leftWidth?: number;
  /** Initial right pane width in px (240 to 520); default 300 */
  rightWidth?: number;
  /** Called with the left width after a resize; default none */
  onLeftWidthChange?: (width: number) => void;
  /** Called with the right width after a resize; default none */
  onRightWidthChange?: (width: number) => void;
  /** Left pane collapsed to a rail (controlled); default uncontrolled */
  leftCollapsed?: boolean;
  /** Left pane starts collapsed; default false */
  defaultLeftCollapsed?: boolean;
  /** Called when the left pane collapses or expands; default none */
  onLeftCollapsedChange?: (collapsed: boolean) => void;
  /** Right pane open (controlled); default uncontrolled */
  rightOpen?: boolean;
  /** Right pane starts open; default true */
  defaultRightOpen?: boolean;
  /** Called when the right pane opens or closes; default none */
  onRightOpenChange?: (open: boolean) => void;
  /** Layout height in px; default 420 */
  height?: number;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

const LEFT = { min: 160, max: 360 };
const RIGHT = { min: 240, max: 520 };

/**
 * SplitPaneChartLayout is the three-pane chart workspace: a resizable left section nav, the note in the middle and a
 * resizable right context panel that can close.
 */
export const SplitPaneChartLayout = forwardRef<HTMLDivElement, SplitPaneChartLayoutProps>(function SplitPaneChartLayout(
  {
    nav,
    children,
    context,
    rightTitle: rightTitleProp,
    mainLabel = 'Note',
    leftWidth = 220,
    rightWidth = 300,
    onLeftWidthChange,
    onRightWidthChange,
    leftCollapsed,
    defaultLeftCollapsed = false,
    onLeftCollapsedChange,
    rightOpen,
    defaultRightOpen = true,
    onRightOpenChange,
    height = 420,
    rangeContext,
    className,
    style,
    id,
    ...rest
  },
  ref
) {
  const base = useDomId('cp-layout', id);
  const [lw, setLw] = useState(() => Math.max(LEFT.min, Math.min(LEFT.max, leftWidth)));
  const [rw, setRw] = useState(() => Math.max(RIGHT.min, Math.min(RIGHT.max, rightWidth)));
  const [ro, setRo] = useControllableState(rightOpen, defaultRightOpen, onRightOpenChange);
  const [lc, setLc] = useControllableState(leftCollapsed, defaultLeftCollapsed, onLeftCollapsedChange);
  const rightTitle = rightTitleProp || 'Context';
  const navId = base + '-nav';
  const ctxId = base + '-ctx';

  return withRangeProvider(
    rangeContext,
    <div ref={ref} id={id} className={cx('cp-layout', className)} style={{ height, ...style }} {...rest}>
      {lc ? (
        <nav id={navId} className="cp-pane" aria-label="Chart sections" style={{ width: 44, padding: '8px 4px' }}>
          <IconButton icon="expand" label="Show chart sections" onClick={() => setLc(false)} />
        </nav>
      ) : (
        <nav id={navId} className="cp-pane" aria-label="Chart sections" style={{ width: lw, padding: 8 }}>
          <div className="co-row" style={{ justifyContent: 'flex-end' }}>
            <IconButton icon="collapse" size="sm" label="Hide chart sections" onClick={() => setLc(true)} />
          </div>
          {nav}
        </nav>
      )}
      {lc ? null : (
        <Splitter
          label="Resize chart sections"
          value={lw}
          min={LEFT.min}
          max={LEFT.max}
          controls={navId}
          onResize={(w) => {
            setLw(w);
            onLeftWidthChange?.(w);
          }}
        />
      )}
      <main className="cp-pane cp-pane-main" aria-label={mainLabel}>
        {children}
        {!ro ? (
          <div style={{ position: 'sticky', bottom: 0, textAlign: 'right' }}>
            <Button size="sm" iconLeft="chevron-left" onClick={() => setRo(true)}>
              {rightTitle}
            </Button>
          </div>
        ) : null}
      </main>
      {ro ? (
        <Splitter
          label="Resize context panel"
          side="right"
          value={rw}
          min={RIGHT.min}
          max={RIGHT.max}
          controls={ctxId}
          onResize={(w) => {
            setRw(w);
            onRightWidthChange?.(w);
          }}
        />
      ) : null}
      {ro ? (
        <aside id={ctxId} className="cp-pane" aria-label={rightTitle} style={{ width: rw, padding: 10 }}>
          <div className="co-row" style={{ justifyContent: 'space-between' }}>
            <b>{rightTitle}</b>
            <IconButton icon="x" size="sm" label={'Close ' + (rightTitleProp || 'context')} onClick={() => setRo(false)} />
          </div>
          {context}
        </aside>
      ) : null}
    </div>
  );
});
