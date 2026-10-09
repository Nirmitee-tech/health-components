import { forwardRef, type ChangeEvent, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Avatar } from '../Avatar/Avatar';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';
import { RolePill, type RoleOption } from '../RolePill/RolePill';

export type TopBarVariant = 'classic' | 'sidebar' | 'rail' | 'command';

const DEFAULT_LINKS = ['Home', 'Schedule', 'Patients', 'Billing', 'Reports', 'Settings'];

export interface TopBarProps extends HTMLAttributes<HTMLElement> {
  /** 'classic' navy bar with module links | 'sidebar' patient search | 'rail' patient tabs | 'command' Jump to anything bar; default 'classic' */
  variant?: TopBarVariant;
  /** Previewed role; shows RolePill when set; default none */
  role?: string;
  /** RolePill roles; default none (the current role only) */
  roles?: RoleOption[];
  /** Called with the role chosen in RolePill; default none */
  onRoleChange?: (role: string) => void;
  /** Unread notification count; default none */
  notifications?: number;
  /** Quick add button label (not in classic); default "New" */
  quickAdd?: string;
  /** Product name; default "CareOS" */
  product?: string;
  /** Signed-in user, shown as initials; default "Jordan Lee" */
  user?: string;
  /** Rail only: the PatientTabs; default none */
  tabs?: ReactNode;
  /** Command only: current module; default "Modules" */
  module?: string;
  /** Command only: opens the CommandPalette; default none */
  onOpenPalette?: () => void;
  /** Command only: opens the module switcher; default none */
  onOpenModules?: () => void;
  /** Classic only: module links; default Home, Schedule, Patients, Billing, Reports, Settings */
  links?: string[];
  /** Classic only: current module link; default none */
  active?: string;
  /** Classic only: called when a module link is clicked; default none */
  onNavigate?: (link: string, event: MouseEvent<HTMLAnchorElement>) => void;
  /** Sidebar only: called as the patient search text changes; default none */
  onSearchChange?: (query: string) => void;
  /** Quick add handler; default none */
  onQuickAdd?: () => void;
  /** Notifications button handler; default none */
  onNotifications?: () => void;
  /** Account button handler; default none */
  onAccount?: () => void;
}

/**
 * TopBar is the 52px app header in all four styles: Classic navy bar with module links, patient search (Sidebar),
 * patient tabs (Rail) or the Jump to anything bar (Command), then Viewing as, notifications and the account.
 */
export const TopBar = forwardRef<HTMLElement, TopBarProps>(function TopBar(
  {
    variant = 'classic',
    role,
    roles,
    onRoleChange,
    notifications,
    quickAdd = 'New',
    product = 'CareOS',
    user = 'Jordan Lee',
    tabs,
    module = 'Modules',
    onOpenPalette,
    onOpenModules,
    links = DEFAULT_LINKS,
    active,
    onNavigate,
    onSearchChange,
    onQuickAdd,
    onNotifications,
    onAccount,
    className,
    ...rest
  },
  ref
) {
  const rolePill = role ? <RolePill role={role} roles={roles ?? [role]} onChange={onRoleChange} /> : null;
  const bell = <IconButton icon="bell" label="Notifications" badge={notifications} onClick={onNotifications} />;
  const account = (
    <button type="button" className="co-acct" aria-label="Account menu" onClick={onAccount}>
      <Avatar name={user} size="sm" color="accent" aria-hidden="true" />
    </button>
  );

  if (variant === 'classic') {
    return (
      <header ref={ref} className={cx('co-top co-top-classic', className)} {...rest}>
        <span className="co-logo">{product}</span>
        <nav className="co-cl-links" aria-label="Main">
          {links.map((l) => (
            <a
              key={l}
              href="#"
              className={cx('co-cl-a', l === active && 'is-on')}
              aria-current={l === active ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.(l, e);
              }}
            >
              {l}
            </a>
          ))}
        </nav>
        <div className="co-top-r">
          {rolePill}
          {bell}
          {account}
        </div>
      </header>
    );
  }

  return (
    <header ref={ref} className={cx('co-top', `co-top-${variant}`, className)} {...rest}>
      {variant === 'command' ? (
        <>
          <span className="co-logo">
            <span className="co-logo-m" aria-hidden="true">
              C
            </span>
            {product}
          </span>
          <button type="button" className="co-modb" aria-haspopup="menu" onClick={onOpenModules}>
            <Icon name="grid" size={16} />
            {module}
            <Icon name="chevron-down" size={14} />
          </button>
          <button type="button" className="co-cbar" aria-keyshortcuts="Control+K Meta+K" onClick={onOpenPalette}>
            <Icon name="search" size={16} />
            Jump to anything
            <kbd className="co-kbd co-ml">Ctrl K</kbd>
          </button>
        </>
      ) : variant === 'rail' ? (
        (tabs ?? null)
      ) : (
        <label className="co-sbox">
          <Icon name="search" size={16} />
          <input
            aria-label="Search patients by name, MRN or DOB"
            placeholder="Search patients by name, MRN or DOB"
            onChange={onSearchChange ? (e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value) : undefined}
          />
        </label>
      )}
      <div className="co-top-r">
        {rolePill}
        <Button variant="primary" size="sm" iconLeft="plus" onClick={onQuickAdd}>
          {quickAdd}
        </Button>
        {bell}
        {account}
      </div>
    </header>
  );
});
