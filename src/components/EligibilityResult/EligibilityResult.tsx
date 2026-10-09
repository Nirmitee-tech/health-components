import type { HTMLAttributes } from 'react';
import type { AlertTone } from '../Alert/Alert';
import { Alert } from '../Alert/Alert';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { DescriptionList, type DescriptionItem } from '../DescriptionList/DescriptionList';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { Spinner } from '../Spinner/Spinner';

export type EligibilityState = 'active' | 'inactive' | 'error' | 'waiting';

/** Alert tone and default headline per state. */
export const eligibilityStates: Record<EligibilityState, { tone: AlertTone; title: string }> = {
  active: { tone: 'success', title: 'Active' },
  inactive: { tone: 'error', title: 'Inactive' },
  error: { tone: 'error', title: 'Payer returned an error' },
  waiting: { tone: 'info', title: 'Waiting for the payer' },
};

export interface EligibilityResultProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** 'active' | 'inactive' | 'error' | 'waiting'; default 'active' */
  state?: EligibilityState;
  /** Payer name; required */
  payer: string;
  /** Result headline ("Active: Aetna PPO", "Invalid member ID"); default by state */
  headline?: string;
  /** AAA reject code, shown before the headline in the error state; default none */
  aaa?: string;
  /** "What it means" in plain words; default none */
  meaning?: string;
  /** "What to do" next; default none */
  todo?: string;
  /** Benefits as Array<[label, value]> (active only); default [] */
  benefits?: DescriptionItem[];
  /** Deductible [met, total] in dollars (active only); default none */
  deductible?: readonly [met: number, total: number];
  /** When the check ran ("10/09/2026 9:12 AM, 612 ms"); default none */
  checkedAt?: string;
  /** Re-run; default none */
  onRerun?: () => void;
  /** Fix Coverage Details (inactive and error); default none */
  onFixCoverage?: () => void;
  /** Self-pay Good Faith Estimate (inactive and error); default none */
  onSelfPay?: () => void;
}

const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

/** EligibilityResult shows the payer's 271 answer: active with benefits, inactive, an AAA error with what it means and what to do, or waiting. */
export function EligibilityResult({
  state = 'active',
  payer,
  headline,
  aaa,
  meaning,
  todo,
  benefits = [],
  deductible,
  checkedAt,
  onRerun,
  onFixCoverage,
  onSelfPay,
  ...rest
}: EligibilityResultProps) {
  const e = eligibilityStates[state] ?? eligibilityStates.active;
  if (state === 'waiting') {
    return (
      <Card title="Response (271)" aria-busy="true" {...rest}>
        <div className="co-row co-gap-8">
          <Spinner label={`Waiting for ${payer}`} />
          <span>{`Waiting for ${payer}... most answer in 1 to 5 seconds.`}</span>
        </div>
      </Card>
    );
  }
  return (
    <Card
      title="Response (271)"
      subtitle={checkedAt}
      actions={
        <Button size="sm" iconLeft="clock" onClick={onRerun}>
          Re-run
        </Button>
      }
      {...rest}
    >
      <Alert tone={e.tone} title={(state === 'error' && aaa ? `AAA ${aaa}: ` : '') + (headline || e.title)}>
        {meaning ? (
          <span>
            <b>What it means: </b>
            {meaning}
          </span>
        ) : null}
        {meaning && todo ? ' ' : null}
        {todo ? (
          <span>
            <b>What to do: </b>
            {todo}
          </span>
        ) : null}
      </Alert>
      {state === 'active' && benefits.length ? <DescriptionList items={benefits} /> : null}
      {state === 'active' && deductible ? (
        <ProgressBar
          label="Deductible met"
          value={deductible[0]}
          max={deductible[1]}
          valueText={`${usd(deductible[0])} of ${usd(deductible[1])}`}
        />
      ) : null}
      {state !== 'active' ? (
        <div className="co-row co-gap-8">
          <Button size="sm" onClick={onFixCoverage}>
            Fix Coverage Details
          </Button>
          <Button size="sm" onClick={onSelfPay}>
            Self-pay Good Faith Estimate
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
