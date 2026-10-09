import { forwardRef, useCallback, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { cx } from '../../internal/cx';
import { useDomId, useEscape, useFocusTrap, useScrollLock } from '../../internal/hooks';
import { Portal } from '../../internal/Portal';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';

/* ------------------------------------------------------------------ */
/* Overlay: the scrim shared by Modal, SuccessDialog, Drawer and CommandPalette */
/* ------------------------------------------------------------------ */

export type OverlaySide = 'center' | 'right' | 'bottom';

export interface OverlayProps extends HTMLAttributes<HTMLDivElement> {
  /** Render in place (no portal, no scrim behaviour) for documentation; default false */
  inline?: boolean;
  /** Where the panel sits: 'center' | 'right' | 'bottom'; default 'center' */
  side?: OverlaySide;
  /** Called when the scrim (outside the panel) is pressed; default none */
  onScrimPress?: () => void;
  children?: ReactNode;
}

/** The `.co-ov` scrim. Portals to `<body>` unless `inline`. */
export function Overlay({ inline = false, side = 'center', onScrimPress, className, children, ...rest }: OverlayProps) {
  const cls = cx('co-ov', inline && 'co-inline', side === 'right' && 'co-ov-r', side === 'bottom' && 'co-ov-b', className);
  if (inline) {
    return (
      <div className={cls} {...rest}>
        {children}
      </div>
    );
  }
  return (
    <Portal>
      <div
        className={cls}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onScrimPress?.();
        }}
        {...rest}
      >
        {children}
      </div>
    </Portal>
  );
}

/**
 * Modal overlay behaviour: focus trap with focus return, scroll lock and Escape, all only while
 * `active` and not `inline`. Returns a callback ref for the dialog panel; the trap starts once the
 * portalled panel is in the DOM.
 */
export function useOverlay<T extends HTMLElement>(
  active: boolean,
  inline: boolean,
  onEscape?: () => void,
  forwardedRef?: Ref<T>
): (node: T | null) => void {
  const ref = useRef<T | null>(null);
  const [mounted, setMounted] = useState(false);
  const live = active && !inline;
  useFocusTrap(ref, live && mounted);
  useScrollLock(live);
  useEscape(live, onEscape);
  return useCallback(
    (node: T | null) => {
      ref.current = node;
      setMounted(node !== null);
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) (forwardedRef as { current: T | null }).current = node;
    },
    [forwardedRef]
  );
}

/* ------------------------------------------------------------------ */
/* Modal */
/* ------------------------------------------------------------------ */

export type ModalKind = 'form' | 'confirm' | 'destructive';
export type ModalSize = 'sm' | 'md' | 'wide';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Whether the dialog is shown; default true */
  open?: boolean;
  /** Dialog title; names the dialog. Required. */
  title: ReactNode;
  /** 'form' | 'confirm' | 'destructive'; form is a dialog, the others alertdialog; default 'form' */
  kind?: ModalKind;
  /** 'sm' 420px | 'md' 640px | 'wide' 980px; default 'md' */
  size?: ModalSize;
  /** Dialog body */
  children?: ReactNode;
  /** Primary button label, a verb ("Void Claim"); default "Save" */
  primaryLabel?: string;
  /** Cancel button label; default "Cancel" */
  cancelLabel?: string;
  /** Primary button handler; default none */
  onPrimary?: () => void;
  /** Called by Cancel, the x button, Escape and (when `closeOnScrim`) a scrim press; default none */
  onClose?: () => void;
  /** Shows a spinner on the primary button; default false */
  loading?: boolean;
  /** Disables the primary button; default false */
  primaryDisabled?: boolean;
  /** Replaces the default Cancel + primary footer; `null` removes the footer; default the two buttons */
  footer?: ReactNode;
  /** Close when the scrim is pressed (set false for forms with typed input); default true */
  closeOnScrim?: boolean;
  /** Render in place for docs: no portal, focus trap, scroll lock or Escape; default false */
  inline?: boolean;
}

/** Modal asks for input or a decision in a centered dialog: form, confirm and destructive kinds. */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    open = true,
    title,
    kind = 'form',
    size = 'md',
    children,
    primaryLabel = 'Save',
    cancelLabel = 'Cancel',
    onPrimary,
    onClose,
    loading = false,
    primaryDisabled = false,
    footer,
    closeOnScrim = true,
    inline = false,
    className,
    id,
    ...rest
  },
  ref
) {
  const titleId = useDomId('dlg', id ? `${id}-title` : undefined);
  const panelRef = useOverlay<HTMLDivElement>(open, inline, onClose, ref);
  if (!open) return null;
  const foot =
    footer !== undefined ? (
      footer
    ) : (
      <>
        <Button onClick={onClose}>{cancelLabel}</Button>
        <Button
          variant={kind === 'destructive' ? 'danger-solid' : 'primary'}
          onClick={onPrimary}
          loading={loading}
          disabled={primaryDisabled}
        >
          {primaryLabel}
        </Button>
      </>
    );
  return (
    <Overlay inline={inline} onScrimPress={closeOnScrim ? onClose : undefined}>
      <div
        ref={panelRef}
        id={id}
        className={cx(
          'co-modal',
          size === 'wide' && 'co-modal-w',
          size === 'sm' && 'co-modal-sm',
          `co-modal-${kind}`,
          className
        )}
        role={kind === 'form' ? 'dialog' : 'alertdialog'}
        aria-modal={inline ? undefined : true}
        aria-labelledby={titleId}
        {...rest}
      >
        <div className="co-mh">
          <h2 id={titleId}>
            {kind === 'destructive' ? <Icon name="alert" size={18} className="co-dng-ic" /> : null}
            {title}
          </h2>
          <IconButton icon="x" label="Close" size="sm" onClick={onClose} />
        </div>
        <div className="co-mb">{children}</div>
        {foot ? <div className="co-mf">{foot}</div> : null}
      </div>
    </Overlay>
  );
});
