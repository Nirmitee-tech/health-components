import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { AcuteTable, AcuteValue, type ESILevel } from '../../internal/acute';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { Badge, type BadgeSize, type BadgeTone } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { EmptyState } from '../EmptyState/EmptyState';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { StatCard } from '../StatCard/StatCard';

export type { ESILevel };
export { acuteFmt } from '../../internal/acute';

/* ---------- ESIBadge ---------- */

const ESI_TONE: Record<ESILevel, BadgeTone> = { 1: 'danger', 2: 'danger', 3: 'warning', 4: 'info', 5: 'success' };
/** ESI level names. */
export const ESI_LABEL: Readonly<Record<ESILevel, string>> = {
  1: 'Resuscitation',
  2: 'Emergent',
  3: 'Urgent',
  4: 'Less urgent',
  5: 'Non-urgent',
};

export interface ESIBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** ESI level 1 to 5, or null when not set; required */
  level: ESILevel | null | undefined;
  /** Adds the level name ("ESI 2 Emergent"); default false */
  showLabel?: boolean;
  /** 'sm' | 'md'; default 'md' */
  size?: BadgeSize;
}

/** ESIBadge shows an Emergency Severity Index level in words with its tone; ESI 1 is ringed. */
export const ESIBadge = forwardRef<HTMLSpanElement, ESIBadgeProps>(function ESIBadge(
  { level, showLabel = false, size = 'md', className, ...rest },
  ref
) {
  if (!level || !ESI_TONE[level])
    return (
      <Badge ref={ref} tone="outline" size={size} className={className} {...rest}>
        ESI not set
      </Badge>
    );
  return (
    <span
      ref={ref}
      className={cx('co-esi', level === 1 && 'is-1', className)}
      title={'ESI ' + level + ', ' + ESI_LABEL[level]}
      {...rest}
    >
      <Badge tone={ESI_TONE[level]} size={size} icon={level <= 2 ? 'alert' : undefined}>
        {'ESI ' + level + (showLabel ? ' ' + ESI_LABEL[level] : '')}
      </Badge>
    </span>
  );
});

/* ---------- EDTrackingBoard ---------- */

/** One patient on the ED board. */
export interface EDPatient {
  /** Room or bed; empty means Lobby */
  room?: string;
  name: string;
  age: number;
  sex: string;
  mrn?: string;
  /** ESI level, or null when triage has not set it */
  esi: ESILevel | null;
  /** Chief complaint in the patient's words */
  complaint: string;
  /** Minutes waited */
  wait: number;
  /** 'Waiting' | 'Triage' | 'In Room' | 'Results Pending' | 'Ready to Admit' | 'Boarding' | 'Ready to Discharge' | 'Discharged' | 'LWBS' */
  status: string;
  provider?: string;
  nurse?: string;
  /** What the patient waits for ("CT head in progress") */
  pending?: string;
  /** Last vitals; bp is [systolic, diastolic] */
  vitals?: { hr?: number; bp?: [number, number]; spo2?: number };
  /** Safety flags: Sepsis, Stroke, STEMI, Trauma, Isolation, Fall Risk, Behavioral, Interpreter, Allergy */
  flags?: string[];
}

export type EDFilter = 'all' | 'waiting' | 'boarding' | 'mine';
export type EDDensity = 'comfortable' | 'compact';

/** Status word to tag tone. */
export const ED_STATUS_TONES: Readonly<Record<string, BadgeTone>> = {
  Waiting: 'warning',
  Triage: 'warning',
  'In Room': 'ai',
  'Results Pending': 'info',
  'Ready to Admit': 'info',
  Boarding: 'danger',
  'Ready to Discharge': 'success',
  Discharged: 'neutral',
  LWBS: 'neutral',
};
const ED_FLAG: Record<string, BadgeTone> = {
  Sepsis: 'danger',
  Stroke: 'danger',
  STEMI: 'danger',
  Trauma: 'danger',
  Isolation: 'warning',
  'Fall Risk': 'warning',
  Behavioral: 'ai',
  Interpreter: 'outline',
  Allergy: 'danger',
};
/** Default ESI wait targets in minutes. */
export const ESI_WAIT_TARGETS: Readonly<Record<ESILevel, number>> = { 1: 0, 2: 10, 3: 30, 4: 60, 5: 120 };

