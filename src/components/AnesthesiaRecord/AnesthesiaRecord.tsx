import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, number, useRangeContext, type RangeContextId } from '../../clinical';
import { ACUTE_DEFAULT_CONTEXT, AcuteTable, AcuteValue, acuteFlag, type AcuteMeasureKey } from '../../internal/acute';
import { cx } from '../../internal/cx';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { DescriptionList } from '../DescriptionList/DescriptionList';

/** Intraoperative vitals, each array aligned to `times`; null where not recorded. */
export interface AnesthesiaVitals {
  hr?: Array<number | null>;
  /** [systolic, diastolic] */
  bp?: Array<[number, number] | null>;
  map?: Array<number | null>;
  spo2?: Array<number | null>;
  etco2?: Array<number | null>;
  temp?: Array<number | null>;
}

/** A case event drawn as a dashed line ("Induction", "Incision"). */
export interface AnesthesiaEvent {
  /** One of `times` */
  time: string;
  label: string;
}

/** One medication given. */
export interface AnesthesiaMed {
  time: string;
  drug: string;
  dose: number;
  unit: string;
  route: string;
  /** DEA schedule ('C-II') */
  controlled?: string;
  /** Decimals of the dose; default 1 when the dose has a fraction, else 0 */
  dp?: number;
}

/** Airway details. */
export interface AnesthesiaAirway {
  device: string;
  size: number;
  /** Default 'mm ID' */
  sizeUnit?: string;
  /** Laryngoscopy view */
  view: string;
  attempts: number;
  /** Depth at teeth, cm */
  depth: number;
  /** How placement was confirmed */
  confirm: string;
}

/** Fluid totals in mL. */
export interface AnesthesiaTotals {
  fluids?: number;
  ebl?: number;
  urine?: number;
}

export interface AnesthesiaRecordProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Column times 'HH:MM', usually every 5 minutes; required */
  times: string[];
  /** Vitals aligned to `times`; required */
  vitals: AnesthesiaVitals;
  /** Case events; default [] */
  events?: AnesthesiaEvent[];
  /** Medications given; default [] */
  meds?: AnesthesiaMed[];
  /** Airway; default none (Airway not documented) */
  airway?: AnesthesiaAirway;
  /** Fluid totals in mL; default {} */
  totals?: AnesthesiaTotals;
  /** Critical event banner {title, body}; default none */
  alert?: { title: string; body: string };
  /** Signed record: no actions; default false */
  readOnly?: boolean;
  /** Line under the title; default none */
  subtitle?: string;
  /** Called by Add Event; default none */
  onAddEvent?: () => void;
  /** Called by Give Medication; default none */
  onGiveMedication?: () => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'ed' when no global context is set */
  rangeContext?: RangeContextId;
}

type RowKey = 'hr' | 'bp' | 'map' | 'spo2' | 'etco2' | 'temp';
const ROWS: ReadonlyArray<[RowKey, string]> = [
  ['hr', 'HR'],
  ['bp', 'BP'],
  ['map', 'MAP'],
  ['spo2', 'SpO2'],
  ['etco2', 'EtCO2'],
  ['temp', 'Temp'],
];

const W = 640;
const H = 150;
const PL = 30;

