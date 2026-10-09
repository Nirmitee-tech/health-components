import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Button } from '../Button/Button';
import { MobileHeader } from '../MobileHeader/MobileHeader';
import { Stepper } from '../Stepper/Stepper';

export interface KioskStepProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Current step, 1-based. Required */
  step: number;
  /** Number of steps. Required */
  total: number;
  /** Short step name in the header ("Find appointment"). Required */
  stepName: string;
  /** Big heading (h1) of the step. Required */
  title: string;
  /** Instruction under the heading; default none */
  subtitle?: ReactNode;
  /** Practice name in the header; default "Valley Family Clinic" */
  practice?: string;
  /** Label of the main button; default "Continue" */
  nextLabel?: string;
  /** Disables the main button until required fields are filled; default false */
  nextDisabled?: boolean;
  /** Back button (shown from step 2); default none */
  onBack?: () => void;
  /** Main button; default none */
  onNext?: () => void;
  /** "I need help" in the header; default none */
  onHelp?: () => void;
  /** Fields of the step. */
  children?: ReactNode;
}

/** KioskStep is one step of front-desk tablet check-in: kiosk header with Help, step segments, big title, content and large Back and Continue buttons. */
export const KioskStep = forwardRef<HTMLDivElement, KioskStepProps>(function KioskStep(
  {
    step,
    total,
    stepName,
    title,
    subtitle,
    practice = 'Valley Family Clinic',
    nextLabel = 'Continue',
    nextDisabled = false,
    onBack,
    onNext,
    onHelp,
    children,
    className,
    ...rest
  },
  ref
) {
  return (
    <div ref={ref} className={cx('co-kiosk', className)} {...rest}>
      <MobileHeader
        variant="kiosk"
        title={practice}
        subtitle={`Step ${step} of ${total} . ${stepName}`}
        action={
          <Button size="sm" onClick={onHelp}>
            I need help
          </Button>
        }
      />
      <div className="co-kbody">
        <Stepper variant="segments" count={total} current={step - 1} label="Check-in progress" />
        <h1 className="co-kh">{title}</h1>
        {subtitle ? <div className="co-muted">{subtitle}</div> : null}
        {children}
        <div className="co-row co-gap-8" style={{ marginTop: 'auto' }}>
          {step > 1 ? (
            <Button size="lg" iconLeft="chevron-left" onClick={onBack}>
              Back
            </Button>
          ) : null}
          <div className="co-ml">
            <Button size="lg" variant="primary" onClick={onNext} disabled={nextDisabled}>
              {nextLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
