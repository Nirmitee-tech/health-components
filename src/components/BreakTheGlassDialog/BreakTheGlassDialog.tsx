import { forwardRef, useState, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';
import { Alert } from '../Alert/Alert';
import { Button } from '../Button/Button';
import { DescriptionList } from '../DescriptionList/DescriptionList';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';
import { Overlay, useOverlay } from '../Modal/Modal';
import { RadioGroup } from '../Radio/Radio';
import { TextArea } from '../TextArea/TextArea';

/** The access reasons offered, in order. "Other" asks for a written explanation. */
export const breakTheGlassReasons = [
  'Emergency treatment',
  'Covering for the care team',
  'Patient asked me to help',
  'Other',
] as const;

/** What the user gave as the reason for access, passed to `onConfirm`. */
export interface BreakTheGlassAccess {
  /** The chosen reason, one of `breakTheGlassReasons` */
  reason: string;
  /** The explanation typed for "Other"; "" otherwise */
  note: string;
}

export interface BreakTheGlassDialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Patient name. Required */
  patient: string;
  /** Date of birth. Required */
  dob: string;
  /** Care team members who can open the chart without a reason. Required */
  careTeam: string;
  /** Why the chart is restricted (Alert body); default "This chart contains behavioral health records. Only the care team can open it without a reason." */
  reason?: string;
  /** Initial explanation in the "Other" box; default none */
  note?: string;
  /** Called by "Open Chart and Log Access" with the reason and explanation; default none */
  onConfirm?: (access: BreakTheGlassAccess) => void;
  /** Called by Cancel, the x button and Escape; default none */
  onClose?: () => void;
  /** Whether the dialog is shown; default true */
  open?: boolean;
  /** Chosen access reason (controlled); default undefined (uncontrolled, nothing pre-selected) */
  accessReason?: string;
  /** Called with the chosen access reason; default none */
  onAccessReasonChange?: (reason: string) => void;
  /** Shows a spinner on the confirm button while access is logged; default false */
  loading?: boolean;
  /** Render in place for docs: no portal, focus trap, scroll lock or Escape; default false */
  inline?: boolean;
}

const DEFAULT_REASON = 'This chart contains behavioral health records. Only the care team can open it without a reason.';

/** BreakTheGlassDialog asks for a reason before opening a restricted chart and says the access is logged. */
export const BreakTheGlassDialog = forwardRef<HTMLDivElement, BreakTheGlassDialogProps>(function BreakTheGlassDialog(
  {
    patient,
    dob,
    careTeam,
    reason = DEFAULT_REASON,
    note: initialNote = '',
    onConfirm,
    onClose,
    open = true,
    accessReason,
    onAccessReasonChange,
    loading = false,
    inline = false,
    className,
    id,
    ...rest
  },
  ref
) {
  const base = useDomId('btg', id);
  const titleId = `${base}-title`;
  const [r, setR] = useControllableState(accessReason, '', onAccessReasonChange);
  const [note, setNote] = useState(initialNote);
  const panelRef = useOverlay<HTMLDivElement>(open, inline, onClose, ref);
  if (!open) return null;
  const other = r === 'Other';
  const ready = !!r && (!other || note.trim() !== '');

  return (
    <Overlay inline={inline}>
      <div
        ref={panelRef}
        id={id}
        className={cx('co-modal', 'co-modal-destructive', 'co-btg', className)}
        role="alertdialog"
        aria-modal={inline ? undefined : true}
        aria-labelledby={titleId}
        {...rest}
      >
        <div className="co-mh">
          <h2 id={titleId}>
            <Icon name="alert" size={18} className="co-dng-ic" />
            Break the glass to open this chart
          </h2>
          <IconButton icon="x" label="Close" size="sm" onClick={onClose} />
        </div>
        <div className="co-mb">
          <Alert tone="btg" title="Restricted chart">
            {reason}
          </Alert>
          <DescriptionList
            compact
            items={[
              ['Patient', patient],
              ['Date of birth', dob],
              ['Care team', careTeam],
            ]}
          />
          <RadioGroup
            label="Why do you need access?"
            required
            value={r}
            onChange={setR}
            options={breakTheGlassReasons}
          />
          {other ? <TextArea label="Explain" required value={note} onChange={(v) => setNote(v)} /> : null}
          <span className="co-help">
            Your name, the reason and every page you view are logged and reviewed by the Privacy Officer within 24 hours.
          </span>
        </div>
        <div className="co-mf">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="danger-solid"
            disabled={!ready}
            loading={loading}
            onClick={() => onConfirm?.({ reason: r, note: other ? note : '' })}
          >
            Open Chart and Log Access
          </Button>
        </div>
      </div>
    </Overlay>
  );
});
