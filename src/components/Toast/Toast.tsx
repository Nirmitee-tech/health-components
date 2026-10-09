import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../internal/cx';
import { useLatest } from '../../internal/hooks';
import { Portal } from '../../internal/Portal';
import { Icon } from '../Icon/Icon';

export type ToastTone = 'neutral' | 'success' | 'error';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  /** Message in the "... Successfully" voice ("Draft Saved Successfully"). Falls back to `children`. */
  message?: string;
  /** 'neutral' | 'success' | 'error'; default 'neutral' */
  tone?: ToastTone;
  /** One text action, such as "Undo"; default none */
  action?: string;
  /** Action handler; default none */
  onAction?: () => void;
  /** Shows a Dismiss (x) button that calls this; default none */
  onDismiss?: () => void;
  /** Static, rendered in place (previews, docs, and inside ToastProvider); otherwise fixed at the bottom through a portal; default false */
  inline?: boolean;
  /** Message content when `message` is not set */
  children?: ReactNode;
}

/**
 * Toast confirms a finished action at the bottom of the screen for about 2.8 seconds, in the "... Successfully" voice.
 * A bare Toast stays until you unmount it; use `ToastProvider` + `useToast()` for queued, auto-dismissing toasts.
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { message, tone = 'neutral', action, onAction, onDismiss, inline = false, className, children, ...rest },
  ref
) {
  const node = (
    <div
      ref={ref}
      className={cx('co-toast', inline && 'co-inline', `co-toast-${tone}`, className)}
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live={tone === 'error' ? undefined : 'polite'}
      {...rest}
    >
      {tone === 'success' ? (
        <Icon name="check" size={16} />
      ) : tone === 'error' ? (
        <Icon name="alert-circle" size={16} />
      ) : null}
      <span>{message ?? children}</span>
      {action ? (
        <button type="button" className="co-toast-a" onClick={onAction}>
          {action}
        </button>
      ) : null}
      {onDismiss ? (
        <button type="button" className="co-toast-a co-toast-x" aria-label="Dismiss" onClick={onDismiss}>
          <Icon name="x" size={14} />
        </button>
      ) : null}
    </div>
  );
  return inline ? node : <Portal>{node}</Portal>;
});

/* ------------------------------------------------------------------ */
/* ToastProvider + useToast */
/* ------------------------------------------------------------------ */

/** Default time a toast stays on screen, from the design system. */
export const TOAST_DURATION = 2800;
/** Minimum time for a toast that holds an action (README: never under 5 seconds). */
export const TOAST_ACTION_DURATION = 5000;

export interface ToastOptions {
  /** Message text */
  message: string;
  /** 'neutral' | 'success' | 'error'; default 'neutral' */
  tone?: ToastTone;
  /** Text action such as "Undo"; default none */
  action?: string;
  /** Action handler; the toast closes after it runs; default none */
  onAction?: () => void;
  /**
   * Milliseconds before it hides; `0` keeps it until dismissed.
   * Default 2800, 5000 with an action, and 0 (stays) for `error`.
   */
  duration?: number;
  /** Your own id, to update or dismiss it later; default generated */
  id?: string;
}

/** A toast in the queue. */
export interface ToastEntry extends ToastOptions {
  id: string;
}

export interface ToastApi {
  /** Queues a toast and returns its id. */
  show: (toast: ToastOptions | string) => string;
  /** Shortcut for `show({ message, tone: 'success' })`. */
  success: (message: string, options?: Omit<ToastOptions, 'message' | 'tone'>) => string;
  /** Shortcut for `show({ message, tone: 'error' })`; stays until dismissed. */
  error: (message: string, options?: Omit<ToastOptions, 'message' | 'tone'>) => string;
  /** Removes a toast (or all toasts without an id). */
  dismiss: (id?: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export interface ToastProviderProps {
  /** Your app */
  children?: ReactNode;
  /** Toasts visible at once; the rest wait in the queue; default 3 */
  max?: number;
  /** Default duration in ms for neutral and success toasts; default 2800 */
  duration?: number;
  /** Class on the fixed stack at the bottom of the screen; default none */
  className?: string;
}

function ToastItem({ entry, fallback, onDone }: { entry: ToastEntry; fallback: number; onDone: (id: string) => void }) {
  const ms =
    entry.duration ??
    (entry.tone === 'error' ? 0 : entry.action ? Math.max(fallback, TOAST_ACTION_DURATION) : fallback);
  const [paused, setPaused] = useState(false);
  const done = useLatest(onDone);
  const remaining = useRef(ms);
  useEffect(() => {
    if (!ms || paused) return;
    const start = Date.now();
    const t = setTimeout(() => done.current(entry.id), remaining.current);
    return () => {
      clearTimeout(t);
      remaining.current = Math.max(0, remaining.current - (Date.now() - start));
    };
  }, [ms, paused, entry.id, done]);
  return (
    <Toast
      inline
      message={entry.message}
      tone={entry.tone}
      action={entry.action}
      onAction={
        entry.onAction
          ? () => {
              entry.onAction?.();
              onDone(entry.id);
            }
          : undefined
      }
      onDismiss={ms === 0 ? () => onDone(entry.id) : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    />
  );
}

/**
 * ToastProvider queues toasts at the bottom of the screen through a portal. Neutral and success toasts hide after
 * 2.8 s (5 s with an action; hover or focus pauses the timer); error toasts stay until dismissed.
 * Read the API with `useToast()`.
 */
export function ToastProvider({ children, max = 3, duration = TOAST_DURATION, className }: ToastProviderProps) {
  const [queue, setQueue] = useState<ToastEntry[]>([]);
  const seq = useRef(0);

  const dismiss = useCallback((id?: string) => {
    setQueue((q) => (id === undefined ? [] : q.filter((t) => t.id !== id)));
  }, []);

  const show = useCallback((input: ToastOptions | string) => {
    const opts = typeof input === 'string' ? { message: input } : input;
    seq.current += 1;
    const id = opts.id ?? `toast-${seq.current}`;
    setQueue((q) => {
      const i = q.findIndex((t) => t.id === id);
      if (i < 0) return [...q, { ...opts, id }];
      const next = q.slice();
      next[i] = { ...opts, id };
      return next;
    });
    return id;
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      show,
      dismiss,
      success: (message, options) => show({ ...options, message, tone: 'success' }),
      error: (message, options) => show({ ...options, message, tone: 'error' }),
    }),
    [show, dismiss]
  );

  const visible = queue.slice(0, Math.max(1, max));

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Portal>
        <div className={cx('co-toast-stack', className)} aria-live="polite" aria-relevant="additions">
          {visible.map((t) => (
            <ToastItem key={t.id} entry={t} fallback={duration} onDone={dismiss} />
          ))}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
}

/** The toast API of the nearest ToastProvider: `const toast = useToast(); toast.success('Draft Saved Successfully')`. */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast() must be used inside <ToastProvider>.');
  return ctx;
}