const isWaiting = (x: EDPatient) => x.status === 'Waiting' || x.status === 'Triage';
const own = <T,>(o: Readonly<Record<string, T>>, k: string): T | undefined =>
  Object.prototype.hasOwnProperty.call(o, k) ? o[k] : undefined;

export interface EDTrackingBoardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Patients in the department; required */
  patients: EDPatient[];
  /** Wait targets in minutes per ESI level; default {1: 0, 2: 10, 3: 30, 4: 60, 5: 120} */
  waitTargets?: Partial<Record<ESILevel, number>>;
  /** Provider name for the My patients filter; default none */
  currentProvider?: string;
  /** 'comfortable' | 'compact' (hides the vitals column, for wall boards); default 'comfortable' */
  density?: EDDensity;
  /** Filter (controlled): 'all' | 'waiting' | 'boarding' | 'mine'; default uncontrolled */
  filter?: EDFilter;
  /** Initial filter (uncontrolled); default 'all' */
  defaultFilter?: EDFilter;
  /** Called with the new filter; default none */
  onFilterChange?: (filter: EDFilter) => void;
  /** Shows the summary tiles; default true */
  summary?: boolean;
  /** Hides the Quick Register action; default false */
  readOnly?: boolean;
  /** Called by Quick Register; default none */
  onQuickRegister?: () => void;
  /** Card title; default 'ED Tracking Board' */
  title?: string;
  /** Line under the title; default none */
  subtitle?: string;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'ed' when no global context is set */
  rangeContext?: RangeContextId;
}

/**
 * EDTrackingBoard is the emergency department whiteboard: every patient with ESI acuity, room, chief complaint, wait
 * against the ESI target, status, provider and nurse, last vitals and safety flags.
 */
