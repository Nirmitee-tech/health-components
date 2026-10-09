import { forwardRef, useState, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';
import { Combobox, type ComboboxOption } from '../Combobox/Combobox';
import { FilterChip } from '../FilterChip/FilterChip';

/** One ICD-10-CM code in the search results. */
export interface ICD10Option {
  /** ICD-10-CM code ("F41.1") */
  code: string;
  /** Code description ("Generalized anxiety disorder") */
  label: string;
  /** Second line, such as "Billable" or a synonym; default none */
  meta?: string;
}

/** A provider favourite shown as a chip under the search. */
export interface ICD10Favorite {
  /** ICD-10-CM code ("F41.1") */
  code: string;
  /** Short name on the chip ("GAD") */
  short: string;
}

export interface ICD10PickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect' | 'defaultValue'> {
  /** Array<{code, label, meta?}>: the codes to search. Required */
  options: ICD10Option[];
  /** Array<{code, short}>: favourite codes shown as chips; default none */
  favorites?: ICD10Favorite[];
  /** Field label; default "Diagnosis (ICD-10-CM)" */
  label?: string;
  /** Called with the chosen code (from the list or a favourite chip); default none */
  onSelect?: (option: ICD10Option) => void;
  /** Selected code (controlled); default undefined (uncontrolled) */
  value?: string;
  /** Initially selected code (uncontrolled); default none */
  defaultValue?: string;
  /** Initial search text; default "" */
  defaultQuery?: string;
  /** Open the results on first render; default false */
  defaultOpen?: boolean;
  /** Placeholder of the search input; default "Code or words, such as E11.9 or diabetes" */
  placeholder?: string;
  /** Error message under the search; default none */
  error?: string;
  /** Marks the field required; default false */
  required?: boolean;
}

/** ICD10Picker searches ICD-10-CM by code or words, shows billable codes and the provider's favourites. */
export const ICD10Picker = forwardRef<HTMLDivElement, ICD10PickerProps>(function ICD10Picker(
  {
    options,
    favorites,
    label = 'Diagnosis (ICD-10-CM)',
    onSelect,
    value,
    defaultValue,
    defaultQuery = '',
    defaultOpen = false,
    placeholder = 'Code or words, such as E11.9 or diabetes',
    error,
    required = false,
    className,
    id,
    ...rest
  },
  ref
) {
  const base = useDomId('icd', id);
  const [selected, setSelected] = useControllableState<string | undefined>(value, defaultValue);
  const [query, setQuery] = useState(defaultQuery);
  const comboOptions: ComboboxOption[] = options.map((o) => ({ value: o.code, code: o.code, label: o.label, meta: o.meta }));

  const choose = (o: ICD10Option) => {
    setSelected(o.code);
    onSelect?.(o);
  };

  return (
    <div ref={ref} id={id} className={cx('co-field', 'co-icd', className)} {...rest}>
      <Combobox
        id={`${base}-q`}
        label={label}
        kind="code"
        options={comboOptions}
        placeholder={placeholder}
        query={query}
        onQueryChange={setQuery}
        defaultOpen={defaultOpen}
        error={error}
        required={required}
        onSelect={(o) => {
          const match = options.find((x) => x.code === o.code);
          if (match) choose(match);
        }}
        footer="Billable codes only. Header codes (E11) ask you to pick a child."
        emptyText="No ICD-10 code matches. Try fewer words."
      />
      {favorites && favorites.length ? (
        <div className="co-row co-gap-6 co-icd-fav" role="group" aria-labelledby={`${base}-fav`}>
          <span className="co-mi-s" id={`${base}-fav`}>
            Favorites:
          </span>
          {favorites.map((f) => (
            <FilterChip
              key={f.code}
              check={false}
              selected={selected === f.code}
              onChange={() => {
                const full = options.find((x) => x.code === f.code);
                setQuery(`${f.code} ${full ? full.label : f.short}`);
                choose(full ?? { code: f.code, label: f.short });
              }}
            >
              {`${f.code} ${f.short}`}
            </FilterChip>
          ))}
        </div>
      ) : null}
    </div>
  );
});
