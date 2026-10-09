import { forwardRef, type HTMLAttributes } from 'react';
import { StatusTag } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Icon } from '../Icon/Icon';
import { Stepper } from '../Stepper/Stepper';

/** One check-in checklist line. */
export interface CheckInItem {
  /** What was checked, e.g. "Insurance" */
  label: string;
  /** Result or problem, e.g. "Aetna returned AAA 72: invalid member ID" */
  detail?: string;
  /** Done (check icon) or needs attention (alert icon) */
  ok: boolean;
  /** Fix button label, e.g. "Fix Coverage"; default none */
  action?: string;
}

/** The six default check-in steps. */
export const defaultCheckInSteps = ['Arrived', 'Demographics', 'Insurance', 'Forms', 'Copay', 'Ready'];

export interface CheckInStepperProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Patient name, shown in the title. Required */
  patient: string;
  /** Appointment line under the title. Required */
  appt: string;
  /** Step labels; default Arrived, Demographics, Insurance, Forms, Copay, Ready */
  steps?: string[];
  /** Current step, 0-based; default 0 */
  current?: number;
  /** Indexes of steps with issues (they show the error state and block Complete Check-In); default [] */
  issues?: number[];
  /** Checklist lines; default [] */
  items?: CheckInItem[];
  /** Check-in complete: the tag reads Checked In instead of Arrived; default false */
  done?: boolean;
  /** Called with the item and its index when its action button is pressed; default none */
  onItemAction?: (item: CheckInItem, index: number) => void;
  /** Called when Complete Check-In is pressed (enabled only with no issues); default none */
  onComplete?: () => void;
}

const NONE: number[] = [];
const NO_ITEMS: CheckInItem[] = [];

/** CheckInStepper is the front desk check-in checklist: steps, issues per step and Complete Check-In. */
export const CheckInStepper = forwardRef<HTMLElement, CheckInStepperProps>(function CheckInStepper(
  {
    patient,
    appt,
    steps = defaultCheckInSteps,
    current = 0,
    issues = NONE,
    items = NO_ITEMS,
    done = false,
    onItemAction,
    onComplete,
    className,
    ...rest
  },
  ref
) {
  return (
    <Card
      ref={ref}
      className={className}
      title={`Check-in: ${patient}`}
      subtitle={appt}
      actions={<StatusTag kind="appointment" status={done ? 'Checked In' : 'Arrived'} />}
      footer={
        <Button variant="primary" disabled={issues.length > 0} onClick={onComplete}>
          Complete Check-In
        </Button>
      }
      {...rest}
    >
      <Stepper
        label="Check-in steps"
        steps={steps.map((s, i) => ({ label: s, error: issues.includes(i) }))}
        current={current}
      />
      {items.map((it, i) => (
        <div key={i} className="co-li">
          <Icon name={it.ok ? 'check' : 'alert'} size={16} label={it.ok ? 'Done' : 'Needs attention'} />
          <div className="co-li-b">
            <b>{it.label}</b>
            {it.detail ? <span className="co-mi-s">{it.detail}</span> : null}
          </div>
          {it.action ? (
            <Button size="sm" onClick={() => onItemAction?.(it, i)}>
              {it.action}
            </Button>
          ) : null}
        </div>
      ))}
    </Card>
  );
});
