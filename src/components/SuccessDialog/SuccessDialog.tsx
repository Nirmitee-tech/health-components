import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useDomId } from '../../internal/hooks';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Overlay, useOverlay } from '../Modal/Modal';

export interface SuccessDialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** "... Successfully" title, such as "Electronic Claim Submitted Successfully". Required. */
  title: string;
  /** Body: what happens next; default none */
  children?: ReactNode;
  /** Okay button label; default "Okay" */
  okayLabel?: string;
  /** Okay handler; default none */
  onOkay?: () => void;
  /** Secondary button label, such as "Add Another Patient"; default none */
  secondary?: string;
  /** Secondary button handler; default none */
  onSecondary?: () => void;
  /** Whether the dialog is shown; default true */
  open?: boolean;
  /** Called on Escape; default `onOkay` */
  onClose?: () => void;
  /** Render in place for docs; default false */
  inline?: boolean;
}

/** SuccessDialog confirms a major completed task with a green check, an "... Successfully" title and an Okay button. */
export const SuccessDialog = forwardRef<HTMLDivElement, SuccessDialogProps>(function SuccessDialog(
  {
    title,
    children,
    okayLabel = 'Okay',
    onOkay,
    secondary,
    onSecondary,
    open = true,
    onClose,
    inline = false,
    className,
    id,
    ...rest
  },
  ref
) {
  const bodyId = useDomId('okd', id ? `${id}-body` : undefined);
  const panelRef = useOverlay<HTMLDivElement>(open, inline, onClose ?? onOkay, ref);
  if (!open) return null;
  return (
    <Overlay inline={inline}>
      <div
        ref={panelRef}
        id={id}
        className={cx('co-modal co-modal-sm co-success', className)}
        role="alertdialog"
        aria-modal={inline ? undefined : true}
        aria-label={title}
        aria-describedby={children ? bodyId : undefined}
        {...rest}
      >
        <div className="co-mb co-center">
          <div className="co-okc">
            <Icon name="check" size={32} strokeWidth={3} />
          </div>
          <h2>{title}</h2>
          {children ? (
            <div className="co-muted" id={bodyId}>
              {children}
            </div>
          ) : null}
        </div>
        <div className="co-mf co-mf-c">
          {secondary ? <Button onClick={onSecondary}>{secondary}</Button> : null}
          <Button variant="primary" onClick={onOkay} data-autofocus="">
            {okayLabel}
          </Button>
        </div>
      </div>
    </Overlay>
  );
});
