import { forwardRef, type HTMLAttributes, type Ref } from 'react';
import { cx } from '../../internal/cx';
import { Icon } from '../Icon/Icon';

/** A step: a plain label or a label with an error flag. */
export type StepperStep = string | { label: string; error?: boolean };

export type StepperVariant = 'bar' | 'vertical' | 'segments';

export interface StepperProps extends HTMLAttributes<HTMLElement> {
  /** Steps in order; may be empty for `segments` with `count`. */
  steps?: StepperStep[];
  /** Current step, 0-based; default 0 */
  current?: number;
  /** 'bar' numbered horizontal | 'vertical' side panels | 'segments' thin bars (phones, kiosk); default 'bar' */
  variant?: StepperVariant;
  /** Number of segments when `steps` is empty; default 4 */
  count?: number;
  /** Accessible name; default "Steps" ("Progress" for segments) */
  label?: string;
}

type StepState = 'done' | 'on' | 'todo' | 'error';
const SR: Record<StepState, string> = { done: ' (done)', error: ' (has errors)', on: ' (current)', todo: '' };

/** Stepper shows progress through a multi-step flow, such as the 7-step Add Patient form, as a numbered bar, a vertical list or thin segments. */
export const Stepper = forwardRef<HTMLElement, StepperProps>(function Stepper(
  { steps = [], current = 0, variant = 'bar', count = 4, label, className, ...rest },
  ref
) {
  if (variant === 'segments') {
    const total = steps.length || count;
    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        className={cx('co-steps', className)}
        role="progressbar"
        aria-label={label ?? 'Progress'}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current + 1}
        aria-valuetext={`Step ${current + 1} of ${total}`}
        {...rest}
      >
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={i <= current ? 'is-on' : ''} />
        ))}
      </div>
    );
  }
  return (
    <ol
      ref={ref as Ref<HTMLOListElement>}
      className={cx('co-stp', variant === 'vertical' && 'co-stp-v', className)}
      aria-label={label ?? 'Steps'}
      {...rest}
    >
      {steps.map((s, i) => {
        const o = typeof s === 'string' ? { label: s, error: false } : s;
        const st: StepState = o.error ? 'error' : i < current ? 'done' : i === current ? 'on' : 'todo';
        return (
          <li key={i} className={`is-${st}`} aria-current={i === current ? 'step' : undefined}>
            <span className="co-stp-n" aria-hidden="true">
              {st === 'done' ? <Icon name="check" size={12} strokeWidth={3} /> : st === 'error' ? '!' : i + 1}
            </span>
            <span className="co-stp-l">
              {o.label}
              <span className="co-sr">{SR[st]}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
});
