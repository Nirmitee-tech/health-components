import { forwardRef, useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';

/** One tab. */
export interface TabItem {
  /** Value reported by `onChange` */
  id: string;
  /** Tab label */
  label: ReactNode;
  /** Count after the label ("Needs Review 4"); default none */
  count?: number | string;
  /** Shows the count in red (overdue); default false */
  alert?: boolean;
  /** Not available (for example to this role); default false */
  disabled?: boolean;
  /** Id of the tabpanel this tab controls; sets aria-controls; default none */
  panelId?: string;
}

export type TabsVariant = 'line' | 'pill';

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** The tabs. Required. */
  items: TabItem[];
  /** Selected tab id (controlled); default uncontrolled */
  value?: string;
  /** Initially selected tab id; default the first tab */
  defaultValue?: string;
  /** 'line' under page or card titles, 'pill' inside cards and toolbars; default 'line' */
  variant?: TabsVariant;
  /** aria-label of the tablist; default none */
  label?: string;
  /** Called with the new tab id; default none */
  onChange?: (id: string) => void;
}

/**
 * Tabs switch between views of the same record or list: line tabs under a header, or pill tabs, both with optional counts.
 * Each tab's DOM id is `<id>-<item.id>` (pass `id` to choose the prefix), so panels can use aria-labelledby.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { items, value, defaultValue, variant = 'line', label, onChange, className, id, ...rest },
  ref
) {
  const base = useDomId('tabs', id);
  const [cur, setCur] = useControllableState(value, defaultValue ?? items[0]?.id ?? '', onChange);
  const btns = useRef<Record<string, HTMLButtonElement | null>>({});
  const pill = variant === 'pill';
  const enabled = items.filter((t) => !t.disabled);
  const focusId = enabled.some((t) => t.id === cur) ? cur : enabled[0]?.id;

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, t: TabItem) => {
    const i = enabled.findIndex((x) => x.id === t.id);
    if (i < 0 || enabled.length === 0) return;
    let next: TabItem | undefined;
    if (e.key === 'ArrowRight') next = enabled[(i + 1) % enabled.length];
    else if (e.key === 'ArrowLeft') next = enabled[(i - 1 + enabled.length) % enabled.length];
    else if (e.key === 'Home') next = enabled[0];
    else if (e.key === 'End') next = enabled[enabled.length - 1];
    if (!next) return;
    e.preventDefault();
    if (next.id !== cur) setCur(next.id);
    btns.current[next.id]?.focus();
  };

  return (
    <div
      ref={ref}
      id={id}
      className={cx(pill ? 'co-ptabs' : 'co-tabs', className)}
      role="tablist"
      aria-label={label}
      aria-orientation="horizontal"
      {...rest}
    >
      {items.map((t) => {
        const on = cur === t.id;
        return (
          <button
            key={t.id}
            ref={(el) => {
              btns.current[t.id] = el;
            }}
            id={`${base}-${t.id}`}
            type="button"
            role="tab"
            aria-selected={on}
            aria-controls={t.panelId}
            tabIndex={t.id === focusId ? 0 : -1}
            className={cx(pill ? 'co-ptab' : 'co-tab', on && 'is-on')}
            disabled={t.disabled}
            onClick={() => {
              if (t.id !== cur) setCur(t.id);
            }}
            onKeyDown={(e) => onKeyDown(e, t)}
          >
            {t.label}
            {t.count != null ? <span className={cx('co-tabn', t.alert && 'is-alert')}>{t.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
});
