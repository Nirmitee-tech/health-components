import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useDomId } from '../../internal/hooks';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';
import { Overlay, useOverlay } from '../Modal/Modal';

/** One section of the "For developers" drawer: prose `body` or monospaced `code`. */
export interface DrawerSection {
  /** Section heading, such as "Purpose and roles", "API", "States" */
  title: string;
  /** Prose body; line breaks are kept */
  body?: ReactNode;
  /** Code block (API calls, payloads), shown in mono */
  code?: string;
}

export type DrawerSide = 'right' | 'bottom';

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Whether the drawer is shown; default true */
  open?: boolean;
  /** Drawer title; names the dialog. Required. */
  title: string;
  /** 'right' panel or 'bottom' sheet (phones); default 'right' */
  side?: DrawerSide;
  /** The "For developers" panel: code icon, "For developers: <title>"; default false */
  developer?: boolean;
  /** Developer drawer sections; replace `children` when `developer` is set; default none */
  sections?: DrawerSection[];
  /** Body; default none */
  children?: ReactNode;
  /** Footer actions; default none */
  footer?: ReactNode;
  /** Panel width in px; default 560 (from CSS) */
  width?: number;
  /** Called by the x button, Escape and a scrim press; default none */
  onClose?: () => void;
  /** Render in place for docs: no portal, focus trap, scroll lock or Escape; default false */
  inline?: boolean;
}

/** Drawer slides a panel in from the right for detail and secondary forms, including the "For developers" panel, or up from the bottom on phones. */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  {
    open = true,
    title,
    side = 'right',
    developer = false,
    sections,
    children,
    footer,
    width,
    onClose,
    inline = false,
    className,
    style,
    id,
    ...rest
  },
  ref
) {
  const titleId = useDomId('drw', id ? `${id}-title` : undefined);
  const panelRef = useOverlay<HTMLDivElement>(open, inline, onClose, ref);
  if (!open) return null;
  const bottom = side === 'bottom';
  return (
    <Overlay inline={inline} side={bottom ? 'bottom' : 'right'} onScrimPress={onClose}>
      <div
        ref={panelRef}
        id={id}
        className={cx(bottom ? 'co-sheet' : 'co-drawer', developer && 'co-dev', className)}
        role="dialog"
        aria-modal={inline ? undefined : true}
        aria-labelledby={titleId}
        style={width ? { width: `min(${width}px,100%)`, ...style } : style}
        {...rest}
      >
        {bottom ? <span className="co-grab" aria-hidden="true" /> : null}
        <div className="co-mh">
          <h2 id={titleId}>
            {developer ? <Icon name="code" size={18} /> : null}
            {developer ? `For developers: ${title}` : title}
          </h2>
          <IconButton icon="x" label={developer ? 'Close developer panel' : 'Close'} size="sm" onClick={onClose} />
        </div>
        <div className="co-mb">
          {developer && sections
            ? sections.map((s, i) => (
                <div key={i} className="co-devsec">
                  <h3>{s.title}</h3>
                  {s.code ? <pre className="co-code-b">{s.code}</pre> : <div>{s.body}</div>}
                </div>
              ))
            : children}
        </div>
        {footer ? <div className="co-mf">{footer}</div> : null}
      </div>
    </Overlay>
  );
});