function Trend({ times, vitals, events }: { times: string[]; vitals: AnesthesiaVitals; events: AnesthesiaEvent[] }) {
  const ctx = useRangeContext(ACUTE_DEFAULT_CONTEXT);
  const hr = vitals.hr || [];
  const x = (i: number) => PL + (i * (W - PL - 10)) / Math.max(1, times.length - 1);
  const y = (v: number) => 8 + (1 - (v - 40) / 160) * (H - 26);
  const points = hr
    .map((v, i) => (v == null ? null : x(i) + ',' + y(v)))
    .filter(Boolean)
    .join(' ');
  const summary =
    'Heart rate ' +
    hr.map((v, i) => (times[i] ? times[i] + ' ' : '') + (v == null ? 'not recorded' : number(v) + ' bpm')).join(', ') +
    (vitals.bp && vitals.bp.length
      ? '. Blood pressure ' +
        vitals.bp.map((b, i) => (times[i] ? times[i] + ' ' : '') + (b ? number(b[0]) + '/' + number(b[1]) + ' mmHg' : 'not recorded')).join(', ')
      : '') +
    (events.length ? '. Events: ' + events.map((e) => e.label + ' at ' + e.time).join(', ') : '');
  return (
    <figure className="co-chart co-an-chart">
      <figcaption className="co-chart-t">HR (line) and BP (bars), 40 to 200</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="co-line" role="img" aria-label={summary}>
        {[60, 100, 140, 180].map((g) => (
          <g key={g}>
            <line x1={PL} x2={W - 10} y1={y(g)} y2={y(g)} stroke="var(--co-line-soft)" />
            <text x={2} y={y(g) + 4} className="co-axis">
              {g}
            </text>
          </g>
        ))}
        {(vitals.bp || []).map((b, i) =>
          b ? (
            <line
              key={'b' + i}
              x1={x(i)}
              x2={x(i)}
              y1={y(b[0])}
              y2={y(b[1])}
              stroke={acuteFlag('sbp', b[0], { context: ctx }) ? 'var(--co-danger)' : 'var(--co-accent)'}
              strokeWidth={5}
              strokeLinecap="round"
            />
          ) : null
        )}
        <polyline points={points} fill="none" stroke="var(--co-primary)" strokeWidth={2} />
        {events.map((e, i) => {
          const ix = times.indexOf(e.time);
          return ix < 0 ? null : (
            <g key={'e' + i}>
              <line x1={x(ix)} x2={x(ix)} y1={4} y2={H - 18} stroke="var(--co-ai)" strokeDasharray="3 3" />
              <text x={x(ix) + 3} y={H - 6} className="co-axis">
                {e.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

/**
 * AnesthesiaRecord is the intraoperative record: vitals every 5 minutes as a trend and a grid, case events,
 * medications given, airway details and fluid totals.
 */
export const AnesthesiaRecord = forwardRef<HTMLElement, AnesthesiaRecordProps>(function AnesthesiaRecord(
  {
    times: timesProp,
    vitals: vitalsProp,
    events = [],
    meds = [],
    airway,
    totals = {},
    alert,
    readOnly = false,
    subtitle,
    onAddEvent,
    onGiveMedication,
    rangeContext,
    ...rest
  },
  ref
) {
  const times = timesProp || [];
  const vit = vitalsProp || {};
  const rows = ROWS.filter(([k]) => vit[k]);
  return (
    <Card
      ref={ref}
      title="Anesthesia Record"
      subtitle={subtitle}
      actions={
        readOnly ? (
          <Badge tone="neutral" icon="lock">
            Signed
          </Badge>
        ) : (
          <>
            <Button size="sm" iconLeft="plus" onClick={onAddEvent}>
              Add Event
            </Button>
            <Button size="sm" variant="primary" iconLeft="pill" onClick={onGiveMedication}>
              Give Medication
            </Button>
          </>
        )
      }
      {...rest}
    >
      <RangeContextProvider value={rangeContext}>
        {alert ? (
          <Alert tone="error" title={alert.title}>
            {alert.body}
          </Alert>
        ) : null}
        {times.length > 1 && vit.hr ? <Trend times={times} vitals={vit} events={events} /> : null}
        <AcuteTable label="Intraoperative vitals every 5 minutes">
          <thead>
            <tr>
              <th scope="col" className="co-th-plain">
                Vital
              </th>
              {times.map((t) => (
                <th key={t} scope="col" className="co-th-plain co-num co-ac-num">
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([k, label]) => (
              <tr key={k}>
                <th scope="row" className="co-th-plain">
                  {label}
                </th>
                {times.map((t, i) => {
                  const arr = vit[k] as Array<number | [number, number] | null>;
                  return (
                    <td key={t} className="co-num co-ac-cell-sm">
                      <AcuteValue measure={k as AcuteMeasureKey | 'bp'} value={arr[i] ?? null} shortFlag missingText="n/r" />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </AcuteTable>
        <div className="co-an-cols">
          <div>
            <h3 className="co-h co-ac-h3 is-first">Medications</h3>
            {meds.length ? (
              <table className="co-table">
                <caption className="co-sr">Medications given</caption>
                <thead>
                  <tr>
                    {['Time', 'Drug', 'Dose', 'Route'].map((c) => (
                      <th key={c} scope="col" className={cx('co-th-plain', c === 'Dose' && 'co-num')}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {meds.map((m, i) => (
                    <tr key={m.time + m.drug + i}>
                      <td className="co-ac-num">{m.time}</td>
                      <td>
                        {m.drug}{' '}
                        {m.controlled ? (
                          <Badge tone="danger" size="sm" icon="shield">
                            {m.controlled}
                          </Badge>
                        ) : null}
                      </td>
                      <td className="co-num">
                        <AcuteValue
                          measure={null}
                          value={m.dose}
                          range={{ unit: m.unit, dp: m.dp != null ? m.dp : m.dose % 1 ? 1 : 0 }}
                        />
                      </td>
                      <td>{m.route}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span className="co-mi-s">No medications given yet.</span>
            )}
          </div>
          <div>
            <h3 className="co-h co-ac-h3 is-first">Airway</h3>
            {airway ? (
              <DescriptionList
                compact
                items={[
                  ['Device', airway.device],
                  ['Size', <AcuteValue key="s" measure={null} value={airway.size} range={{ unit: airway.sizeUnit || 'mm ID', dp: 1 }} />],
                  ['Laryngoscopy', airway.view],
                  [
                    'Attempts',
                    <AcuteValue
                      key="a"
                      measure={null}
                      value={airway.attempts}
                      range={{ unit: airway.attempts === 1 ? 'attempt' : 'attempts' }}
                    />,
                  ],
                  ['Depth at teeth', <AcuteValue key="d" measure="ett" value={airway.depth} />],
                  ['Confirmed by', airway.confirm],
                ]}
              />
            ) : (
              <span className="co-mi-s">Airway not documented.</span>
            )}
            <h3 className="co-h co-ac-h3 is-sub">Totals</h3>
            <DescriptionList
              compact
              items={[
                ['Fluids in', <AcuteValue key="f" measure="fluids" value={totals.fluids} />],
                ['EBL', <AcuteValue key="e" measure="ebl" value={totals.ebl} />],
                ['Urine', <AcuteValue key="u" measure="urine" value={totals.urine} />],
              ]}
            />
          </div>
        </div>
      </RangeContextProvider>
    </Card>
  );
});
