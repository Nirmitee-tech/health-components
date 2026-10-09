import {
  forwardRef,
  useRef,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../internal/cx';
import { useControllableState, useDismiss, useDomId } from '../../internal/hooks';
import { Avatar } from '../Avatar/Avatar';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Field, fieldDescribedBy } from '../Field/Field';
import { Icon } from '../Icon/Icon';

/** One result of a Combobox: a patient, a code or a plain value. */
export interface ComboboxOption {
  /** Stable key; default code or label */
  value?: string;
  /** Main text: patient name, code description, payer */
  label: string;
  /** Second line: DOB and MRN, a specialty */
  meta?: string;
  /** ICD-10, CPT or other code (kind 'code') */
  code?: string;
  /** Flag badge at the end ("DNR", "Restricted") */
  flag?: string;
  /** Tone of the flag badge; default 'danger' */
  flagTone?: BadgeTone;
}

export type ComboboxKind = 'patient' | 'code' | 'plain';

export interface ComboboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'onSelect' | 'style' | 'size'
> {
  /** Visible label; required */
  label: string;
  /** 'patient' (avatar per row) | 'code' (code chip) | 'plain'; default 'plain' */
  kind?: ComboboxKind;
  /** Array<{value?, label, meta?, code?, flag?, flagTone?}>; required */
  options: ComboboxOption[];
  /** Example text in the empty input; default none */
  placeholder?: string;
  /** Controlled query text; default undefined (uncontrolled) */
  query?: string;
  /** Initial query (uncontrolled); default "" */
  defaultQuery?: string;
  /** Called when the query text changes */
  onQueryChange?: (query: string) => void;
  /** Controlled open state of the list; default undefined (uncontrolled) */
  open?: boolean;
  /** Open on first render (uncontrolled); default false */
  defaultOpen?: boolean;
  /** Called when the list opens or closes */
  onOpenChange?: (open: boolean) => void;
  /** Called with the chosen option; default none */
  onSelect?: (option: ComboboxOption) => void;
  /** Maximum results shown; default 8 */
  limit?: number;
  /** Text when nothing matches; default "No matches. Check the spelling or search by MRN." */
  emptyText?: string;
  /** Node under the list ("Search all 4,212 patients"); default none */
  footer?: ReactNode;
  /** Error message (as TextField); default none */
  error?: string;
  /** Muted hint under the field; default none */
  helper?: string;
  /** Red asterisk plus aria-required; default false */
  required?: boolean;
  /** Inline style of the root */
  style?: CSSProperties;
}

const optionKey = (o: ComboboxOption) => o.value ?? o.code ?? o.label;

/**
 * Combobox is a search field with a result list, for finding a patient or an ICD-10 or CPT code.
 * ARIA combobox pattern: arrows move, Enter picks, Escape closes (or clears when closed).
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    label,
    kind = 'plain',
    options,
    placeholder,
    query: queryProp,
    defaultQuery = '',
    onQueryChange,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    onSelect,
    limit = 8,
    emptyText = 'No matches. Check the spelling or search by MRN.',
    footer,
    error,
    helper,
    required = false,
    disabled,
    readOnly,
    className,
    style,
    id: idProp,
    onFocus,
    onKeyDown,
    'aria-describedby': describedByProp,
    ...rest
  },
  ref
) {
  const id = useDomId('cb', idProp);
  const listId = `${id}-lb`;
  const [query, setQuery] = useControllableState(queryProp, defaultQuery, onQueryChange);
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useDismiss(wrapRef, open, () => setOpen(false));

  const ql = query.toLowerCase();
  const list = options
    .filter((o) => !ql || `${o.label} ${o.meta ?? ''} ${o.code ?? ''}`.toLowerCase().includes(ql))
    .slice(0, limit);
  const act = Math.min(active, Math.max(list.length - 1, 0));
  const interactive = !disabled && !readOnly;

  const choose = (o: ComboboxOption) => {
    setQuery(kind === 'code' && o.code ? `${o.code} ${o.label}` : o.label);
    setOpen(false);
    onSelect?.(o);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || !interactive) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        if (!e.altKey) setActive(0);
      } else if (list.length) setActive((act + 1) % list.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setActive(Math.max(list.length - 1, 0));
      } else if (list.length) setActive((act - 1 + list.length) % list.length);
    } else if (e.key === 'Home' && open && list.length && e.ctrlKey) {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End' && open && list.length && e.ctrlKey) {
      e.preventDefault();
      setActive(list.length - 1);
    } else if (e.key === 'Enter' && open && list[act]) {
      e.preventDefault();
      choose(list[act]);
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
      } else if (query) {
        e.preventDefault();
        setQuery('');
      }
    } else if (e.key === 'Tab' && open) {
      setOpen(false);
    }
  };

  const activeId = open && list[act] ? `${id}-o${act}` : undefined;

  return (
    <Field id={id} label={label} required={required} error={error} helper={helper} className={className} style={style}>
      <div className="co-mwrap co-cbx" ref={wrapRef}>
        <div className="co-inpwrap has-icon">
          <Icon name="search" size={16} className="co-inp-ic" />
          <input
            ref={ref}
            id={id}
            className={cx('co-inp', error && 'is-bad')}
            role="combobox"
            type="text"
            autoComplete="off"
            aria-expanded={open && list.length > 0}
            aria-controls={open && list.length ? listId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={activeId}
            aria-invalid={error ? true : undefined}
            aria-required={required || undefined}
            aria-describedby={fieldDescribedBy(id, { error, helper }, describedByProp)}
            placeholder={placeholder}
            value={query}
            disabled={disabled}
            readOnly={readOnly}
            onFocus={(e) => {
              onFocus?.(e);
              if (interactive) setOpen(true);
            }}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActive(0);
            }}
            onKeyDown={handleKeyDown}
            {...rest}
          />
        </div>
        {open ? (
          <div className="co-menu co-menu-left co-cbx-list">
            {list.length ? (
              <div id={listId} role="listbox" aria-labelledby={`${id}-label`}>
                {list.map((o, i) => (
                  <div
                    key={optionKey(o)}
                    id={`${id}-o${i}`}
                    role="option"
                    aria-selected={i === act}
                    className={cx('co-mi', i === act && 'is-act')}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      choose(o);
                    }}
                    onMouseEnter={() => setActive(i)}
                  >
                    {kind === 'patient' ? (
                      <Avatar name={o.label} size="sm" aria-hidden="true" />
                    ) : kind === 'code' && o.code ? (
                      <span className="co-code">{o.code}</span>
                    ) : null}
                    <span className="co-mi-l">
                      {o.label}
                      {o.meta ? <span className="co-mi-s">{o.meta}</span> : null}
                    </span>
                    {o.flag ? <Badge tone={o.flagTone ?? 'danger'}>{o.flag}</Badge> : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="co-menu-h" role="status">
                {emptyText}
              </div>
            )}
            {footer ? <div className="co-menu-foot">{footer}</div> : null}
          </div>
        ) : null}
      </div>
    </Field>
  );
});
