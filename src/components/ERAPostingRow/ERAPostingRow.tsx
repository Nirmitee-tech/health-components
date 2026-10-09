import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';

/** One CARC adjustment on an ERA line, e.g. CO-45. */
export interface EraAdjustment {
  /** Group code: 'CO' | 'PR' | 'OA' | 'PI' | 'CR' */
  group: string;
  /** Claim adjustment reason code, e.g. "45" */
  code: string;
  /** Adjusted amount in dollars */
  amount: number;
  /** Meaning of the code, shown as the title; default none */
  text?: string;
}

/** One RARC remark on an ERA line, e.g. N54. */
export interface EraRemark {
  /** Remittance advice remark code */
  code: string;
  /** Meaning of the code, shown as the title; default none */
  text?: string;
}

/** One ERA (835) service line. */
export interface EraRow {
  /** Patient name */
  patient: string;
  /** CPT or HCPCS code */
  cpt: string;
  /** Date of service; default none */
  dos?: string;
  /** Claim number; default none */
  claim?: string;
  /** Billed amount */
  billed: number;
  /** Allowed amount */
  allowed: number;
  /** Paid amount */
  paid: number;
  /** Patient responsibility; default 0 */
  patientResp?: number;
  /** CARC adjustments; default [] */
  adjustments?: EraAdjustment[];
  /** RARC remarks; default [] */
  remarks?: EraRemark[];
}

export interface ERAPostingRowProps extends HTMLAttributes<HTMLDivElement> {
  /** The ERA service line. Required */
  row: EraRow;
  /** Called with the row when Post is pressed (only enabled when balanced); default none */
  onPost?: (row: EraRow) => void;
}

/** Formats dollars as $182.00 or -$63.60. */
function money(n: number): string {
  const v = Number(n) || 0;
  return (v < 0 ? '-$' : '$') + Math.abs(v).toFixed(2);
}

/** Rounds to cents so 118.4 - 93.4 - 25 is 0, not 7e-15. */
const cents = (n: number) => Math.round(n * 100) / 100;

/** ERAPostingRow is one ERA (835) service line to post: billed, allowed, paid, contractual and patient amounts, CARC and RARC codes, balance check and Post. */
export const ERAPostingRow = forwardRef<HTMLDivElement, ERAPostingRowProps>(function ERAPostingRow(
  { row: r, onPost, className, ...rest },
  ref
) {
  const pr = r.patientResp ?? 0;
  const contractual = cents(r.billed - r.allowed);
  const diff = cents(r.allowed - r.paid - pr);
  const bad = diff !== 0;
  const meta = [r.dos ? `DOS ${r.dos}` : null, r.claim].filter(Boolean).join(' . ');
  const amounts: Array<[string, number]> = [
    ['Billed', r.billed],
    ['Allowed', r.allowed],
    ['Paid', r.paid],
    ['Contractual', -contractual],
    ['Patient resp.', pr],
  ];
  return (
    <div ref={ref} className={cx('co-era', bad && 'is-bad', className)} {...rest}>
      <div className="co-li-b">
        <b>{`${r.patient} . ${r.cpt}`}</b>
        {meta ? <span className="co-mi-s">{meta}</span> : null}
      </div>
      <div className="co-era-n">
        {amounts.map(([label, value]) => (
          <div key={label}>
            <span className="co-kl">{label}</span>
            <b>{money(value)}</b>
          </div>
        ))}
      </div>
      <div className="co-row co-gap-6">
        {(r.adjustments ?? []).map((a) => (
          <span key={`${a.group}-${a.code}`} className="co-code" title={a.text}>
            {`${a.group}-${a.code} ${money(a.amount)}`}
          </span>
        ))}
        {(r.remarks ?? []).map((m) => (
          <Badge key={m.code} tone="outline" title={m.text}>
            {`RARC ${m.code}`}
          </Badge>
        ))}
      </div>
      {bad ? (
        <Badge tone="danger" icon="alert">
          {`Out of balance ${money(diff)}`}
        </Badge>
      ) : (
        <Badge tone="success" icon="check">
          Balanced
        </Badge>
      )}
      <Button
        size="sm"
        variant={bad ? 'secondary' : 'primary'}
        disabled={bad}
        aria-label={`Post ${r.patient} ${r.cpt}`}
        onClick={() => onPost?.(r)}
      >
        Post
      </Button>
    </div>
  );
});
