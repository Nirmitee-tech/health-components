import { useRef, useState, type HTMLAttributes } from "react";
import { cx } from "../../internal/cx";
import { useControllableState } from "../../internal/hooks";
import { AISuggestion } from "../AISuggestion/AISuggestion";
import { Alert } from "../Alert/Alert";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";
import { Combobox } from "../Combobox/Combobox";
import { Icon } from "../Icon/Icon";
import { TextArea } from "../TextArea/TextArea";

/** One note section (template section). */
export interface VisitNoteSection {
  /** Stable id ("s", "subjective") */
  id: string;
  /** Section title; also names its textarea */
  title: string;
  /** Initial text; default "" */
  text?: string;
  /** AI Scribe draft shown above the field with Accept and Edit; default none */
  ai?: string;
  /** Shows a Required badge; default false */
  required?: boolean;
  /** Error message under the field; default none */
  error?: string;
  /** Visible rows; default 3 */
  rows?: number;
}

/** An ICD-10 or CPT code on the note. */
export interface VisitNoteCode {
  /** Code ("E11.9", "99214") */
  code: string;
  /** Description */
  label: string;
}

export interface VisitNoteEditorProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  /** Array<{id, title, text?, ai?, required?, error?, rows?}>; required */
  sections: VisitNoteSection[];
  /** Diagnoses on the note (controlled); default uncontrolled */
  diagnoses?: VisitNoteCode[];
  /** Initial diagnoses (uncontrolled); default [] */
  defaultDiagnoses?: VisitNoteCode[];
  /** Called when a diagnosis is added or removed; default none */
  onDiagnosesChange?: (codes: VisitNoteCode[]) => void;
  /** Procedures on the note (controlled); default uncontrolled */
  procedures?: VisitNoteCode[];
  /** Initial procedures (uncontrolled); default [] */
  defaultProcedures?: VisitNoteCode[];
  /** Called when a procedure is added or removed; default none */
  onProceduresChange?: (codes: VisitNoteCode[]) => void;
  /** ICD-10 search options: Array<{code, label}>; default [] */
  icdOptions?: VisitNoteCode[];
  /** CPT search options: Array<{code, label}>; default [] */
  cptOptions?: VisitNoteCode[];
  /** Heading; default "Visit Note" */
  title?: string;
  /** Date, place and template line ("10/09/2026 10:30 AM . Main Street Clinic . Primary Care SOAP"); default none */
  meta?: string;
  /** Signed and locked (controlled); default uncontrolled */
  signed?: boolean;
  /** Initially signed (uncontrolled); default false */
  defaultSigned?: boolean;
  /** Lock banner for roles without Edit clinical chart; default false */
  readOnly?: boolean;
  /** Lock banner text when readOnly; default "Your role can view this note but not edit it." */
  lockText?: string;
  /** Sign Note; default none */
  onSign?: () => void;
  /** Shows Draft with AI Scribe, which calls this; default none */
  onAiDraft?: () => void;
  /** Save Draft; default none */
  onSaveDraft?: () => void;
  /** Called with the section id and its new text as the user types or accepts an AI draft; default none */
  onSectionChange?: (id: string, text: string) => void;
}

const chipStyle = {
  background: "var(--co-primary-soft)",
  color: "var(--co-primary-strong)",
  borderColor: "var(--co-primary-line)",
};

