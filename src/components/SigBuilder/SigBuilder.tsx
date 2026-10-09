import { forwardRef, useState, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { Alert } from '../Alert/Alert';
import { Card } from '../Card/Card';
import { Select } from '../Select/Select';
import { TextField } from '../TextField/TextField';

/** Structured directions of a prescription. */
export interface Sig {
  /** "1 tablet" */
  dose?: string;
  /** "by mouth" */
  route?: string;
  /** "twice daily" */
  freq?: string;
  /** "5 days" */
  duration?: string;
  /** Reason for an as-needed sig ("pain"); default none (scheduled) */
  prn?: string;
  /** Quantity dispensed */
  qty?: number | string;
  /** Refills */
  refills?: number | string;
  /** DEA schedule; C-II shows the no-refills helper */
  schedule?: string;
}

export interface SigBuilderProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onChange' | 'defaultValue'> {
  /**
   * {dose, route, freq, duration?, prn?, qty, refills, schedule?}. Controlled when `onChange` is set; without
   * `onChange` it seeds the fields, as the design system README uses it; default {}
   */
  value?: Sig;
  /** Initial sig (uncontrolled); default {} */
  defaultValue?: Sig;
  /** Called with the whole sig on every edit; default none */
  onChange?: (sig: Sig) => void;
  /** Route choices; default by mouth, under the tongue, topically, inhaled, by injection */
  routes?: string[];
  /** Frequency choices, spelled out; default once daily ... at bedtime */
  frequencies?: string[];
}

const ROUTES = ['by mouth', 'under the tongue', 'topically', 'inhaled', 'by injection'];
const FREQS = ['once daily', 'twice daily', 'three times daily', 'every 6 hours', 'at bedtime'];

/** The plain-language sentence the patient reads ("Take 1 tablet by mouth every 6 hours as needed for pain for 5 days"). */
export function sigText(sig: Sig): string {
  return [
    'Take',
    sig.dose,
    sig.route,
    sig.freq,
    sig.prn ? `as needed for ${sig.prn}` : null,
    sig.duration ? `for ${sig.duration}` : null,
  ]
    .filter(Boolean)
    .join(' ');
}

/** SigBuilder builds the directions from dose, route, frequency and duration and shows the plain-language sig the patient will read. */
export const SigBuilder = forwardRef<HTMLElement, SigBuilderProps>(function SigBuilder(
  { value, defaultValue, onChange, routes = ROUTES, frequencies = FREQS, className, ...rest },
  ref
) {
  const controlled = value !== undefined && onChange !== undefined;
  const [inner, setInner] = useState<Sig>(() => value ?? defaultValue ?? {});
  const sig = controlled ? value : inner;
  const set = (k: keyof Sig) => (v: string) => {
    const next = { ...sig, [k]: v };
    if (!controlled) setInner(next);
    onChange?.(next);
  };
  const str = (v: unknown) => (v == null ? '' : String(v));

  return (
    <Card ref={ref} title="Directions (Sig)" padding="compact" className={cx('co-sigb', className)} {...rest}>
      <div className="co-sigb-grid">
        <TextField label="Dose" value={str(sig.dose)} onChange={set('dose')} required placeholder="1 tablet" />
        <Select
          label="Route"
          value={str(sig.route)}
          onChange={(e) => set('route')(e.target.value)}
          placeholder="Choose a route"
          options={routes}
        />
        <Select
          label="Frequency"
          value={str(sig.freq)}
          onChange={(e) => set('freq')(e.target.value)}
          placeholder="Choose a frequency"
          options={frequencies}
        />
        <TextField label="Duration" value={str(sig.duration)} onChange={set('duration')} placeholder="5 days" />
        <TextField
          label="Quantity"
          value={str(sig.qty)}
          onChange={set('qty')}
          suffix="tablets"
          required
          inputMode="numeric"
        />
        <TextField
          label="Refills"
          value={str(sig.refills)}
          onChange={set('refills')}
          inputMode="numeric"
          helper={sig.schedule === 'C-II' ? 'C-II: no refills allowed.' : '0 to 11'}
        />
      </div>
      <Alert tone="note">
        <b>Patient sees: </b>
        {`${sigText(sig)}.`}
      </Alert>
    </Card>
  );
});
