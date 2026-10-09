import { forwardRef, useState, type HTMLAttributes } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { AcuteValue } from '../../internal/acute';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { DescriptionList, type DescriptionItem } from '../DescriptionList/DescriptionList';
import { Icon } from '../Icon/Icon';
import { TextArea } from '../TextArea/TextArea';

export type ProcedureTemplateKey = 'laceration repair' | 'central line' | 'lumbar puncture' | 'cesarean delivery';

/** A note template: the default procedure name and the template's own fields. */
export interface ProcedureTemplate {
  procedure: string;
  fields: readonly string[];
}

/** The built-in templates. */
export const PROCEDURE_TEMPLATES: Readonly<Record<ProcedureTemplateKey, ProcedureTemplate>> = {
  'laceration repair': { procedure: 'Laceration repair, simple', fields: ['Location and length', 'Anesthesia', 'Irrigation', 'Closure', 'Dressing'] },
  'central line': {
    procedure: 'Central venous catheter placement',
    fields: ['Site and side', 'Ultrasound guidance', 'Sterile barrier', 'Catheter', 'Confirmation'],
  },
  'lumbar puncture': {
    procedure: 'Lumbar puncture',
    fields: ['Position', 'Level', 'Needle', 'Opening pressure', 'CSF appearance', 'Tubes sent'],
  },
  'cesarean delivery': {
    procedure: 'Cesarean delivery, low transverse',
    fields: ['Indication', 'Anesthesia', 'Incision', 'Delivery', 'Placenta', 'Closure'],
  },
};

/** Note values. */
export interface ProcedureNoteValues {
  /** Default the template's procedure name */
  procedure?: string;
  indication?: string;
  performer?: string;
  consent?: string;
  /** Time out time 'HH:MM'; missing shows a red tag and blocks signing */
  timeout?: string;
  /** Minutes */
  duration?: number;
  /** Estimated blood loss, mL */
  ebl?: number;
  complications?: string;
  specimens?: string;
  date?: string;
  location?: string;
  signedAt?: string;
  /** Template field text by field name */
  details?: Record<string, string>;
}

export type ProcedureNoteStatus = 'draft' | 'signed';

export interface ProcedureNoteProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** 'laceration repair' | 'central line' | 'lumbar puncture' | 'cesarean delivery'; default 'laceration repair' */
  template?: ProcedureTemplateKey;
  /** Note values; default {} */
  values?: ProcedureNoteValues;
  /** 'draft' (template fields editable) | 'signed' (read-only); default 'draft' */
  status?: ProcedureNoteStatus;
  /** Addendum under a signed note {at, text}; default none */
  addendum?: { at: string; text: string };
  /** Called by Sign Note with the template field text; default none */
  onSign?: (details: Record<string, string>) => void;
  /** Called by Save Draft with the template field text; default none */
  onSaveDraft?: (details: Record<string, string>) => void;
  /** Called when a template field changes; default none */
  onDetailsChange?: (details: Record<string, string>) => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'ed' when no global context is set */
  rangeContext?: RangeContextId;
}

/**
 * ProcedureNote is a structured procedure note from a template (laceration repair, central line, lumbar puncture,
 * cesarean delivery): procedure, indication, consent, time out, EBL, complications, specimens and the template's own fields.
 */
export const ProcedureNote = forwardRef<HTMLElement, ProcedureNoteProps>(function ProcedureNote(
  {
    template = 'laceration repair',
    values,
    status = 'draft',
    addendum,
    onSign,
    onSaveDraft,
    onDetailsChange,
    rangeContext,
    ...rest
  },
  ref
) {
  const t = Object.prototype.hasOwnProperty.call(PROCEDURE_TEMPLATES, template)
    ? PROCEDURE_TEMPLATES[template]
    : PROCEDURE_TEMPLATES['laceration repair'];
  const vals = values || {};
  const signed = status === 'signed';
  const [details, setDetails] = useState<Record<string, string>>(() => ({ ...(vals.details || {}) }));
  const shown = signed ? vals.details || {} : details;

  const meta: DescriptionItem[] = [
    ['Procedure', vals.procedure || t.procedure],
    ['Indication', vals.indication || 'Not documented'],
    ['Performed by', vals.performer || 'Not documented'],
    ['Consent', vals.consent || 'Not documented'],
    [
      'Time out',
      vals.timeout ? (
        <span className="co-row co-gap-6">
          <Icon name="check" size={14} />
          <span className="co-ac-num">{'Completed ' + vals.timeout}</span>
        </span>
      ) : (
        <Badge tone="danger" size="sm" icon="alert">
          Time out not recorded
        </Badge>
      ),
    ],
    ['EBL', <AcuteValue key="ebl" measure="ebl" value={vals.ebl} missingText="Not recorded" />],
    ['Complications', vals.complications || 'None'],
    ['Specimens', vals.specimens || 'None'],
  ];
  if (vals.duration != null) meta.splice(5, 0, ['Duration', <AcuteValue key="dur" measure="duration" value={vals.duration} />]);
  const missing = !vals.timeout || !vals.consent;

  return (
    <Card
      ref={ref}
      title="Procedure Note"
      subtitle={(vals.date || '') + (vals.location ? ' . ' + vals.location : '') || undefined}
      actions={
        signed ? (
          <Badge tone="success" icon="lock">
            {'Signed ' + (vals.signedAt || '')}
          </Badge>
        ) : (
          <Badge tone="warning">Draft</Badge>
        )
      }
      footer={
        signed ? (
          <span className="co-mi-s">Signed notes change only by addendum.</span>
        ) : (
          <div className="co-row co-gap-8">
            <Button variant="primary" disabled={missing} onClick={() => onSign?.(details)}>
              Sign Note
            </Button>
            <Button onClick={() => onSaveDraft?.(details)}>Save Draft</Button>
            {missing ? <span className="co-help">Consent and time out are required to sign.</span> : null}
          </div>
        )
      }
      {...rest}
    >
      <RangeContextProvider value={rangeContext}>
        <DescriptionList items={meta} />
        <div className="co-pn-fields">
          {t.fields.map((f) =>
            signed ? (
              <div key={f}>
                <div className="co-kl">{f}</div>
                <div>{shown[f] || <span className="co-mi-s">Not documented</span>}</div>
              </div>
            ) : (
              <TextArea
                key={f}
                label={f}
                rows={2}
                value={details[f] || ''}
                onChange={(s) => {
                  const next = { ...details, [f]: s };
                  setDetails(next);
                  onDetailsChange?.(next);
                }}
              />
            )
          )}
        </div>
        {addendum ? (
          <Alert tone="note" title={'Addendum ' + addendum.at}>
            {addendum.text}
          </Alert>
        ) : null}
      </RangeContextProvider>
    </Card>
  );
});
