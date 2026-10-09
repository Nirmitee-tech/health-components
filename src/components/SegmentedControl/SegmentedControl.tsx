import { forwardRef, useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';

/** One segment of a SegmentedControl. */
export interface SegmentedOption {
  /** Value reported by onChange. */
  value: string;
  /** Visible label. */
  label: ReactNode;
  /** Count shown after the label; default none */
  count?: number;
  /** Disables this segment; default false */
  disabled?: boolean;
}

export interface SegmentedControlProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'role'> {
  /** Two to five options: strings or `{value, label, count?, disabled?}`. Required */
  options: ReadonlyArray<string | SegmentedOption>;
  /** Selected value (controlled); default first option */
  value?: string;
  /** Initially selected value (uncontrolled); default first option */
  defaultValue?: string;
  /** 'sm' | 'md'; default 'md' */
  size?: 'sm' | 'md';
  /** Accessible name of the group (aria-label); default none */
  label?: string;
  /** Called with the newly selected value; default none */
  onChange?: (value: string) => void;
}

const norm = (o: string | SegmentedOption): SegmentedOption => (typeof o === 'string' ? { value: o, label: o } : o);

/**
 * SegmentedControl switches between two to five views or values in one compact bar.
 * It is a radiogroup: arrow keys, Home and End move the selection; Tab enters at the selected segment.
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(
  { options, value, defaultValue, size = 'md', label, onChange, className, onKeyDown, ...rest },
  ref
) {
  const opts = options.map(norm);
  const [current, setCurrent] = useControllableState(value, defaultValue ?? opts[0]?.value ?? '', onChange);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const enabled = opts.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
  const selectedIndex = opts.findIndex((o) => o.value === current);
  const tabStop = enabled.includes(selectedIndex) ? selectedIndex : (enabled[0] ?? -1);

  const select = (i: number) => {
    const o = opts[i];
    if (o && o.value !== current) setCurrent(o.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || enabled.length === 0) return;
    const from = buttons.current.findIndex((el) => el === e.target);
    if (from < 0) return;
    const pos = enabled.indexOf(from);
    let next: number | undefined;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = enabled[(pos + 1) % enabled.length];
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = enabled[(pos - 1 + enabled.length) % enabled.length];
    else if (e.key === 'Home') next = enabled[0];
    else if (e.key === 'End') next = enabled[enabled.length - 1];
    if (next === undefined) return;
    e.preventDefault();
    buttons.current[next]?.focus();
    select(next);
  };

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- radiogroup container: options carry a roving tabindex (APG radio group).
    <div
      ref={ref}
      className={cx('co-seg', size === 'sm' && 'co-seg-sm', className)}
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {opts.map((o, i) => {
        const on = current === o.value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            className={on ? 'is-on' : undefined}
            disabled={o.disabled}
            tabIndex={i === tabStop ? 0 : -1}
            onClick={() => select(i)}
          >
            {o.label}
            {o.count != null ? <span className="co-tabn">{o.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
});
