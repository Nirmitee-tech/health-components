import { forwardRef, useRef, type HTMLAttributes, type KeyboardEvent } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';
import { themeIds, type ThemeId } from '../../tokens/tokens';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';

/** One practice style card. */
export interface StyleChooserOption {
  /** Style id; a CareOS theme id ('classic', 'sidebar', 'rail', 'command', 'dark') gets a live token swatch */
  id: string;
  /** Style name, e.g. "Clinical Sidebar" */
  name: string;
  /** Who it suits, shown after "Suits: " */
  who: string;
  /** Swatch colours; default the theme's own tokens (nav, primary, canvas, accent) when `id` is a theme id */
  swatch?: string[];
  /** The style the practice uses now: shows the "Practice setting" tag; default false */
  current?: boolean;
}

/** The five CareOS themes as StyleChooser options. */
export const careosStyleOptions: StyleChooserOption[] = [
  { id: 'classic', name: 'Classic', who: 'teams who already know CareOS.' },
  { id: 'sidebar', name: 'Clinical Sidebar', who: 'most teams.' },
  { id: 'rail', name: 'Focus Rail', who: 'providers juggling many charts.' },
  { id: 'command', name: 'Command Bar', who: 'power users and small practices.' },
  { id: 'dark', name: 'Dark', who: 'evening clinics and low-light reading rooms.' },
];

/** Tokens drawn in a theme swatch, resolved inside that theme. */
const SWATCH_TOKENS = ['var(--co-nav-bg)', 'var(--co-primary)', 'var(--co-canvas)', 'var(--co-accent)'];

const isThemeId = (id: string): id is ThemeId => (themeIds as readonly string[]).includes(id);

export interface StyleChooserProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Array<{id, name, who, swatch?, current?}>; default the five CareOS themes */
  styles?: StyleChooserOption[];
  /** Previewed style id (controlled); default undefined */
  value?: string;
  /** Initially previewed style id (uncontrolled); default 'classic' */
  defaultValue?: string;
  /** Called with the style id when Preview is chosen; default none */
  onChange?: (id: string) => void;
  /** Enables "Apply to practice" (admins only); default false */
  canApply?: boolean;
  /** Called with the style id when "Apply to practice" is chosen; default none */
  onApply?: (id: string) => void;
  /** Accessible name of the radio group; default "App style" */
  label?: string;
}

/**
 * StyleChooser picks the practice style (Classic, Clinical Sidebar, Focus Rail, Command Bar, Dark) with Preview and Apply to practice.
 * The Preview buttons are a radio group: Arrow keys move and select, Home and End jump to the ends.
 */
export const StyleChooser = forwardRef<HTMLDivElement, StyleChooserProps>(function StyleChooser(
  {
    styles = careosStyleOptions,
    value,
    defaultValue = 'classic',
    onChange,
    canApply = false,
    onApply,
    label = 'App style',
    className,
    id,
    ...rest
  },
  ref
) {
  const baseId = useDomId('co-stc', id);
  const [current, setCurrent] = useControllableState(value, defaultValue, onChange);
  const refs = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);
  const checked = styles.findIndex((s) => s.id === current);
  const stop = checked >= 0 ? checked : 0;

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const from = refs.current.findIndex((r) => r === e.target);
    if (from < 0 || styles.length === 0) return;
    const n = styles.length;
    let to: number;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = (from + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = (from - 1 + n) % n;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = n - 1;
    else return;
    e.preventDefault();
    refs.current[to]?.focus();
    setCurrent(styles[to]!.id);
  };

  return (
    <div
      ref={ref}
      id={id}
      className={cx('co-kpis', className)}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {styles.map((s, i) => {
        const on = current === s.id;
        const nameId = `${baseId}-${i}-name`;
        const previewId = `${baseId}-${i}-preview`;
        const themed = !s.swatch && isThemeId(s.id);
        return (
          <div key={s.id} className={cx('co-kpi', on && 'is-on')}>
            <div className="co-row co-gap-6">
              <b id={nameId}>{s.name}</b>
              {s.current ? (
                <Badge tone="info" size="sm">
                  Practice setting
                </Badge>
              ) : null}
            </div>
            <div className="co-stc-sw" data-co-theme={themed ? s.id : undefined} aria-hidden="true">
              {(s.swatch ?? (themed ? SWATCH_TOKENS : [])).map((c, j) => (
                <i key={j} style={{ background: c }} />
              ))}
            </div>
            <span className="co-mi-s">Suits: {s.who}</span>
            <div className="co-row co-gap-6">
              <Button
                ref={(el) => {
                  refs.current[i] = el;
                }}
                id={previewId}
                size="sm"
                role="radio"
                aria-checked={on}
                aria-labelledby={`${previewId} ${nameId}`}
                tabIndex={i === stop ? 0 : -1}
                onClick={() => setCurrent(s.id)}
              >
                Preview
              </Button>
              <Button
                size="sm"
                variant="primary"
                disabled={!canApply}
                aria-describedby={nameId}
                onClick={() => onApply?.(s.id)}
              >
                Apply to practice
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
});
