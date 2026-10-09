import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { Badge, type BadgeTone } from '../Badge/Badge';
import type { IconName } from '../Icon/Icon';

/** Audited action. */
export type AuditLogAction = 'view' | 'edit' | 'delete' | 'export' | 'btg' | 'login' | 'sign';

/** One audit entry. */
export interface AuditLogEvent {
  /** Timestamp text ("10/09 10:42:13") */
  time: string;
  /** 'view' | 'edit' | 'delete' | 'export' | 'btg' (break the glass) | 'login' | 'sign' */
  action: AuditLogAction;
  /** Who did it */
  user: string;
  /** Their role ("Provider") */
  role: string;
  /** What they did ("opened a restricted chart") */
  what: string;
  /** Patient affected; default none */
  patient?: string;
  /** Source IP; default none */
  ip?: string;
  /** Stated reason (required for break the glass); default none */
  reason?: string;
  /** Old and new value ("classic -> sidebar"); default none */
  change?: string;
}

export interface AuditLogRowProps extends HTMLAttributes<HTMLDivElement> {
  /** {time, action, user, role, what, patient?, ip?, reason?, change?}; required */
  event: AuditLogEvent;
}

const ACTIONS: Record<AuditLogAction, [IconName, BadgeTone]> = {
  view: ['eye', 'neutral'],
  edit: ['file', 'info'],
  delete: ['trash', 'danger'],
  export: ['download', 'warning'],
  btg: ['shield', 'danger'],
  login: ['user', 'neutral'],
  sign: ['check', 'success'],
};

const actionLabel = (a: string) =>
  a.toLowerCase() === 'btg' ? 'Break the glass' : a.charAt(0).toUpperCase() + a.slice(1);

/** AuditLogRow is one audit entry: time, action, user and role, what changed, patient, IP and reason, with old and new values. */
export const AuditLogRow = forwardRef<HTMLDivElement, AuditLogRowProps>(function AuditLogRow(
  { event: e, className, ...rest },
  ref
) {
  const [icon, tone] = ACTIONS[e.action] ?? ACTIONS.view;
  const meta = [e.patient ? `Patient ${e.patient}` : null, e.ip, e.reason ? `Reason: ${e.reason}` : null]
    .filter(Boolean)
    .join(' . ');
  return (
    <div ref={ref} className={cx('co-li', 'co-audit', className)} {...rest}>
      <span className="co-mi-s co-audit-t">{e.time}</span>
      <Badge tone={tone} icon={icon}>
        {actionLabel(e.action)}
      </Badge>
      <div className="co-li-b">
        <span>
          <b>{e.user}</b>
          {` (${e.role}) ${e.what}`}
        </span>
        {meta ? <span className="co-mi-s">{meta}</span> : null}
      </div>
      {e.change ? (
        <span className="co-code" title="Old and new value">
          <span className="co-sr">Old and new value: </span>
          {e.change}
        </span>
      ) : null}
    </div>
  );
});
