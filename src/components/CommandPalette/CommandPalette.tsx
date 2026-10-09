import { forwardRef, useEffect, useState, type ForwardedRef, type HTMLAttributes, type KeyboardEvent, type ReactElement, type Ref } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId, useLatest } from '../../internal/hooks';
import { Icon, type IconName } from '../Icon/Icon';
import { Overlay, useOverlay } from '../Modal/Modal';

/** One searchable entry: a screen, patient or action. */
export interface CommandPaletteItem {
  /** Kind pill text: 'Screen', 'Patient', 'Action' or your own */
  kind: string;
  /** Main label: screen name, patient name, action verb */
  label: string;
  /** Muted text after the label, also searched (DOB and MRN for patients) */
  meta?: string;
  /** Icon; default user for Patient, plus for Action, grid otherwise */
  icon?: IconName;
  /** Your own id or route; not rendered */
  id?: string;
}

export interface CommandPaletteProps<T extends CommandPaletteItem = CommandPaletteItem>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** The search index. Required. */
  items: T[];
  /** Whether the palette is shown; default true */
  open?: boolean;
  /** Query (controlled); default uncontrolled */
  query?: string;
  /** Initial query when uncontrolled; default "" */
  defaultQuery?: string;
  /** Called on every keystroke; default none */
  onQueryChange?: (query: string) => void;
  /** Input placeholder and accessible name; default "Jump to a screen, patient or action" */
  placeholder?: string;
  /** Called with the chosen item (Enter or click); default none */
  onSelect?: (item: T) => void;
  /** Called on Escape and a scrim press; default none */
  onClose?: () => void;
  /** Most results shown; default 9 */
  maxResults?: number;
  /** Render in place for docs: no portal, focus trap, scroll lock or Escape; default false */
  inline?: boolean;
}

const defaultIcon = (it: CommandPaletteItem): IconName =>
  it.icon ?? (it.kind === 'Patient' ? 'user' : it.kind === 'Action' ? 'plus' : 'grid');

function CommandPaletteInner<T extends CommandPaletteItem>(
  {
    items,
    open = true,
    query: queryProp,
    defaultQuery = '',
    onQueryChange,
    placeholder = 'Jump to a screen, patient or action',
    onSelect,
    onClose,
    maxResults = 9,
    inline = false,
    className,
    id,
    ...rest
  }: CommandPaletteProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const [q, setQ] = useControllableState(queryProp, defaultQuery, onQueryChange);
  const [act, setAct] = useState(0);
  const listId = useDomId('pal', id ? `${id}-list` : undefined);
  const panelRef = useOverlay<HTMLDivElement>(open, inline, onClose, ref);
  if (!open) return null;

  const ql = q.trim().toLowerCase();
  const res = items
    .filter((r) => !ql || `${r.label} ${r.meta ?? ''} ${r.kind}`.toLowerCase().includes(ql))
    .slice(0, maxResults);
  const active = Math.min(act, Math.max(0, res.length - 1));
  const optId = (i: number) => `${listId}-${i}`;

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setAct(Math.min(active + 1, res.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setAct(Math.max(0, active - 1));
    } else if (e.key === 'Home' && e.ctrlKey) {
      e.preventDefault();
      setAct(0);
    } else if (e.key === 'End' && e.ctrlKey) {
      e.preventDefault();
      setAct(Math.max(0, res.length - 1));
    } else if (e.key === 'Enter' && res[active]) {
      e.preventDefault();
      onSelect?.(res[active]!);
    }
  };

  return (
    <Overlay inline={inline} onScrimPress={onClose}>
      <div
        ref={panelRef}
        id={id}
        className={cx('co-pal', className)}
        role="dialog"
        aria-modal={inline ? undefined : true}
        aria-label="Jump to anything"
        {...rest}
      >
        <input
          data-autofocus={inline ? undefined : ''}
          role="combobox"
          aria-label={placeholder}
          aria-autocomplete="list"
          aria-expanded={res.length > 0}
          aria-controls={res.length ? listId : undefined}
          aria-activedescendant={res[active] ? optId(active) : undefined}
          placeholder={placeholder}
          value={q}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => {
            setQ(e.target.value);
            setAct(0);
          }}
          onKeyDown={onKeyDown}
        />
        {res.length ? (
          <div className="co-pres" id={listId} role="listbox" aria-label="Results">
            {res.map((r, i) => (
              // eslint-disable-next-line jsx-a11y/interactive-supports-focus, jsx-a11y/click-events-have-key-events -- option in an aria-activedescendant listbox: arrows and Enter are handled by the input (APG combobox).
              <div
                key={r.id ?? `${r.kind}-${r.label}-${i}`}
                id={optId(i)}
                role="option"
                aria-selected={i === active}
                className={cx('co-pr', i === active && 'is-on')}
                onMouseEnter={() => setAct(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelect?.(r)}
              >
                <span className="co-pk-k">{r.kind}</span>
                <Icon name={defaultIcon(r)} size={16} />
                <span className="co-mi-l">
                  {r.label}
                  {r.meta ? <span className="co-mi-s">{r.meta}</span> : null}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="co-pres">
            <div className="co-menu-h" role="status">
              {`Nothing matches "${q}". Try a patient name, MRN or screen name.`}
            </div>
          </div>
        )}
        <div className="co-pfoot" aria-hidden="true">
          <span>
            <kbd className="co-kbd">↑↓</kbd> move
          </span>
          <span>
            <kbd className="co-kbd">Enter</kbd> open
          </span>
          <span>
            <kbd className="co-kbd">Esc</kbd> close
          </span>
        </div>
      </div>
    </Overlay>
  );
}

/** CommandPalette is the Command Bar style's "Jump to anything" search for screens, patients and actions, opened with Ctrl K or Cmd K. */
export const CommandPalette = forwardRef(CommandPaletteInner) as <T extends CommandPaletteItem = CommandPaletteItem>(
  props: CommandPaletteProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement | null;

export interface CommandPaletteShortcutOptions {
  /** Listen only while true; default true */
  enabled?: boolean;
  /** The letter used with Ctrl (Windows, Linux) or Cmd (macOS); default 'k' */
  key?: string;
}

/**
 * Calls `onOpen` on Ctrl K / Cmd K anywhere on the page, the shortcut that opens the CommandPalette.
 * `const [open, setOpen] = useState(false); useCommandPaletteShortcut(() => setOpen(true));`
 */
export function useCommandPaletteShortcut(onOpen: () => void, options: CommandPaletteShortcutOptions = {}): void {
  const { enabled = true, key = 'k' } = options;
  const cb = useLatest(onOpen);
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        cb.current?.();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [enabled, key, cb]);
}