export const EDTrackingBoard = forwardRef<HTMLElement, EDTrackingBoardProps>(function EDTrackingBoard(
  {
    patients,
    waitTargets,
    currentProvider,
    density = 'comfortable',
    filter: filterProp,
    defaultFilter = 'all',
    onFilterChange,
    summary = true,
    readOnly = false,
    onQuickRegister,
    title = 'ED Tracking Board',
    subtitle,
    rangeContext,
    ...rest
  },
  ref
) {
  const pts = patients || [];
  const [f, setF] = useControllableState<EDFilter>(filterProp, defaultFilter, onFilterChange);
  const targets: Record<ESILevel, number> = { ...ESI_WAIT_TARGETS, ...(waitTargets || {}) };
  const late = (x: EDPatient) => !!x.esi && x.wait > targets[x.esi] && isWaiting(x);
  const shown = pts
    .filter((x) =>
      f === 'waiting' ? isWaiting(x) : f === 'boarding' ? x.status === 'Boarding' : f === 'mine' ? !!currentProvider && x.provider === currentProvider : true
    )
    .slice()
    .sort((a, b) => (a.esi || 9) - (b.esi || 9) || (b.wait || 0) - (a.wait || 0));
  const waiting = pts.filter(isWaiting);
  const over = pts.filter(late);
  const longest = waiting.reduce((m, x) => Math.max(m, x.wait || 0), 0);
  const compact = density === 'compact';
  const caption = 'Emergency department patients sorted by acuity then wait';
  const cols = ['Acuity', 'Room', 'Patient', 'Chief complaint', 'Wait', 'Status', 'Provider / Nurse', compact ? null : 'Last vitals', 'Flags'].filter(
    (c): c is string => !!c
  );

  return (
    <Card
      ref={ref}
      title={title}
      subtitle={subtitle}
      padding="none"
      actions={
        readOnly ? null : (
          <Button size="sm" variant="primary" iconLeft="plus" onClick={onQuickRegister}>
            Quick Register
          </Button>
        )
      }
      {...rest}
    >
      <RangeContextProvider value={rangeContext}>
        {summary ? (
          <div className="co-kpis co-ed-kpis">
            <StatCard label="In department" value={<AcuteValue measure={null} value={pts.length} range={{ unit: 'patients' }} />} />
            <StatCard
              label="Waiting to be seen"
              value={<AcuteValue measure={null} value={waiting.length} range={{ unit: 'patients' }} />}
              sub={over.length ? over.length + ' over ESI target' : 'All within ESI target'}
            />
            <StatCard label="Longest wait" value={<AcuteValue measure="wait" value={longest} />} />
            <StatCard
              label="Boarding"
              value={
                <AcuteValue measure={null} value={pts.filter((x) => x.status === 'Boarding').length} range={{ unit: 'patients' }} />
              }
            />
          </div>
        ) : null}
        <div className="co-ed-bar">
          <SegmentedControl
            label="Filter patients"
            size="sm"
            value={f}
            onChange={(v) => setF(v as EDFilter)}
            options={[
              { value: 'all', label: 'All', count: pts.length },
              { value: 'waiting', label: 'Waiting', count: waiting.length },
              { value: 'boarding', label: 'Boarding' },
              { value: 'mine', label: 'My patients' },
            ]}
          />
        </div>
        {!shown.length ? (
          <EmptyState title={pts.length ? 'No patients match this filter' : 'No patients in the department'} compact>
            {pts.length ? 'Choose All to see every patient.' : 'New arrivals appear here after Quick Register.'}
          </EmptyState>
        ) : (
          <AcuteTable label={caption}>
            <thead>
              <tr>
                {cols.map((c) => (
                  <th key={c} scope="col" className={cx('co-th-plain', c === 'Wait' && 'co-num')}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((x, i) => {
                const isLate = late(x);
                return (
                  <tr key={(x.mrn || x.name) + '-' + i} className={cx(x.esi === 1 && 'is-crit')}>
                    <td>
                      <ESIBadge level={x.esi} size="sm" />
                    </td>
                    <td>{x.room ? <b>{x.room}</b> : <span className="co-mi-s">Lobby</span>}</td>
                    <td>
                      <b>{x.name}</b>
                      <div className="co-mi-s co-ac-num">{x.age + ' y ' + x.sex + (x.mrn ? ' . ' + x.mrn : '')}</div>
                    </td>
                    <td>{x.complaint}</td>
                    <td className="co-num">
                      <AcuteValue measure="wait" value={x.wait} range={x.esi ? { hi: targets[x.esi] } : null} hideFlag />
                      {isLate && x.esi ? (
                        <div>
                          <Badge tone="danger" size="sm" icon="clock">
                            {'Over ' + targets[x.esi] + ' min target'}
                          </Badge>
                        </div>
                      ) : null}
                    </td>
                    <td>
                      <Badge tone={own(ED_STATUS_TONES, x.status) || 'neutral'} size="sm">
                        {x.status}
                      </Badge>
                      {x.pending ? <div className="co-mi-s">{x.pending}</div> : null}
                    </td>
                    <td>
                      {x.provider || <span className="co-mi-s">Unassigned</span>}
                      <div className="co-mi-s">{x.nurse || 'No nurse'}</div>
                    </td>
                    {compact ? null : (
                      <td>
                        {x.vitals ? (
                          <div className="co-ac-stack">
                            <AcuteValue measure="hr" value={x.vitals.hr} shortFlag />
                            <AcuteValue measure="bp" value={x.vitals.bp ?? null} shortFlag />
                            <AcuteValue measure="spo2" value={x.vitals.spo2} shortFlag />
                          </div>
                        ) : (
                          <span className="co-mi-s">Not taken</span>
                        )}
                      </td>
                    )}
                    <td>
                      <div className="co-row co-gap-6 co-ac-wrap">
                        {(x.flags || []).map((fl) => (
                          <Badge key={fl} tone={own(ED_FLAG, fl) || 'outline'} size="sm">
                            {fl}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </AcuteTable>
        )}
      </RangeContextProvider>
    </Card>
  );
});
