import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { useMenuButton } from '../../internal/useMenuButton';
import { Icon } from '../Icon/Icon';
import { Menu, type MenuItem } from '../Menu/Menu';

/** A role to preview as: a plain name or a name with a hint ("MD, DO, NP, PA"). */
export type RoleOption = string | { label: string; hint?: string };

export interface RolePillProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'role'> {
  /** Role currently previewed (controlled). Required unless `defaultRole` is set. */
  role?: string;
  /** Initial role when uncontrolled; default "" */
  defaultRole?: string;
  /** Roles offered in the menu. Required. */
  roles: RoleOption[];
  /** Menu open on first render; default false */
  defaultOpen?: boolean;
  /** Menu open state (controlled); default uncontrolled */
  open?: boolean;
  /** Called when the menu opens or closes; default none */
  onOpenChange?: (open: boolean) => void;
  /** Called with the chosen role label; default none */
  onChange?: (role: string) => void;
  /** Class on the wrapper */
  className?: string;
}

const roleLabel = (r: RoleOption) => (typeof r === 'string' ? r : r.label);

/** RolePill shows which role the screen is previewed as ("Viewing as: Biller") and switches it. */
export const RolePill = forwardRef<HTMLButtonElement, RolePillProps>(function RolePill(
  { role, defaultRole = '', roles, defaultOpen = false, open, onOpenChange, onChange, className, ...rest },
  ref
) {
  const [current, setCurrent] = useControllableState(role, defaultRole, onChange);
  const mb = useMenuButton<HTMLButtonElement>({ open, defaultOpen, onOpenChange, prefix: 'roles' });
  const items: MenuItem[] = [
    { heading: 'Preview CareOS as another role. Nothing is saved.' },
    ...roles.map((r) => {
      const label = roleLabel(r);
      return {
        label,
        hint: typeof r === 'string' ? undefined : r.hint,
        active: label === current,
        onSelect: () => setCurrent(label),
      };
    }),
  ];
  return (
    <div className={cx('co-mwrap', className)} ref={mb.wrapRef}>
      <button
        {...rest}
        ref={(node) => {
          mb.triggerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        type="button"
        className="co-rpill"
        aria-label="Change the role you are viewing as"
        aria-haspopup="menu"
        aria-expanded={mb.open}
        aria-controls={mb.open ? mb.popupId : undefined}
        onClick={mb.onTriggerClick}
        onKeyDown={mb.onTriggerKeyDown}
      >
        <Icon name="eye" size={14} />
        Viewing as: <b>{current}</b>
        <Icon name="chevron-down" size={14} />
      </button>
      {mb.open ? (
        <Menu id={mb.popupId} label="Roles" items={items} autoFocus={mb.focusTarget} onClose={mb.closeToTrigger} />
      ) : null}
    </div>
  );
});

/** Alias promised by the design system card. */
export { RolePill as ViewingAs };
