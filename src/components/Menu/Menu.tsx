import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../internal/cx';
import { useDomId } from '../../internal/hooks';
import { useMenuButton, type MenuFocusTarget } from '../../internal/useMenuButton';
import { Button, type ButtonSize, type ButtonVariant } from '../Button/Button';
import { Icon, type IconName } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';

/** An action row in a Menu. */
export interface MenuActionItem {
  /** Item text, a verb in Title Case ("Open Claim") */
  label: ReactNode;
  /** Icon before the label; default none */
  icon?: IconName;
  /** Muted second line ("Last checked 2 h ago"); default none */
  hint?: ReactNode;
  /** Keyboard shortcut shown at the end ("⌘P"); default none */
  shortcut?: string;
  /** Destructive item in red; put it last, after a divider; default false */
  danger?: boolean;
  /** Disabled item; default false */
  disabled?: boolean;
  /** Current choice (highlighted); default false */
  active?: boolean;
  /** Runs when the item is chosen; the menu then closes */
  onSelect?: (event: MouseEvent<HTMLButtonElement>) => void;
  divider?: never;
  heading?: never;
}
/** A separator line between groups of items. */
export interface MenuDividerItem {
  divider: true;
  label?: never;
  heading?: never;
}
/** A muted heading row ("CLM-20871 . Henna West"). */
export interface MenuHeadingItem {
  heading: ReactNode;
  label?: never;
  divider?: never;
}
/** One entry of `Menu.items`: an action, a divider or a heading. */
export type MenuItem = MenuActionItem | MenuDividerItem | MenuHeadingItem;
export type MenuAlign = 'right' | 'left';

const isAction = (it: MenuItem): it is MenuActionItem => !('divider' in it && it.divider) && !('heading' in it && it.heading != null);

export interface MenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Array<{label, icon?, hint?, shortcut?, danger?, disabled?, active?, onSelect?} | {divider:true} | {heading}>; required */
  items: MenuItem[];
  /** 'right' | 'left': which edge of the trigger the dropdown lines up with; default 'right' */
  align?: MenuAlign;
  /** Static, in-flow menu for docs and previews; default false */
  inline?: boolean;
  /** aria-label of the menu; default none */
  label?: string;
  /** Called after an item is chosen, and on Escape or Tab inside the menu; default none */
  onClose?: () => void;
  /** Moves focus to the first or last item on mount (used by menu buttons); default false */
  autoFocus?: MenuFocusTarget;
  /** Inline style of the menu */
  style?: CSSProperties;
}

