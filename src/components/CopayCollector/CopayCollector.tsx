import { forwardRef, type HTMLAttributes } from 'react';
import { useControllableState } from '../../internal/hooks';
import { Alert } from '../Alert/Alert';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { RadioGroup } from '../Radio/Radio';
import { StatCard } from '../StatCard/StatCard';
import { TextField } from '../TextField/TextField';

/** How the front desk collects: card on file, tap or insert, cash or check, or a text-to-pay link. */
export type PaymentMethod = 'card' | 'tap' | 'cash' | 'text';

/** What the Collect button reports. */
export interface CopayCollection {
  /** Amount to collect in dollars (NaN when the field is not a number) */
  amount: number;
  /** Chosen payment method */
  method: PaymentMethod;
}

export interface CopayCollectorProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Patient (and plan) line under the title. Required */
  patient: string;
  /** Copay due today in dollars. Required */
  copay: number;
  /** Prior balance in dollars; default 0 */
  prior?: number;
  /** What the prior balance is for, e.g. "09/12 visit, after insurance"; default none */
  priorNote?: string;
  /** Payment plan note; shows an info Alert; default none */
  plan?: string;
  /** Card on file, e.g. "Visa 4242"; default none */
  cardLast4?: string;
  /** Initial amount in the Amount field; default copay */
  due?: number;
  /** Controlled amount (field text); default undefined (uncontrolled, starts at `due`) */
  amount?: string;
  /** Called when the amount text changes */
  onAmountChange?: (amount: string) => void;
  /** Controlled payment method; default undefined (uncontrolled) */
  method?: PaymentMethod;
  /** Initial payment method when uncontrolled; default 'card' */
  defaultMethod?: PaymentMethod;
  /** Called when the method changes */
  onMethodChange?: (method: PaymentMethod) => void;
  /** Called when Collect is pressed; default none */
  onCollect?: (collection: CopayCollection) => void;
  /** Called when Skip is pressed (the screen then asks for a reason); default none */
  onSkip?: () => void;
}

function money(n: number | string): string {
  const v = Number(n) || 0;
  return (v < 0 ? '-$' : '$') + Math.abs(v).toFixed(2);
}

/** CopayCollector (PatientBalance) shows today's copay, prior balance and total, and collects by card, tap, cash or text link. */
export const CopayCollector = forwardRef<HTMLElement, CopayCollectorProps>(function CopayCollector(
  {
    patient,
    copay,
    prior = 0,
    priorNote,
    plan,
    cardLast4,
    due,
    amount: amountProp,
    onAmountChange,
    method: methodProp,
    defaultMethod = 'card',
    onMethodChange,
    onCollect,
    onSkip,
    className,
    ...rest
  },
  ref
) {
  const [method, setMethod] = useControllableState<PaymentMethod>(methodProp, defaultMethod, onMethodChange);
  const [amount, setAmount] = useControllableState<string>(amountProp, String(due ?? copay), onAmountChange);
  const options = [
    { value: 'card', label: cardLast4 ? `Card on file (${cardLast4})` : 'Card on file' },
    { value: 'tap', label: 'Tap or insert' },
    { value: 'cash', label: 'Cash or check' },
    { value: 'text', label: 'Text a pay link' },
  ];
  return (
    <Card ref={ref} className={className} title="Patient balance" subtitle={patient} {...rest}>
      <div className="co-kpis">
        <StatCard label="Copay today" value={money(copay)} />
        <StatCard label="Prior balance" value={money(prior)} sub={priorNote} />
        <StatCard label="Total due" value={money((copay || 0) + (prior || 0))} />
      </div>
      {plan ? <Alert tone="info">{`Payment plan: ${plan}`}</Alert> : null}
      <div className="co-copay-grid">
        <TextField label="Amount" value={amount} onChange={(v) => setAmount(v)} iconLeft="dollar" inputMode="decimal" required />
        <RadioGroup
          label="Method"
          inline
          value={method}
          onChange={(v) => setMethod(v as PaymentMethod)}
          options={options}
        />
      </div>
      <div className="co-row co-gap-8">
        <Button variant="primary" iconLeft="card" onClick={() => onCollect?.({ amount: Number(amount), method })}>
          {`Collect ${money(amount)}`}
        </Button>
        <Button variant="tertiary" onClick={onSkip}>
          Skip, Reason Required
        </Button>
      </div>
    </Card>
  );
});
