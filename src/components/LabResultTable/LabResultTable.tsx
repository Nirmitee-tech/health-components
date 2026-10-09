import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Sparkline } from '../Sparkline/Sparkline';
import { isCriticalFlag, resultFlags, type ResultFlag } from '../VitalSign/VitalSign';

/** One lab result line. */
export interface LabResultRow {
  /** Stable key; default test name */
  id?: string;
  /** Test name ("Potassium"); required */
  test: string;
  /** LOINC code, shown under the name; default none */
  loinc?: string;
  /** Result value; required */
  value: string | number;
  /** 'H' | 'L' | 'HH' | 'LL'; critical rows are shaded; default none (Normal) */
  flag?: ResultFlag;
  /** Reference range ("3.5 to 5.1"); required */
  range: string;
  /** Units ("mmol/L"); required */
  units: string;
  /** number[]: earlier results, oldest first; default none */
  trend?: number[];
  /** Collection time; required */
  collected: string;
}

export interface LabResultTableProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Array<{test, loinc?, value, flag?, range, units, trend?, collected}>; required */
  rows: LabResultRow[];
  /** Card title and table caption; default "Lab Results" */
  title?: string;
  /** Line under the title (lab, collection time, ordering provider); default none */
  subtitle?: ReactNode;
  /** Critical value message, shown in a red alert above the table; default none */
  critical?: ReactNode;
  /** Shows Sign and Notify Patient and Route to Nurse; called on Sign; default none */
  onSign?: () => void;
  /** Route to Nurse clicked (shown with onSign); default none */
  onRoute?: () => void;
  /** Card header actions; default none */
  actions?: ReactNode;
}

const COLUMNS = ['Test', 'Result', 'Flag', 'Reference range', 'Units', 'Trend', 'Collected'];

/**
 * LabResultTable shows a lab panel with value, H, L and critical flags, reference range, units, trend and
 * collection time, plus sign and route.
 */
export const LabResultTable = forwardRef<HTMLElement, LabResultTableProps>(function LabResultTable(
  { rows, title, subtitle, critical, onSign, onRoute, actions, ...rest },
  ref
) {
  return (
    <Card ref={ref} title={title || 'Lab Results'} subtitle={subtitle} actions={actions} {...rest}>
      {critical ? (
        <Alert tone="error" title="Critical value">
          {critical}
        </Alert>
      ) : null}
      <div className="co-tbx">
        <table className="co-table">
          <caption className="co-sr">{title || 'Lab results'}</caption>
          <thead>
            <tr>
              {COLUMNS.map((c, i) => (
                <th key={c} scope="col" className={cx('co-th-plain', i === 1 && 'co-num')}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const f = r.flag ? resultFlags[r.flag] : undefined;
              const crit = isCriticalFlag(r.flag);
              return (
                <tr key={r.id ?? `${r.test}-${i}`} className={cx(crit && 'is-crit')}>
                  <td>
                    {r.test}
                    {r.loinc ? <span className="co-mi-s">{`LOINC ${r.loinc}`}</span> : null}
                  </td>
                  <td className="co-num">
                    <b style={f ? { color: 'var(--co-danger-strong)' } : undefined}>{r.value}</b>
                  </td>
                  <td>
                    {f && r.flag ? (
                      <Badge tone={f.tone} size="sm" icon={crit ? 'alert' : undefined}>
                        {`${r.flag} ${f.label}`}
                      </Badge>
                    ) : (
                      <span className="co-mi-s">Normal</span>
                    )}
                  </td>
                  <td>{r.range}</td>
                  <td>{r.units}</td>
                  <td>
                    {r.trend ? (
                      <Sparkline
                        values={r.trend}
                        label={`${r.test} trend`}
                        color={f ? 'var(--co-danger)' : 'var(--co-primary)'}
                      />
                    ) : null}
                  </td>
                  <td>{r.collected}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {onSign ? (
        <div className="co-row co-gap-8">
          <Button variant="primary" size="sm" onClick={onSign}>
            Sign and Notify Patient
          </Button>
          <Button size="sm" onClick={onRoute}>
            Route to Nurse
          </Button>
        </div>
      ) : null}
    </Card>
  );
});
