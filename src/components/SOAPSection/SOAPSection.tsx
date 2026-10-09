import { forwardRef, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { AISuggestion } from '../AISuggestion/AISuggestion';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Popover } from '../Menu/Menu';
import { TextArea } from '../TextArea/TextArea';

export interface SOAPSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onChange' | 'defaultValue'> {
  /** Section title ("Subtitle", "Plan"); also names the textarea. Required */
  title: string;
  /** Initial section text (uncontrolled); default "" */
  text?: string;
  /** Controlled section text; default undefined (uncontrolled) */
  value?: string;
  /** Called with the new text (typing, smart phrase, accepted AI draft); default none */
  onChange?: (text: string) => void;
  /** AI Scribe draft shown above the textarea with Accept and Edit; default none */
  ai?: string;
  /** Called after the AI draft is accepted into the text; default none */
  onAcceptAI?: (draft: string) => void;
  /** Smart phrases offered in the Insert popover (string[]); default none */
  macros?: string[];
  /** Called with the smart phrase inserted into the text; default none */
  onInsertMacro?: (macro: string) => void;
  /** Shows the Required tag and marks the textarea required; default false */
  required?: boolean;
  /** Error message under the textarea; default none */
  error?: string;
  /** Read-only lock state of the textarea; default false */
  readOnly?: boolean;
  /** Textarea rows; default 3 */
  rows?: number;
  /** Custom content that replaces the textarea, such as a ScoreQuestionnaire; default none */
  children?: ReactNode;
}

function append(text: string, addition: string): string {
  if (!text) return addition;
  return /\s$/.test(text) ? text + addition : `${text} ${addition}`;
}

/** SOAPSection is one note section with AI draft, smart-phrase insert, required tag and error, or custom content. */
export const SOAPSection = forwardRef<HTMLElement, SOAPSectionProps>(function SOAPSection(
  {
    title,
    text = '',
    value: valueProp,
    onChange,
    ai,
    onAcceptAI,
    macros,
    onInsertMacro,
    required = false,
    error,
    readOnly = false,
    rows = 3,
    children,
    className,
    ...rest
  },
  ref
) {
  const [value, setValue] = useControllableState(valueProp, text, onChange);
  const [macrosOpen, setMacrosOpen] = useState(false);
  const [draftDone, setDraftDone] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement | null>(null);
  const editable = !readOnly && children == null;

  const actions =
    required || (macros && macros.length && editable) ? (
      <>
        {required ? (
          <Badge tone="outline" size="sm">
            Required
          </Badge>
        ) : null}
        {macros && macros.length && editable ? (
          <Popover
            trigger="Insert"
            title="Smart phrases"
            open={macrosOpen}
            onOpenChange={setMacrosOpen}
            label={`Insert smart phrase into ${title}`}
          >
            {macros.map((m) => (
              <Button
                key={m}
                size="sm"
                variant="tertiary"
                onClick={() => {
                  setValue(append(value, m));
                  onInsertMacro?.(m);
                  setMacrosOpen(false);
                }}
              >
                {m}
              </Button>
            ))}
          </Popover>
        ) : null}
      </>
    ) : null;

  const takeDraft = (focus: boolean) => {
    if (!ai) return;
    setValue(ai);
    setDraftDone(true);
    if (focus) {
      // Focus after React re-renders the textarea with the draft.
      setTimeout(() => areaRef.current?.focus(), 0);
    } else onAcceptAI?.(ai);
  };

  return (
    <Card ref={ref} title={title} padding="compact" actions={actions} className={cx('co-soap', className)} {...rest}>
      {ai && !draftDone && editable ? (
        <AISuggestion
          title="AI Scribe draft"
          actions={
            <>
              <Button size="sm" variant="ai" onClick={() => takeDraft(false)}>
                Accept
              </Button>
              <Button size="sm" onClick={() => takeDraft(true)}>
                Edit
              </Button>
            </>
          }
        >
          {ai}
        </AISuggestion>
      ) : null}
      {children ?? (
        <TextArea
          ref={areaRef}
          label=""
          aria-label={title}
          value={value}
          onChange={(v) => setValue(v)}
          rows={rows}
          readOnly={readOnly}
          required={required}
          error={error}
        />
      )}
    </Card>
  );
});
