import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, gestational, number, type RangeContextId } from '../../clinical';
import { AcuteTable, AcuteValue } from '../../internal/acute';
import { cx } from '../../internal/cx';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Card } from '../Card/Card';
import { EmptyState } from '../EmptyState/EmptyState';

/** Fetal heart rate tracing category (NICHD three-tier). */
export type FHRCategory = 'I' | 'II' | 'III';

/** Category to tag tone. */
export const FHR_CATEGORY_TONES: Readonly<Record<FHRCategory, BadgeTone>> = { I: 'success', II: 'warning', III: 'danger' };

const LD_STATUS: Record<string, BadgeTone> = {
  Triage: 'neutral',
  Latent: 'info',
  Active: 'warning',
  Pushing: 'danger',
  Delivered: 'success',
  'C-section': 'ai',
  Postpartum: 'success',
  Antepartum: 'neutral',
};

/** One patient on labor and delivery. */
export interface LDPatient {
  room: string;
  name: string;
  age: number;
  /** Gravida */
  g: number;
  /** Para */
  p: number;
  gaWeeks: number;
  gaDays: number;
  /** Cervical dilation, cm */
  dilation?: number;
  /** Effacement, % */
  effacement?: number;
  /** Station, −3 to +3 */
  station?: number;
  /** Time of the last cervical exam 'HH:MM' */
  checked?: string;
  /** Hours since rupture of membranes; null for intact */
  rom?: number | null;
  /** Fetal heart rate baseline, bpm */
  fhr?: number;
  fhrCategory?: FHRCategory;
  /** Oxytocin rate, mU/min; null when off */
  oxytocin?: number | null;
  /** 'Triage' | 'Antepartum' | 'Latent' | 'Active' | 'Pushing' | 'Delivered' | 'C-section' | 'Postpartum' */
  status: string;
  provider: string;
  nurse: string;
  /** GBS+, Epidural, Pre-eclampsia, TOLAC, Hemorrhage risk */
  flags?: string[];
}

export interface LaborDeliveryBoardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Patients on the unit; required */
  patients: LDPatient[];
  /** Card title; default 'Labor and Delivery Board' */
  title?: string;
  /** Line under the title; default none */
  subtitle?: string;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'ed' when no global context is set */
  rangeContext?: RangeContextId;
}

const flagTone = (f: string): BadgeTone =>
  /GBS\+|Pre-eclampsia|Hemorrhage|TOLAC/.test(f) ? 'danger' : f === 'Epidural' ? 'info' : 'outline';
const station = (s: number) => (s > 0 ? '+' : s < 0 ? '−' : '') + number(Math.abs(s));

/**
 * LaborDeliveryBoard lists every patient on labor and delivery: room, gravida and para, gestational age, last cervical
 * exam, time since membranes ruptured, fetal heart rate and tracing category, oxytocin rate, status and care team.
 */
export const LaborDeliveryBoard = forwardRef<HTMLElement, LaborDeliveryBoardProps>(function LaborDeliveryBoard(
  { patients, title = 'Labor and Delivery Board', subtitle, rangeContext, ...rest },
  ref
) {
  const pts = patients || [];
  return (
    <Card ref={ref} title={title} subtitle={subtitle} padding="none" {...rest}>
      <RangeContextProvider value={rangeContext}>
        {!pts.length ? (
          <EmptyState title="No patients on the unit" compact>
            Patients appear here after triage admits them.
          </EmptyState>
        ) : (
          <AcuteTable label="Labor and delivery patients by room">
            <thead>
              <tr>
                {['Room', 'Patient', 'GA', 'Cervix', 'Since ROM', 'FHR', 'Oxytocin', 'Status', 'Provider / Nurse', 'Flags'].map((c) => (
                  <th key={c} scope="col" className="co-th-plain">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pts.map((x, i) => (
                <tr key={x.room + i} className={cx(x.fhrCategory === 'III' && 'is-crit')}>
                  <td>
                    <b>{x.room}</b>
                  </td>
                  <td>
                    <b>{x.name}</b>
                    <div className="co-mi-s co-ac-num">{x.age + ' y . G' + x.g + 'P' + x.p}</div>
                  </td>
                  <td className="co-ac-num">
                    {gestational({ weeks: x.gaWeeks, days: x.gaDays })}
                    {x.gaWeeks < 37 ? (
                      <div>
                        <Badge tone="warning" size="sm">
                          Preterm
                        </Badge>
                      </div>
                    ) : null}
                  </td>
                  <td className="co-ac-cell-sm co-ac-num">
                    {x.dilation == null ? (
                      <span className="co-mi-s">Not checked</span>
                    ) : (
                      <div className="co-ac-stack">
                        <AcuteValue measure="dilation" value={x.dilation} />
                        <AcuteValue measure="effacement" value={x.effacement} strong={false} />
                        {x.station != null ? <span>{'Station ' + station(x.station)}</span> : null}
                      </div>
                    )}
                    {x.checked ? <div className="co-mi-s">{'at ' + x.checked}</div> : null}
                  </td>
                  <td>
                    {x.rom == null ? <span className="co-mi-s">Intact</span> : <AcuteValue measure="rom" value={x.rom} shortFlag />}
                  </td>
                  <td>
                    <div className="co-ac-stack">
                      <AcuteValue measure="fhr" value={x.fhr} shortFlag />
                      {x.fhrCategory ? (
                        <Badge
                          tone={FHR_CATEGORY_TONES[x.fhrCategory]}
                          size="sm"
                          icon={x.fhrCategory === 'III' ? 'alert' : undefined}
                        >
                          {'Category ' + x.fhrCategory}
                        </Badge>
                      ) : null}
                    </div>
                  </td>
                  <td>
                    {x.oxytocin == null ? (
                      <span className="co-mi-s">Off</span>
                    ) : (
                      <AcuteValue measure="oxytocin" value={x.oxytocin} shortFlag />
                    )}
                  </td>
                  <td>
                    <Badge tone={Object.prototype.hasOwnProperty.call(LD_STATUS, x.status) ? LD_STATUS[x.status] : 'neutral'} size="sm">
                      {x.status}
                    </Badge>
                  </td>
                  <td>
                    {x.provider}
                    <div className="co-mi-s">{x.nurse}</div>
                  </td>
                  <td>
                    <div className="co-row co-gap-6 co-ac-wrap">
                      {(x.flags || []).map((f) => (
                        <Badge key={f} tone={flagTone(f)} size="sm">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </AcuteTable>
        )}
      </RangeContextProvider>
    </Card>
  );
});
