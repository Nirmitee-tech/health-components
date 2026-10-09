import { useRef, type HTMLAttributes, type ReactNode } from "react";
import { useControllableState } from "../../internal/hooks";
import { Alert } from "../Alert/Alert";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";
import { Stepper } from "../Stepper/Stepper";

/** One step of the form. */
export interface StepperFormStep {
  /** Step name in the bar and on the Next button ("Insurance") */
  label: string;
  /** Fields of the step; default none */
  content?: ReactNode;
  /** Marks the step in error in the bar; default false */
  error?: boolean;
}

export interface StepperFormProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "title"
> {
  /** Card title and accessible name of the step bar ("Add Patient"); required */
  title: string;
  /** Array<{label, content: node, error?}>; required */
  steps: StepperFormStep[];
  /** Current step, 0-based (controlled); default uncontrolled */
  current?: number;
  /** Initial step, 0-based (uncontrolled); default 0 */
  defaultCurrent?: number;
  /** Label of the finish button on the last step; default "Save" */
  finishLabel?: string;
  /** Error summary shown in an Alert above the fields; default none */
  errorSummary?: ReactNode;
  /** Finish button shows a spinner; default false */
  saving?: boolean;
  /** Called with the new step index on Next and Back; default none */
  onStep?: (index: number) => void;
  /** Finish button on the last step; default none */
  onFinish?: () => void;
  /** Cancel button; default none */
  onCancel?: () => void;
  /** Shows a Save Draft button that calls this; default none */
  onSaveDraft?: () => void;
}

/** StepperForm runs a multi-step form such as the 7-step Add Patient, with the step bar, an error summary and Back, Next and Save buttons. */
export function StepperForm({
  title,
  steps,
  current,
  defaultCurrent = 0,
  finishLabel = "Save",
  errorSummary,
  saving = false,
  onStep,
  onFinish,
  onCancel,
  onSaveDraft,
  className,
  ...rest
}: StepperFormProps) {
  const [rawCur, setCur] = useControllableState(
    current,
    defaultCurrent,
    onStep,
  );
  const bodyRef = useRef<HTMLDivElement>(null);
  const count = steps.length;
  const cur = Math.max(0, Math.min(rawCur, Math.max(count - 1, 0)));
  const last = cur >= count - 1;
  const step = steps[cur];
  const next = steps[cur + 1];
  const go = (i: number) => {
    setCur(i);
    // Move focus to the new step's fields so keyboard and screen reader users start at the top.
    bodyRef.current?.focus();
  };
  return (
    <Card
      title={title}
      subtitle={
        count ? `Step ${cur + 1} of ${count} . ${step?.label ?? ""}` : undefined
      }
      className={className}
      {...rest}
    >
      <Stepper
        steps={steps.map((x) => ({ label: x.label, error: x.error }))}
        current={cur}
        label={title}
      />
      {errorSummary ? (
        <Alert tone="error" title="Fix these before you continue">
          {errorSummary}
        </Alert>
      ) : null}
      <div
        className="co-stepbody"
        ref={bodyRef}
        tabIndex={-1}
        role="group"
        aria-label={step?.label}
      >
        {step?.content}
      </div>
      <div className="co-card-f" style={{ justifyContent: "space-between" }}>
        <Button variant="tertiary" onClick={onCancel}>
          Cancel
        </Button>
        <div className="co-row co-gap-8">
          {cur > 0 ? (
            <Button iconLeft="chevron-left" onClick={() => go(cur - 1)}>
              Back
            </Button>
          ) : null}
          {onSaveDraft ? (
            <Button onClick={onSaveDraft}>Save Draft</Button>
          ) : null}
          {last || !next ? (
            <Button variant="primary" onClick={onFinish} loading={saving}>
              {finishLabel}
            </Button>
          ) : (
            <Button
              variant="primary"
              iconRight="chevron-right"
              onClick={() => go(cur + 1)}
            >
              {`Next: ${next.label}`}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
