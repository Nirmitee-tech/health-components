import { forwardRef, type HTMLAttributes } from 'react';
import { CODE_SYSTEMS, code as formatCode, type CodeSystem, type CodeSystemKey } from '../../clinical';
import { cx } from '../../internal/cx';

export type CodeDisplaySystem = CodeSystemKey;
export type CodeDisplayVariant = 'inline' | 'stacked';

export interface CodeDisplayProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** 'icd10' | 'cpt' | 'hcpcs' | 'loinc' | 'snomed' | 'rxnorm' | 'ndc'; required */
  system: CodeDisplaySystem;
  /** The code; ICD-10 gets its dot and an 11-digit NDC shows 5-4-2; required */
  code: string;
  /** Description (use licensed short text for CPT); default none */
  display?: string;
  /** 'inline' (tag, code, description on one line) | 'stacked' (description below); default 'inline' */
  variant?: CodeDisplayVariant;
  /** Shows the system tag; default true */
  showSystem?: boolean;
  /** 'active' | 'inactive' (amber Inactive code note); default 'active' */
  status?: 'active' | 'inactive';
}

/**
 * CodeDisplay shows a clinical or billing code with its code system label and description: ICD-10-CM, CPT, HCPCS,
 * LOINC, SNOMED CT, RxNorm and NDC.
 */
export const CodeDisplay = forwardRef<HTMLSpanElement, CodeDisplayProps>(function CodeDisplay(
  { system, code, display, variant = 'inline', showSystem = true, status = 'active', className, ...rest },
  ref
) {
  const s: Partial<CodeSystem> & { label: string } = Object.prototype.hasOwnProperty.call(CODE_SYSTEMS, system)
    ? CODE_SYSTEMS[system]
    : { label: String(system) };
  const c = formatCode(system, code);
  const tag = showSystem ? (
    <abbr className="co-code-s" title={s.uri}>
      {s.label}
    </abbr>
  ) : null;
  const codeEl = <span className="co-mono co-code-c">{c}</span>;
  const inactive = status === 'inactive' ? <span className="co-af co-af-warning">Inactive code</span> : null;

  if (variant === 'stacked') {
    return (
      <span ref={ref} className={cx('co-cv-stack', className)} {...rest}>
        <span className="co-code co-code-disp">
          {tag}
          {codeEl}
          {inactive}
        </span>
        {display ? <span className="co-code-d">{display}</span> : null}
      </span>
    );
  }
  return (
    <span ref={ref} className={cx('co-code', 'co-code-disp', className)} {...rest}>
      {tag}
      {codeEl}
      {display ? <span className="co-code-d">{display}</span> : null}
      {inactive}
    </span>
  );
});