/** Menu lists actions in a dropdown, following the ARIA menu pattern (arrows, Home/End, type-ahead, Escape). */
export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { items, align = 'right', inline = false, label, onClose, autoFocus = false, className, onKeyDown, ...rest },
  ref
) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const enabled = items.map((it, i) => (isAction(it) && !it.disabled ? i : -1)).filter((i) => i >= 0);
  const [current, setCurrent] = useState<number>(enabled[0] ?? -1);
  const tabStop = enabled.includes(current) ? current : (enabled[0] ?? -1);

  const focusAt = (index: number) => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`);
    if (el) el.focus();
  };

  useEffect(() => {
    if (!autoFocus || enabled.length === 0) return;
    focusAt(autoFocus === 'first' ? enabled[0]! : enabled[enabled.length - 1]!);
    // Only on mount: the menu was just opened by the user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || enabled.length === 0) return;
    const pos = enabled.indexOf(current);
    let next: number | undefined;
    if (e.key === 'ArrowDown') next = enabled[(pos + 1) % enabled.length];
    else if (e.key === 'ArrowUp') next = enabled[(pos - 1 + enabled.length) % enabled.length];
    else if (e.key === 'Home') next = enabled[0];
    else if (e.key === 'End') next = enabled[enabled.length - 1];
    else if (e.key === 'Escape') {
      if (onClose) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
      return;
    } else if (e.key === 'Tab') {
      onClose?.();
      return;
    } else if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const ch = e.key.toLowerCase();
      const order = [...enabled.slice(pos + 1), ...enabled.slice(0, pos + 1)];
      next = order.find((i) => {
        const it = items[i] as MenuActionItem;
        return typeof it.label === 'string' && it.label.toLowerCase().startsWith(ch);
      });
      if (next === undefined) return;
    } else return;
    e.preventDefault();
    if (next !== undefined) {
      setCurrent(next);
      focusAt(next);
    }
  };

  const setRefs = (node: HTMLDivElement | null) => {
    listRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <div
      ref={setRefs}
      className={cx('co-menu', align === 'left' && 'co-menu-left', inline && 'co-menu-inline', className)}
      role="menu"
      aria-label={label}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {items.map((it, i) => {
        if ('divider' in it && it.divider) return <div key={i} className="co-menu-sep" role="separator" />;
        if (!isAction(it)) {
          return (
            <div key={i} className="co-menu-h" role="presentation">
              {(it as MenuHeadingItem).heading}
            </div>
          );
        }
        return (
          <button
            key={i}
            type="button"
            role="menuitem"
            data-index={i}
            tabIndex={i === tabStop ? 0 : -1}
            className={cx('co-mi', it.danger && 'co-mi-danger', it.active && 'is-on')}
            disabled={it.disabled}
            aria-current={it.active ? 'true' : undefined}
            onFocus={() => setCurrent(i)}
            onClick={(e) => {
              it.onSelect?.(e);
              onClose?.();
            }}
          >
            {it.icon ? <Icon name={it.icon} size={16} /> : null}
            <span className="co-mi-l">
              {it.label}
              {it.hint ? <span className="co-mi-s">{it.hint}</span> : null}
            </span>
            {it.shortcut ? <kbd className="co-kbd">{it.shortcut}</kbd> : null}
          </button>
        );
      })}
    </div>
  );
});

export interface KebabMenuProps {
  /** Menu items, as Menu; required */
  items: MenuItem[];
  /** Accessible name of the three-dot button and the menu; default "Row actions" */
  label?: string;
  /** Horizontal dots instead of vertical; default false */
  horizontal?: boolean;
  /** 'right' | 'left'; default 'right' */
  align?: MenuAlign;
  /** Open on first render (uncontrolled); default false */
  defaultOpen?: boolean;
  /** Controlled open state; default undefined (uncontrolled) */
  open?: boolean;
  /** Called when the menu opens or closes */
  onOpenChange?: (open: boolean) => void;
  /** Class on the wrapper */
  className?: string;
}

/** KebabMenu opens a Menu from a three-dot IconButton, for row and header overflow actions. */
export function KebabMenu({
  items,
  label = 'Row actions',
  horizontal = false,
  align,
  defaultOpen,
  open: openProp,
  onOpenChange,
  className,
}: KebabMenuProps) {
  const mb = useMenuButton<HTMLButtonElement>({ open: openProp, defaultOpen, onOpenChange });
  return (
    <div className={cx('co-mwrap', className)} ref={mb.wrapRef}>
      <IconButton
        ref={mb.triggerRef}
        icon={horizontal ? 'more-h' : 'more'}
        label={label}
        size="sm"
        aria-haspopup="menu"
        aria-expanded={mb.open}
        aria-controls={mb.open ? mb.popupId : undefined}
        onClick={mb.onTriggerClick}
        onKeyDown={mb.onTriggerKeyDown}
      />
      {mb.open ? (
        <Menu
          id={mb.popupId}
          items={items}
          align={align}
          label={label}
          autoFocus={mb.focusTarget}
          onClose={mb.closeToTrigger}
        />
      ) : null}
    </div>
  );
}

export interface PopoverProps {
  /** Trigger button text ("Filters (2)"); required */
  trigger: ReactNode;
  /** Bold title at the top of the panel; also its accessible name; default none */
  title?: string;
  /** Panel content: a small form or filter set */
  children?: ReactNode;
  /** 'right' | 'left'; default 'right' */
  align?: MenuAlign;
  /** Open on first render (uncontrolled); default false */
  defaultOpen?: boolean;
  /** Controlled open state; default undefined (uncontrolled) */
  open?: boolean;
  /** Called when the panel opens or closes */
  onOpenChange?: (open: boolean) => void;
  /** Trigger button variant; default 'secondary' */
  triggerVariant?: ButtonVariant;
  /** Trigger button size; default 'sm' */
  size?: ButtonSize;
  /** aria-label of the panel when there is no title and the trigger is not text; default title or trigger */
  label?: string;
  /** Class on the wrapper */
  className?: string;
}

/** Popover holds a small form or filter set in a panel under a button. Closes on outside click and Escape. */
export function Popover({
  trigger,
  title,
  children,
  align,
  defaultOpen,
  open: openProp,
  onOpenChange,
  triggerVariant = 'secondary',
  size = 'sm',
  label,
  className,
}: PopoverProps) {
  const mb = useMenuButton<HTMLButtonElement>({ open: openProp, defaultOpen, onOpenChange, prefix: 'pop' });
  const panelRef = useRef<HTMLDivElement | null>(null);
  const titleId = useDomId('pop-t');
  const focusOnOpen = mb.focusTarget !== false;
  useEffect(() => {
    if (mb.open && focusOnOpen) panelRef.current?.focus();
  }, [mb.open, focusOnOpen]);
  return (
    <div className={cx('co-mwrap', className)} ref={mb.wrapRef}>
      <Button
        ref={(node) => {
          mb.triggerRef.current = node as HTMLButtonElement | null;
        }}
        variant={triggerVariant}
        size={size}
        iconRight="chevron-down"
        aria-expanded={mb.open}
        aria-haspopup="dialog"
        aria-controls={mb.open ? mb.popupId : undefined}
        onClick={mb.onTriggerClick}
      >
        {trigger}
      </Button>
      {mb.open ? (
        <div
          ref={panelRef}
          id={mb.popupId}
          tabIndex={-1}
          className={cx('co-pop', align === 'left' && 'co-menu-left')}
          role="dialog"
          aria-labelledby={title ? titleId : undefined}
          aria-label={title ? undefined : (label ?? (typeof trigger === 'string' ? trigger : undefined))}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.stopPropagation();
              mb.closeToTrigger();
            }
          }}
        >
          {title ? (
            <div className="co-pop-h" id={titleId}>
              {title}
            </div>
          ) : null}
          {children}
        </div>
      ) : null}
    </div>
  );
}
