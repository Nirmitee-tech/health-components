import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Alert } from "../Alert/Alert";
import { StatusTag } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import { Timeline, type TimelineItem } from "../Timeline/Timeline";

export interface UnitsMeterProps extends HTMLAttributes<HTMLDivElement> {
  /** Units used so far; required */
  used: number;
  /** Units approved; required */
  approved: number;
  /** Unit word ("visits"); default "units" */
  unit?: string;
  /** Visible label and accessible name; default "Units used" */
  label?: string;
  /** Helper text under the bar ("Valid 10/01/2026 to 12/31/2026"); default none */
  helper?: ReactNode;
}

/** UnitsMeter shows units used against units approved as a meter that turns amber at 75% and red at 90%. */
export const UnitsMeter = forwardRef<HTMLDivElement, UnitsMeterProps>(
  function UnitsMeter(
    { used, approved, unit = "units", label = "Units used", helper, ...rest },
    ref,
  ) {
    return (
      <ProgressBar
        ref={ref}
        label={label}
        value={used}
        max={approved}
        unit={unit}
        meter
        thresholds={[75, 90]}
        helper={helper}
        {...rest}
      />
    );
  },
);

/** The alert shown on a prior authorization. */
export interface PriorAuthAlert {
  /** Bold first line ("3 visits left") */
  title: ReactNode;
  /** Body text; default none */
  body?: ReactNode;
  /** Label of a button under the body ("Request Extension"); default none */
  action?: string;
  /** Runs when the action button is chosen; default none */
  onAction?: () => void;
}

export interface PriorAuthTimelineProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "title"
> {
  /** Authorization number ("PA-2026-11873"); default "Prior authorization" */
  authId?: string;
  /** Service and code ("Physical therapy 97110"); default none */
  service?: string;
  /** Payer name; default none */
  payer?: string;
  /** Patient name; default none */
  patient?: string;
  /** PA status word (see StatusTag kind 'pa'): 'Approved', 'Pended', 'Denied'...; required */
  status: string;
  /** Units used; default none */
  used?: number;
  /** Units approved; shows the UnitsMeter when set; default none */
  approved?: number;
  /** Unit word; default "units" */
  unit?: string;
  /** Validity dates ("10/01/2026 to 12/31/2026"); default none */
  expires?: string;
  /** Status history as Timeline items; default [] */
  events?: TimelineItem[];
  /** {title, body, action?, onAction?}; default none */
  alert?: PriorAuthAlert;
  /** 'warning' | 'error' | 'info'; default 'warning' */
  alertTone?: "warning" | "error" | "info";
}

/** PriorAuthTimeline shows a prior authorization: status, units used against approved (UnitsMeter), any alert and the status history. */
export function PriorAuthTimeline({
  authId,
  service,
  payer,
  patient,
  status,
  used = 0,
  approved,
  unit,
  expires,
  events = [],
  alert,
  alertTone = "warning",
  ...rest
}: PriorAuthTimelineProps) {
  return (
    <Card
      title={[authId || "Prior authorization", service]
        .filter(Boolean)
        .join(" . ")}
      subtitle={[payer, patient].filter(Boolean).join(" . ") || undefined}
      actions={<StatusTag kind="pa" status={status} />}
      {...rest}
    >
      {approved ? (
        <UnitsMeter
          used={used}
          approved={approved}
          unit={unit}
          helper={expires ? `Valid ${expires}` : undefined}
        />
      ) : null}
      {alert ? (
        <Alert
          tone={alertTone}
          title={alert.title}
          actions={
            alert.action ? (
              <Button size="sm" onClick={alert.onAction}>
                {alert.action}
              </Button>
            ) : null
          }
        >
          {alert.body}
        </Alert>
      ) : null}
      <Timeline items={events} />
    </Card>
  );
}
