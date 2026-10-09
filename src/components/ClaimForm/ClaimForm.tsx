import type { HTMLAttributes, InputHTMLAttributes } from "react";
import { cx } from "../../internal/cx";
import { useControllableState, useDomId } from "../../internal/hooks";
import { Alert } from "../Alert/Alert";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";
import { SplitButton } from "../SplitButton/SplitButton";

/** Editable fields of a service line. */
export type ClaimLineField = "dos" | "cpt" | "mods" | "dx" | "units" | "charge";

/** One service line. */
export interface ClaimLine {
  /** Date of service, MM/DD/YYYY */
  dos?: string;
  /** CPT or HCPCS code */
  cpt?: string;
  /** Modifiers ("25, 95"); default none */
  mods?: string;
  /** Diagnosis pointers ("A,B"); default none */
  dx?: string;
  /** Units; empty counts as 1 */
  units?: number | string;
  /** Charge per unit in dollars */
  charge?: number | string;
  /** Error message per field from the claim check; default none */
  errors?: Partial<Record<ClaimLineField, string>>;
}

/** What the Submit Claim split button asked for. */
export type ClaimSubmitAction = "submit" | "submit-print" | "hold";

export interface ClaimFormProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "onSubmit"
> {
  /** Service lines (controlled): Array<{dos, cpt, mods?, dx?, units, charge, errors?: Record<field, string>}>; default uncontrolled */
  lines?: ClaimLine[];
  /** Initial service lines (uncontrolled); default [] */
  defaultLines?: ClaimLine[];
  /** 'Primary' | 'Secondary' | 'Tertiary' (SBR01); default 'Primary' */
  payerOrder?: "Primary" | "Secondary" | "Tertiary";
  /** Claim frequency (CLM05-3), such as "7 Corrected"; default '1 Original' */
  frequency?: string;
  /** Claim check error count; 0 shows "Claim check passed"; default 0 */
  errorsCount?: number;
  /** Lock banner, read-only inputs, no buttons; default false */
  readOnly?: boolean;
  /** Lock banner text when readOnly; default "Your role can view this claim but not edit it." */
  lockText?: string;
  /** Called with all lines after an edit, add or remove; default none */
  onChange?: (lines: ClaimLine[]) => void;
  /** Save Draft; default none */
  onSaveDraft?: () => void;
  /** Submit Claim and its menu items; default none */
  onSubmit?: (action: ClaimSubmitAction) => void;
}

/** Formats a dollar amount as "$182.00". */
function money(n: unknown): string {
  return `$${(Number(n) || 0).toFixed(2)}`;
}

const lineTotal = (l: ClaimLine) =>
  (Number(l.charge) || 0) * (Number(l.units) || 1);

const COLUMNS: Array<{
  key: ClaimLineField;
  name: string;
  extra?: InputHTMLAttributes<HTMLInputElement>;
}> = [
  { key: "dos", name: "DOS", extra: { placeholder: "MM/DD/YYYY" } },
  { key: "cpt", name: "CPT / HCPCS" },
  { key: "mods", name: "Modifiers", extra: { placeholder: "25, 95" } },
  { key: "dx", name: "Dx pointer", extra: { placeholder: "A,B" } },
  { key: "units", name: "Units", extra: { inputMode: "numeric" } },
  { key: "charge", name: "Charge", extra: { inputMode: "decimal" } },
];

/** ClaimForm is the claim line-item editor: DOS, CPT, modifiers, diagnosis pointers, units and charge per line, with totals, claim check and submit. */
export function ClaimForm({
  lines: linesProp,
  defaultLines = [],
  payerOrder = "Primary",
  frequency = "1 Original",
  errorsCount = 0,
  readOnly = false,
  lockText = "Your role can view this claim but not edit it.",
  onChange,
  onSaveDraft,
  onSubmit,
  className,
  ...rest
}: ClaimFormProps) {
  const [lines, setLines] = useControllableState(
    linesProp,
    defaultLines,
    onChange,
  );
  const baseId = useDomId("co-claim");
  const ro = readOnly;
  const total = lines.reduce((a, l) => a + lineTotal(l), 0);

  const upd = (i: number, k: ClaimLineField, v: string) => {
    const n = lines.slice();
    n[i] = { ...n[i], [k]: v };
    setLines(n);
  };

  return (
    <div className={cx("co-dt", className)} {...rest}>
      {ro ? <Alert tone="lock">{lockText}</Alert> : null}
      <div className="co-row">
        <Badge tone="info">{`Payer order: ${payerOrder}`}</Badge>
        <Badge>{`Frequency: ${frequency}`}</Badge>
        {errorsCount ? (
          <Badge tone="danger" icon="alert">{`${errorsCount} errors`}</Badge>
        ) : (
          <Badge tone="success" icon="check">
            Claim check passed
          </Badge>
        )}
        <b className="co-ml">{`Total charge ${money(total)}`}</b>
      </div>
      <div className="co-tbx">
        <table className="co-table">
          <caption className="co-sr">Service lines</caption>
          <thead>
            <tr>
              <th className="co-th-plain" scope="col">
                #
              </th>
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={cx(
                    "co-th-plain",
                    (c.key === "units" || c.key === "charge") && "co-num",
                  )}
                >
                  {c.name}
                </th>
              ))}
              <th className="co-th-plain co-num" scope="col">
                Line total
              </th>
              <th className="co-th-plain co-td-x" scope="col">
                <span className="co-sr">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                {COLUMNS.map((c) => {
                  const err = l.errors?.[c.key];
                  const errId = `${baseId}-${i}-${c.key}-err`;
                  const v = l[c.key];
                  return (
                    <td key={c.key}>
                      <input
                        className={cx(
                          "co-inp co-inp-sm",
                          `co-cf-${c.key}`,
                          err && "is-bad",
                          ro && "is-ro",
                        )}
                        value={v == null ? "" : String(v)}
                        readOnly={ro}
                        aria-label={`${c.name} line ${i + 1}`}
                        aria-invalid={err ? true : undefined}
                        aria-describedby={err ? errId : undefined}
                        title={err}
                        onChange={(e) => upd(i, c.key, e.target.value)}
                        {...c.extra}
                      />
                      {err ? (
                        <div className="co-errt" id={errId}>
                          {err}
                        </div>
                      ) : null}
                    </td>
                  );
                })}
                <td className="co-num">{money(lineTotal(l))}</td>
                <td className="co-td-x">
                  {ro ? null : (
                    <IconButton
                      icon="trash"
                      variant="danger"
                      size="sm"
                      label={`Remove line ${i + 1}`}
                      onClick={() => setLines(lines.filter((_, j) => j !== i))}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {ro ? null : (
        <div className="co-row co-gap-8">
          <Button
            size="sm"
            iconLeft="plus"
            disabled={lines.length >= 50}
            onClick={() =>
              setLines([
                ...lines,
                {
                  dos: lines.length ? lines[lines.length - 1]!.dos : "",
                  units: 1,
                },
              ])
            }
          >
            Add Service Line
          </Button>
          <span className="co-help co-cf-help">
            Up to 50 lines. Each line points to up to 4 diagnoses (A to L).
          </span>
          <div className="co-ml co-row co-gap-8">
            <Button onClick={onSaveDraft}>Save Draft</Button>
            <SplitButton
              label="Submit Claim"
              menuLabel="More submit options"
              onClick={() => onSubmit?.("submit")}
              items={[
                {
                  label: "Submit and Print CMS-1500",
                  onSelect: () => onSubmit?.("submit-print"),
                },
                {
                  label: "Hold for Review",
                  onSelect: () => onSubmit?.("hold"),
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}
