import { useCallback, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { useControllableState, useDismiss, useDomId } from './hooks';

export type MenuFocusTarget = 'first' | 'last' | false;

export interface UseMenuButtonOptions {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** id prefix for the popup; default 'menu' */
  prefix?: string;
}

export interface UseMenuButtonResult<T extends HTMLElement> {
  open: boolean;
  setOpen: (open: boolean) => void;
  wrapRef: RefObject<HTMLDivElement | null>;
  triggerRef: RefObject<T | null>;
  popupId: string;
  /** Where focus goes when the popup mounts after a user opened it; false on first render (defaultOpen). */
  focusTarget: MenuFocusTarget;
  /** Closes and returns focus to the trigger (item chosen, Escape or Tab inside the popup). */
  closeToTrigger: () => void;
  /** Click handler for the trigger: toggles, focusing the first item on open. */
  onTriggerClick: () => void;
  /** Keydown handler for the trigger: ArrowDown opens on the first item, ArrowUp on the last. */
  onTriggerKeyDown: (e: KeyboardEvent<T>) => void;
}

/**
 * Shared state for a button that opens a menu or popover (KebabMenu, SplitButton, Popover):
 * controllable open state, outside click and Escape dismissal, and focus return to the trigger.
 */
export function useMenuButton<T extends HTMLElement = HTMLButtonElement>({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  prefix = 'menu',
}: UseMenuButtonOptions): UseMenuButtonResult<T> {
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange);
  const [focusTarget, setFocusTarget] = useState<MenuFocusTarget>(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<T | null>(null);
  const popupId = useDomId(prefix);

  useDismiss(wrapRef, open, () => setOpen(false));

  const closeToTrigger = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, [setOpen]);

  const onTriggerClick = useCallback(() => {
    if (!open) setFocusTarget('first');
    setOpen(!open);
  }, [open, setOpen]);

  const onTriggerKeyDown = useCallback(
    (e: KeyboardEvent<T>) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const target = e.key === 'ArrowDown' ? 'first' : 'last';
        if (open) {
          const items = wrapRef.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]:not(:disabled)');
          if (items && items.length) items[target === 'first' ? 0 : items.length - 1]!.focus();
          return;
        }
        setFocusTarget(target);
        setOpen(true);
      }
    },
    [open, setOpen]
  );

  return { open, setOpen, wrapRef, triggerRef, popupId, focusTarget, closeToTrigger, onTriggerClick, onTriggerKeyDown };
}
