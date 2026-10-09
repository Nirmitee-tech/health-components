import { forwardRef, useRef, useState, type HTMLAttributes, type KeyboardEvent } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';
import { Avatar } from '../Avatar/Avatar';
import { Icon, type IconName } from '../Icon/Icon';

/** One open chart (or a pinned screen such as Schedule). */
export interface PatientTab {
  /** Unique id; what `active` matches */
  id: string;
  /** Patient name or screen name */
  name: string;
  /** Sex and age ("F 38") so similar names are told apart; default none */
  meta?: string;
  /** Icon instead of the initials avatar (screens); default none */
  icon?: IconName;
  /** Cannot be closed; default false */
  pinned?: boolean;
}

export interface PatientTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Open tabs. Required. */
  tabs: PatientTab[];
  /** Active tab id (controlled); default uncontrolled */
  active?: string;
  /** Initially active tab id when uncontrolled; default the first tab */
  defaultActive?: string;
  /** Called with the newly active tab id; default none */
  onChange?: (id: string) => void;
  /** Called when a tab is closed (x button or Delete key). The tab is also hidden internally; default none */
  onClose?: (tab: PatientTab) => void;
  /** Add (+) button handler; default none */
  onAdd?: () => void;
  /** Accessible name of the add button; default "Open another patient" */
  addLabel?: string;
}

/** PatientTabs keep several open patients as closable tabs across the top, like a browser, in the Focus Rail style. */
export const PatientTabs = forwardRef<HTMLDivElement, PatientTabsProps>(function PatientTabs(
  { tabs, active, defaultActive, onChange, onClose, onAdd, addLabel = 'Open another patient', className, id, ...rest },
  ref
) {
  const base = useDomId('ptab', id);
  const [closed, setClosed] = useState<string[]>([]);
  const shown = tabs.filter((t) => !closed.includes(t.id));
  const [act, setAct] = useControllableState(active, defaultActive ?? tabs[0]?.id ?? '', onChange);
  const focusId = shown.some((t) => t.id === act) ? act : shown[0]?.id;
  const btns = useRef<Record<string, HTMLButtonElement | null>>({});

  const close = (t: PatientTab) => {
    const i = shown.findIndex((x) => x.id === t.id);
    const rest2 = shown.filter((x) => x.id !== t.id);
    setClosed((c) => [...c, t.id]);
    onClose?.(t);
    if (t.id === act && rest2.length) {
      const next = rest2[Math.min(i, rest2.length - 1)]!;
      setAct(next.id);
      btns.current[next.id]?.focus();
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, t: PatientTab) => {
    const i = shown.findIndex((x) => x.id === t.id);
    let next: PatientTab | undefined;
    if (e.key === 'ArrowRight') next = shown[(i + 1) % shown.length];
    else if (e.key === 'ArrowLeft') next = shown[(i - 1 + shown.length) % shown.length];
    else if (e.key === 'Home') next = shown[0];
    else if (e.key === 'End') next = shown[shown.length - 1];
    else if (e.key === 'Delete' && !t.pinned) {
      e.preventDefault();
      close(t);
      return;
    }
    if (!next) return;
    e.preventDefault();
    setAct(next.id);
    btns.current[next.id]?.focus();
  };

  return (
    <div ref={ref} id={id} className={cx('co-ptabs-bar', className)} {...rest}>
      <div className="co-ptabs-list" role="tablist" aria-label="Open patients">
        {shown.map((t) => {
          const on = t.id === act;
          return (
            <div key={t.id} className={cx('co-pt', on && 'is-on')}>
              <button
                ref={(el) => {
                  btns.current[t.id] = el;
                }}
                id={`${base}-${t.id}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-keyshortcuts={t.pinned ? undefined : 'Delete'}
                aria-description={t.pinned ? undefined : 'Press Delete to close'}
                tabIndex={t.id === focusId ? 0 : -1}
                className="co-pt-l"
                onClick={() => {
                  if (!on) setAct(t.id);
                }}
                onKeyDown={(e) => onKeyDown(e, t)}
              >
                {t.icon ? <Icon name={t.icon} size={14} /> : <Avatar name={t.name} size="xs" aria-hidden="true" />}
                <span>{t.name}</span>
                {t.meta ? <span className="co-mi-s co-pt-m">{t.meta}</span> : null}
              </button>
              {t.pinned ? null : (
                // Pointer shortcut; keyboard and screen-reader users close the focused tab with Delete (ARIA tabs pattern),
                // so the button stays out of the tab order and the tablist only contains tabs.
                <button
                  type="button"
                  className="co-pt-x"
                  aria-hidden="true"
                  tabIndex={-1}
                  title={`Close ${t.name}`}
                  onClick={() => close(t)}
                >
                  <Icon name="x" size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>
      <button type="button" className="co-pt-add" aria-label={addLabel} title={addLabel} onClick={onAdd}>
        +
      </button>
    </div>
  );
});