/** VisitNoteEditor is the section-by-section visit note with AI Scribe drafts and ICD-10 and CPT search, from Draft to Signed. */
export function VisitNoteEditor({
  sections,
  diagnoses,
  defaultDiagnoses = [],
  onDiagnosesChange,
  procedures,
  defaultProcedures = [],
  onProceduresChange,
  icdOptions = [],
  cptOptions = [],
  title = "Visit Note",
  meta,
  signed,
  defaultSigned = false,
  readOnly = false,
  lockText = "Your role can view this note but not edit it.",
  onSign,
  onAiDraft,
  onSaveDraft,
  onSectionChange,
  className,
  ...rest
}: VisitNoteEditorProps) {
  const [isSigned, setSigned] = useControllableState(signed, defaultSigned);
  const [dx, setDx] = useControllableState(
    diagnoses,
    defaultDiagnoses,
    onDiagnosesChange,
  );
  const [px, setPx] = useControllableState(
    procedures,
    defaultProcedures,
    onProceduresChange,
  );
  const [texts, setTexts] = useState<Record<string, string>>(() =>
    Object.fromEntries(sections.map((s) => [s.id, s.text ?? ""])),
  );
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const fieldRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const ro = isSigned || readOnly;

  const setText = (id: string, text: string) => {
    setTexts((t) => ({ ...t, [id]: text }));
    onSectionChange?.(id, text);
  };
  const acceptAi = (s: VisitNoteSection, focus: boolean) => {
    const prev = texts[s.id] ?? s.text ?? "";
    setText(s.id, prev ? `${prev}\n${s.ai}` : (s.ai ?? ""));
    setAccepted((a) => ({ ...a, [s.id]: true }));
    if (focus) fieldRefs.current[s.id]?.focus();
  };

  const codeList = (
    list: VisitNoteCode[],
    set: (next: VisitNoteCode[]) => void,
    name: string,
  ) =>
    list.length ? (
      <ul className="co-row co-gap-6 co-vne-codes" aria-label={name}>
        {list.map((c, i) => (
          <li
            key={c.code}
            className="co-chipb is-on co-chip-rm"
            style={chipStyle}
          >
            <span
              className="co-code"
              style={{ background: "var(--co-surface)" }}
            >
              {c.code}
            </span>
            {c.label}
            {ro ? null : (
              <button
                type="button"
                aria-label={`Remove ${c.code}`}
                onClick={() => set(list.filter((_, j) => j !== i))}
              >
                <Icon name="x" size={14} />
              </button>
            )}
          </li>
        ))}
      </ul>
    ) : null;

  const addCode =
    (list: VisitNoteCode[], set: (next: VisitNoteCode[]) => void) =>
    (o: { code?: string; label: string }) => {
      if (o.code && !list.some((d) => d.code === o.code))
        set([...list, { code: o.code, label: o.label }]);
    };

  return (
    <div className={cx("co-note", className)} {...rest}>
      <div className="co-row">
        <h2>{title}</h2>
        <Badge
          tone={isSigned ? "success" : "warning"}
          icon={isSigned ? "check" : "clock"}
        >
          {isSigned ? "Signed" : "Draft"}
        </Badge>
        {meta ? <span className="co-muted">{meta}</span> : null}
        <div className="co-ml co-row co-gap-8">
          {onAiDraft && !ro ? (
            <Button
              variant="ai"
              iconLeft="sparkle"
              size="sm"
              onClick={onAiDraft}
            >
              Draft with AI Scribe
            </Button>
          ) : null}
          {ro ? null : (
            <Button size="sm" onClick={onSaveDraft}>
              Save Draft
            </Button>
          )}
          {ro ? null : (
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                setSigned(true);
                onSign?.();
              }}
            >
              Sign Note
            </Button>
          )}
        </div>
      </div>
      {readOnly ? (
        <Alert tone="lock">{lockText}</Alert>
      ) : isSigned ? (
        <Alert tone="note">
          Signed notes are locked. Add an addendum to change them.
        </Alert>
      ) : null}
      {sections.map((s) => (
        <Card
          key={s.id}
          title={s.title}
          padding="compact"
          actions={
            s.ai ? (
              <Badge tone="ai" icon="sparkle" size="sm">
                AI draft, review
              </Badge>
            ) : s.required ? (
              <Badge tone="outline" size="sm">
                Required
              </Badge>
            ) : null
          }
        >
          {s.ai && !ro && !accepted[s.id] ? (
            <AISuggestion
              title="AI Scribe draft"
              actions={
                <>
                  <Button
                    size="sm"
                    variant="ai"
                    onClick={() => acceptAi(s, false)}
                  >
                    Accept
                  </Button>
                  <Button size="sm" onClick={() => acceptAi(s, true)}>
                    Edit
                  </Button>
                </>
              }
            >
              {s.ai}
            </AISuggestion>
          ) : null}
          <TextArea
            ref={(el) => {
              fieldRefs.current[s.id] = el;
            }}
            label=""
            aria-label={s.title}
            value={texts[s.id] ?? s.text ?? ""}
            onChange={(v) => setText(s.id, v)}
            readOnly={ro}
            rows={s.rows ?? 3}
            error={s.error}
            required={s.required}
          />
        </Card>
      ))}
      <Card title="Assessment codes" padding="compact">
        <div className="co-lbl">Diagnoses (ICD-10)</div>
        {codeList(dx, setDx, "Diagnoses")}
        {ro ? null : (
          <Combobox
            label="Add diagnosis"
            kind="code"
            options={icdOptions}
            placeholder="Code or words, such as E11.9 or diabetes"
            onSelect={addCode(dx, setDx)}
          />
        )}
        <div className="co-lbl co-vne-lbl2">Procedures (CPT)</div>
        {codeList(px, setPx, "Procedures")}
        {ro ? null : (
          <Combobox
            label="Add procedure"
            kind="code"
            options={cptOptions}
            placeholder="Code or words, such as 99214"
            onSelect={addCode(px, setPx)}
          />
        )}
      </Card>
    </div>
  );
}
