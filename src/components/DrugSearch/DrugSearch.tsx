import { forwardRef, useMemo } from 'react';
import { Combobox, type ComboboxOption, type ComboboxProps } from '../Combobox/Combobox';

/** One drug result. */
export interface DrugOption {
  /** Stable key; default label */
  value?: string;
  /** Drug name and strength ("Oxycodone 5 mg tablet"); required */
  label: string;
  /** Dose form ("Tablet"); default none */
  form?: string;
  /** RxNorm code; default none */
  rxnorm?: string;
  /** Plan coverage ("Covered, tier 1"); default none */
  coverage?: string;
  /** DEA schedule ("C-II"), shown as a red flag; default none */
  schedule?: string;
}

export interface DrugSearchProps extends Omit<ComboboxProps, 'label' | 'options' | 'onSelect' | 'kind' | 'footer'> {
  /** Array<{label, form?, rxnorm?, coverage?, schedule?}>; required */
  options: DrugOption[];
  /** Field label; default "Medication" */
  label?: string;
  /** Payer whose formulary is shown, in the footer; default "the patient's plan" */
  payer?: string;
  /** Called with the chosen drug; default none */
  onSelect?: (drug: DrugOption) => void;
}

/** DrugSearch finds a medication with form, RxNorm, plan coverage and DEA schedule shown in each result. */
export const DrugSearch = forwardRef<HTMLInputElement, DrugSearchProps>(function DrugSearch(
  { options, label = 'Medication', payer, onSelect, placeholder = 'Drug name, such as metformin', ...rest },
  ref
) {
  const mapped = useMemo(() => {
    const byOption = new Map<ComboboxOption, DrugOption>();
    const list = options.map((d) => {
      const o: ComboboxOption = {
        value: d.value,
        label: d.label,
        meta: [d.form, d.rxnorm ? `RxNorm ${d.rxnorm}` : null, d.coverage].filter(Boolean).join(' . ') || undefined,
        flag: d.schedule,
        flagTone: 'danger',
      };
      byOption.set(o, d);
      return o;
    });
    return { list, byOption };
  }, [options]);

  return (
    <Combobox
      ref={ref}
      label={label}
      options={mapped.list}
      placeholder={placeholder}
      onSelect={(o) => {
        const d = mapped.byOption.get(o);
        if (d) onSelect?.(d);
      }}
      footer={`Formulary from ${payer || "the patient's plan"} via Surescripts.`}
      {...rest}
    />
  );
});
