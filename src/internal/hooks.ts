import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from 'react';

/** useLayoutEffect in the browser, useEffect on the server (no SSR warning). */
export const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** A stable DOM id. Uses `id` when the consumer passes one, otherwise React's useId with a readable prefix. */
export function useDomId(prefix: string, id?: string): string {
  const reactId = useId().replace(/:/g, '');
  return id ?? `${prefix}-${reactId}`;
}

/**
 * State that is controlled when `value` is defined and uncontrolled otherwise.
 * `onChange` fires in both modes.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void
): [T, (next: T) => void] {
  const [inner, setInner] = useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? (value as T) : inner;
  const onChangeRef = useLatest(onChange);
  const set = useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChangeRef.current?.(next);
    },
    [controlled, onChangeRef]
  );
  return [current, set];
}

/** A ref that always holds the latest value, for callbacks used inside effects. */
export function useLatest<T>(value: T): RefObject<T> {
  const ref = useRef(value);
  useIsoLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}

/** Calls `onEscape` when Escape is pressed while `active`. */
export function useEscape(active: boolean, onEscape?: () => void): void {
  const cb = useLatest(onEscape);
  useEffect(() => {
    if (!active || !cb.current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cb.current?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, cb]);
}

/** Calls `onOutside` on a pointer down outside `ref` or on Escape, while `active`. For menus and popovers. */
export function useDismiss(ref: RefObject<HTMLElement | null>, active: boolean, onDismiss: () => void): void {
  const cb = useLatest(onDismiss);
  useEffect(() => {
    if (!active) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el) return;
      // composedPath sees through shadow roots (Web Components), where e.target is retargeted to the host.
      const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
      const inside = path.length ? path.includes(el) : el.contains(e.target as Node);
      if (!inside) cb.current();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cb.current();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [active, ref, cb]);
}

const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab focus inside `ref` while `active`, moves focus into it on open
 * (the element with `autofocus`/`data-autofocus`, else the first focusable, else the container)
 * and returns focus to the previously focused element on close. For modal dialogs.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;
    const previous = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
      );
    if (!node.contains(document.activeElement)) {
      const preferred = node.querySelector<HTMLElement>('[autofocus], [data-autofocus]');
      const first = preferred ?? focusables()[0];
      if (first) first.focus();
      else {
        if (!node.hasAttribute('tabindex')) node.setAttribute('tabindex', '-1');
        node.focus();
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const list = focusables();
      if (list.length === 0) {
        e.preventDefault();
        return;
      }
      const first = list[0]!;
      const last = list[list.length - 1]!;
      if (e.shiftKey && (document.activeElement === first || !node.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    node.addEventListener('keydown', onKey);
    return () => {
      node.removeEventListener('keydown', onKey);
      if (previous && typeof previous.focus === 'function' && document.contains(previous)) previous.focus();
    };
  }, [active, ref]);
}

/** Locks page scroll while `active` (modal overlays). */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}
