import { forwardRef, type HTMLAttributes, type MouseEvent } from 'react';
import { cx } from '../../internal/cx';
import { Alert } from '../Alert/Alert';
import { Button } from '../Button/Button';
import { EmptyState } from '../EmptyState/EmptyState';

export type PermissionStateKind = 'lock' | 'denied' | 'preview' | 'hidden';

export interface PermissionStateProps extends HTMLAttributes<HTMLDivElement> {
  /** 'lock' | 'denied' | 'preview' | 'hidden'; default 'lock' */
  kind?: PermissionStateKind;
  /** The viewer's role ("Biller", "Front Desk"). Required */
  role: string;
  /** Permission the role lacks; required for lock and denied; default "Manage claims" */
  permission?: string;
  /** Href of the staff home: "Back to staff app" (preview) and "Go to my home screen" (denied); default none */
  home?: string;
  /** "Go to my home screen" (denied) or "Back to staff app" (preview) clicked; default none */
  onHome?: (event: MouseEvent<HTMLElement>) => void;
  /** "Compare roles" clicked (denied); default none */
  onCompareRoles?: () => void;
}

/** PermissionState renders the four role-based states with the screens' exact wording: lock (view only), denied (no access), patient preview, and hidden. */
export const PermissionState = forwardRef<HTMLDivElement, PermissionStateProps>(function PermissionState(
  { kind = 'lock', role, permission = 'Manage claims', home, onHome, onCompareRoles, className, ...rest },
  ref
) {
  if (kind === 'denied') {
    return (
      <div ref={ref} className={cx('co-card', className)} {...rest}>
        <EmptyState
          kind="denied"
          title="You do not have access to this screen"
          actions={
            <>
              <Button variant="primary" href={home} onClick={onHome}>
                Go to my home screen
              </Button>
              <Button onClick={onCompareRoles}>Compare roles</Button>
            </>
          }
        >
          {`Your role (${role}) does not include the permission ${permission}. Ask your Practice Admin to change your role in Settings, Roles and Permissions, if you need it.`}
        </EmptyState>
      </div>
    );
  }
  if (kind === 'preview') {
    return (
      <Alert ref={ref} tone="lock" className={className} {...rest}>
        {`Your role (${role}) sees a read-only preview of what the patient sees. Patient actions (book, pay, send, sign) are blocked for staff. `}
        <a href={home ?? '#'} style={{ color: 'var(--co-link)' }} onClick={onHome}>
          Back to staff app
        </a>
      </Alert>
    );
  }
  if (kind === 'hidden') {
    return (
      <Alert ref={ref} tone="note" className={className} {...rest}>
        {`Hidden for ${role}: this control is not rendered at all (level None). Nothing to show here.`}
      </Alert>
    );
  }
  return (
    <Alert ref={ref} tone="lock" className={className} {...rest}>
      {`Your role (${role}) can view this screen but not edit it. Fields and save buttons are locked. Permission needed to edit: ${permission}.`}
    </Alert>
  );
});

export type PermissionDeniedProps = Omit<PermissionStateProps, 'kind'>;

/** PermissionDenied is PermissionState with kind="denied": the "You do not have access to this screen" block. */
export const PermissionDenied = forwardRef<HTMLDivElement, PermissionDeniedProps>(function PermissionDenied(props, ref) {
  return <PermissionState ref={ref} {...props} kind="denied" />;
});
