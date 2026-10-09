import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import type { IconName } from '../Icon/Icon';

export type DoseStatus = 'given' | 'due' | 'overdue' | 'declined' | 'future';

/** How each dose status is shown. */
export const doseStatuses: Record<DoseStatus, { tone: BadgeTone; icon?: IconName; label: string }> = {
  given: { tone: 'success', icon: 'check', label: 'Given' },
  due: { tone: 'info', icon: 'clock', label: 'Due' },
  overdue: { tone: 'danger', icon: 'alert', label: 'Overdue' },
  declined: { tone: 'neutral', icon: 'x', label: 'Declined' },
  future: { tone: 'outline', label: 'Later' },
};

/** One cell of the grid. An empty object is an empty cell (no dose at that age). */
export interface ImmunizationDose {
  /** 'given' | 'due' | 'overdue' | 'declined' | 'future'; default none (empty cell) */
  status?: DoseStatus;
  /** Date given, shown instead of the status word; default none */
  date?: string;
}

/** One vaccine row. */
export interface ImmunizationRow {
  /** Vaccine name ("DTaP"); required */
  vaccine: string;
  /** One entry per column; required */
  doses: ImmunizationDose[];
}

export interface ImmunizationScheduleProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** string[]: dose ages ("Birth", "2 mo"...); required */
  columns: string[];
  /** Array<{vaccine, doses: Array<{status?, date?}>}>; required */
  rows: ImmunizationRow[];
  /** Registry sync time, in the default subtitle; default "today" */
  synced?: string;
  /** Replaces the subtitle; default "CDC schedule . IIS synced {synced}" */
  subtitle?: ReactNode;
  /** Hides Record Dose; default false */
  readOnly?: boolean;
  /** Record Dose clicked; default none */
  onRecordDose?: () => void;
}

/**
 * ImmunizationSchedule is the vaccine grid by dose with Given, Due, Overdue, Declined and Later states,
 * synced with the state registry.
 */
export const ImmunizationSchedule = forwardRef<HTMLElement, ImmunizationScheduleProps>(function ImmunizationSchedule(
  { columns, rows, synced = 'today', subtitle, readOnly = false, onRecordDose, ...rest },
  ref
) {
  return (
    <Card
      ref={ref}
      title="Immunizations"
      subtitle={subtitle ?? `CDC schedule . IIS synced ${synced}`}
      actions={
        readOnly ? null : (
          <Button size="sm" variant="primary" iconLeft="plus" onClick={onRecordDose}>
            Record Dose
          </Button>
        )
      }
      {...rest}
    >
      <div className="co-tbx">
        <table className="co-table">
          <caption className="co-sr">Immunization schedule</caption>
          <thead>
            <tr>
              <th scope="col" className="co-th-plain">
                Vaccine
              </th>
              {columns.map((c) => (
                <th key={c} scope="col" className="co-th-plain">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.vaccine}>
                <th scope="row" className="co-th-plain co-imm-v">
                  {r.vaccine}
                </th>
                {columns.map((c, i) => {
                  const d = r.doses[i];
                  const s = d?.status ? (doseStatuses[d.status] ?? doseStatuses.future) : undefined;
                  return (
                    <td key={c}>
                      {d?.status && s ? (
                        <Badge tone={s.tone} icon={s.icon} size="sm">
                          {d.date ? (
                            <>
                              <span className="co-sr">{`${s.label} `}</span>
                              {d.date}
                            </>
                          ) : (
                            s.label
                          )}
                        </Badge>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
});
