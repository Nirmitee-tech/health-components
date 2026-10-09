import { forwardRef, type MouseEvent } from 'react';
import { cx } from '../../internal/cx';
import { useMenuButton } from '../../internal/useMenuButton';
import { Button, buttonVariantClass } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Menu, type MenuAlign, type MenuItem } from '../Menu/Menu';

export interface SplitButtonProps {
  /** Main action label ("Submit Claim"); required */
  label: string;
  /** Runs the main action; default none */
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /** Related actions in the menu: Array<{label, hint?, icon?, danger?, disabled?, onSelect?}>; required */
  items: MenuItem[];
  /** 'primary' | 'secondary'; default 'primary' */
  variant?: 'primary' | 'secondary';
  /** 'sm' | 'md'; default 'md' */
  size?: 'sm' | 'md';
  /** aria-label of the arrow button; default "More options" */
  menuLabel?: string;
  /** Open on first render (uncontrolled); default false */
  defaultOpen?: boolean;
  /** Controlled open state of the menu; default undefined (uncontrolled) */
  open?: boolean;
  /** Called when the menu opens or closes */
  onOpenChange?: (open: boolean) => void;
  /** Disables both halves; default false */
  disabled?: boolean;
  /** 'right' | 'left': menu alignment; default 'right' */
  align?: MenuAlign;
  /** Class on the wrapper */
  className?: string;
}

/** SplitButton pairs a main action with a menu of related ones, such as Submit Claim with Submit and Print. */
export const SplitButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, SplitButtonProps>(function SplitButton(
  {
    label,
    onClick,
    items,
    variant = 'primary',
    size = 'md',
    menuLabel = 'More options',
    defaultOpen,
    open: openProp,
    onOpenChange,
    disabled = false,
    align,
    className,
  },
  ref
) {
  const mb = useMenuButton<HTMLButtonElement>({ open: openProp, defaultOpen, onOpenChange });
  return (
    <div className={cx('co-split', 'co-mwrap', className)} ref={mb.wrapRef}>
      <Button
        ref={ref}
        variant={variant}
        size={size}
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </Button>
      <button
        ref={mb.triggerRef}
        type="button"
        className={cx('co-btn', buttonVariantClass[variant], size !== 'md' && `co-btn-${size}`, 'co-split-t')}
        aria-label={menuLabel}
        aria-haspopup="menu"
        aria-expanded={mb.open}
        aria-controls={mb.open ? mb.popupId : undefined}
        disabled={disabled}
        onClick={mb.onTriggerClick}
        onKeyDown={mb.onTriggerKeyDown}
      >
        <Icon name="chevron-down" size={16} />
      </button>
      {mb.open && !disabled ? (
        <Menu
          id={mb.popupId}
          items={items}
          align={align}
          label={`${label}: ${menuLabel}`}
          autoFocus={mb.focusTarget}
          onClose={mb.closeToTrigger}
        />
      ) : null}
    </div>
  );
});
