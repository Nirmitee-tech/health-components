import { forwardRef, useState, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';
import { Alert } from '../Alert/Alert';
import { Combobox, type ComboboxOption } from '../Combobox/Combobox';
import { IconButton } from '../IconButton/IconButton';

/** One CPT or HCPCS code in the search results. */
export interface CPTOption {
  /** CPT or HCPCS code ("99214") */
  code: string;
  /** Code description ("Office visit, established, moderate") */
  label: string;
  /** Second line, such as an RVU or fee; default none */
  meta?: string;
}

/** One coded procedure line. */
export interface CPTLine {
  /** CPT or HCPCS code */
  code: string;
  /** Code description */
  label: string;
  /** Modifiers, comma separated ("25, 95"); default "" */
  mods?: string;
  /** Units; default 1 */
  units?: number;
  /** Diagnosis pointer letters ("A", "AB"); default "A" */
  dx?: string;
}

export interface CPTPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Array<{code, label, meta?}>: the codes to search. Required */
  options: CPTOption[];
  /** Array<{code, label, mods?, units?, dx?}>: initial lines (uncontrolled); default [] */
  lines?: CPTLine[];
  /** Controlled lines; default undefined (uncontrolled) */
  value?: CPTLine[];
  /** Called with all lines after a line is added, edited or removed; default none */
  onChange?: (lines: CPTLine[]) => void;
  /** Shows the modifier 95 reminder for telehealth visits; default false */
  telehealth?: boolean;
  /** Field label; default "Procedure (CPT / HCPCS)" */
  label?: string;
  /** Placeholder of the search input; default "Code or words, such as 99214" */
  placeholder?: string;
}

const EMPTY: CPTLine[] = [];

/** CPTPicker adds CPT or HCPCS codes as lines with modifiers, units and diagnosis pointers. */
export const CPTPicker = forwardRef<HTMLDivElement, CPTPickerProps>(function CPTPicker(
  {
    options,
    lines: initialLines = EMPTY,
    value,
    onChange,
    telehealth = false,
    label = 'Procedure (CPT / HCPCS)',
    placeholder = 'Code or words, such as 99214',
    className,
    id,
    ...rest
  },
  ref
) {
  const base = useDomId('cpt', id);
  const [lines, setLines] = useControllableState(value, initialLines, onChange);
  const [query, setQuery] = useState('');
  const comboOptions: ComboboxOption[] = options.map((o) => ({ value: o.code, code: o.code, label: o.label, meta: o.meta }));

  const update = (i: number, patch: Partial<CPTLine>) =>
    setLines(lines.map((l, j) => (j === i ? { ...l, ...patch } : l)));

  return (
    <div ref={ref} id={id} className={cx('co-dt', 'co-cpt', className)} {...rest}>
      <Combobox
        id={`${base}-q`}
        label={label}
        kind="code"
        options={comboOptions}
        placeholder={placeholder}
        query={query}
        onQueryChange={setQuery}
        onSelect={(o) => {
          const opt = options.find((x) => x.code === o.code);
          if (!opt) return;
          setLines([...lines, { code: opt.code, label: opt.label, mods: '', units: 1 }]);
          setQuery('');
        }}
      />
      {lines.length ? (
        <div className="co-tbx">
          <table className="co-table">
            <thead>
              <tr>
                {['Code', 'Description', 'Modifiers', 'Units', 'Dx pointer'].map((c) => (
                  <th key={c} className="co-th-plain" scope="col">
                    {c}
                  </th>
                ))}
                <th className="co-th-plain co-td-x" scope="col">
                  <span className="co-sr">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={`${l.code}-${i}`}>
                  <td>
                    <span className="co-code">{l.code}</span>
                  </td>
                  <td>{l.label}</td>
                  <td>
                    <input
                      className="co-inp co-inp-sm co-cpt-mods"
                      aria-label={`Modifiers for ${l.code}`}
                      value={l.mods ?? ''}
                      placeholder="25, 95"
                      onChange={(e) => update(i, { mods: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      className="co-inp co-inp-sm co-cpt-units"
                      aria-label={`Units for ${l.code}`}
                      value={l.units === 0 ? '' : String(l.units ?? 1)}
                      inputMode="numeric"
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '');
                        update(i, { units: digits === '' ? 0 : Number(digits) });
                      }}
                    />
                  </td>
                  <td>
                    <input
                      className="co-inp co-inp-sm co-cpt-dx"
                      aria-label={`Diagnosis pointer for ${l.code}`}
                      value={l.dx ?? 'A'}
                      onChange={(e) => update(i, { dx: e.target.value.toUpperCase() })}
                    />
                  </td>
                  <td className="co-td-x">
                    <IconButton
                      icon="x"
                      size="sm"
                      label={`Remove ${l.code}`}
                      onClick={() => setLines(lines.filter((_, j) => j !== i))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {telehealth ? <Alert tone="info">Telehealth: add modifier 95 to each E/M or psychotherapy line.</Alert> : null}
    </div>
  );
});
