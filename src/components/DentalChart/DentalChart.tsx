import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { SpecTable, V } from '../../internal/specialty';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { EmptyState } from '../EmptyState/EmptyState';

/** A tooth surface: mesial, occlusal or incisal, distal, buccal, lingual. */
export type ToothSurface = 'M' | 'O' | 'D' | 'B' | 'L';
/** A finding on one surface. */
export type SurfaceCondition = 'caries' | 'restoration' | 'planned' | 'sealant';
/** A finding on the whole tooth. */
export type WholeToothCondition = 'crown' | 'rct' | 'implant' | 'missing' | 'extract' | 'bridge' | 'impacted';

/** What is charted on one tooth. */
export interface ToothRecord {
  /** Findings per surface */
  surfaces?: Partial<Record<ToothSurface, SurfaceCondition>>;
  /** Whole-tooth finding */
  whole?: WholeToothCondition;
  /** Free-text note ("RCT 2023, needs crown") */
  note?: string;
}

/** Status of a planned procedure. */
export type DentalPlanStatus = 'planned' | 'scheduled' | 'completed' | 'declined' | 'in progress';

/** One procedure of the treatment plan. */
export interface DentalPlanItem {
  /** Phase number; default 1 */
  phase?: number;
  /** Universal tooth number; none for full-mouth procedures */
  tooth?: number | null;
  /** Surfaces ("MO") */
  surface?: string;
  /** CDT code ("D2392") */
  cdt: string;
  /** Procedure description */
  desc: string;
  status: DentalPlanStatus;
  /** Fee in US dollars */
  fee?: number;
  /** Estimated insurance payment in US dollars; default 0 */
  insurance?: number;
}

export interface DentalChartProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Record<tooth number 1-32, ToothRecord>; default {} */
  teeth?: Readonly<Record<number, ToothRecord>>;
  /** Treatment plan rows; default [] */
  plan?: ReadonlyArray<DentalPlanItem>;
  /** Tooth selected first (uncontrolled); default none */
  selected?: number;
  /** Selected tooth (controlled); null for none; default uncontrolled */
  selectedTooth?: number | null;
  /** Called with the tooth number, or null when the selection is cleared; default none */
  onSelectedChange?: (tooth: number | null) => void;
  /** Card title; default 'Dental chart' */
  title?: string;
  /** Line under the title; default 'Universal numbering . viewed facing the patient' */
  subtitle?: string;
  /** Hides the Perio Chart and Add Procedure actions; default false */
  readOnly?: boolean;
  /** Perio Chart action; default none */
  onPerioChart?: () => void;
  /** Add Procedure action; default none */
  onAddProcedure?: () => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

const DCOND: Record<SurfaceCondition, { c: string; l: string; dash?: boolean }> = {
  caries: { c: 'var(--co-danger)', l: 'Caries' },
  restoration: { c: 'var(--co-primary)', l: 'Existing restoration' },
  planned: { c: 'var(--co-warning)', l: 'Planned', dash: true },
  sealant: { c: 'var(--co-success)', l: 'Sealant' },
};
const WHOLE: Record<WholeToothCondition, string> = {
  crown: 'Crown',
  rct: 'Root canal',
  implant: 'Implant',
  missing: 'Missing',
  extract: 'Planned extraction',
  bridge: 'Bridge pontic',
  impacted: 'Impacted',
};
const PLANST: Record<DentalPlanStatus, BadgeTone> = {
  planned: 'warning',
  scheduled: 'info',
  completed: 'success',
  declined: 'neutral',
  'in progress': 'ai',
};
const SURFACES: ToothSurface[] = ['O', 'B', 'L', 'M', 'D'];
const POLY = {
  O: '11,11 23,11 23,23 11,23',
  top: '2,2 32,2 23,11 11,11',
  bottom: '11,23 23,23 32,32 2,32',
  left: '2,2 11,11 11,23 2,32',
  right: '32,2 32,32 23,23 23,11',
};

/** 'Molar' | 'Premolar' | 'Canine' | 'Incisor' for a universal tooth number 1-32. */
export function toothKind(n: number): string {
  const i = n <= 16 ? n : n - 16;
  const k = i <= 8 ? i : 17 - i;
  return k <= 3 ? 'Molar' : k <= 5 ? 'Premolar' : k === 6 ? 'Canine' : 'Incisor';
}

function surfaceEntries(t: ToothRecord | undefined): Array<[ToothSurface, SurfaceCondition]> {
  const s = (t && t.surfaces) || {};
  return (Object.keys(s) as ToothSurface[]).filter((k) => s[k] && DCOND[s[k]!]).map((k) => [k, s[k]!]);
}

/** Accessible name of a tooth: number, type and every finding. */
export function toothLabel(n: number, t?: ToothRecord): string {
  const whole = t && t.whole && WHOLE[t.whole];
  return (
    'Tooth ' +
    n +
    ', ' +
    toothKind(n) +
    (whole ? ', ' + whole : '') +
    surfaceEntries(t)
      .map(([k, c]) => ', ' + k + ' ' + DCOND[c].l)
      .join('')
  );
}

function Tooth({ n, t, sel, onClick }: { n: number; t?: ToothRecord; sel: boolean; onClick: () => void }) {
  const s = (t && t.surfaces) || {};
  const upper = n <= 16;
  /* Facing the patient: for teeth 1-8 and 25-32 the mesial side faces right; for 9-24 it faces left. Buccal sits outside the arch. */
  const mRight = n <= 8 || n >= 25;
  const map: Record<ToothSurface, keyof typeof POLY> = {
    O: 'O',
    B: upper ? 'top' : 'bottom',
    L: upper ? 'bottom' : 'top',
    M: mRight ? 'right' : 'left',
    D: mRight ? 'left' : 'right',
  };
  const whole = t && t.whole;
  const label = toothLabel(n, t);
  return (
    <button
      type="button"
      className={cx('co-tooth', !upper && 'is-lower')}
      onClick={onClick}
      aria-pressed={sel}
      aria-label={label}
      title={label}
    >
      <span className="co-tooth-n">{n}</span>
      <svg width={34} height={34} viewBox="0 0 34 34" aria-hidden="true">
        {SURFACES.map((k) => {
          const c = s[k];
          const d = c ? DCOND[c] : undefined;
          return (
            <polygon
              key={k}
              points={POLY[map[k]]}
              fill={d && !d.dash ? d.c : whole === 'crown' ? 'var(--co-ai-soft)' : 'var(--co-surface)'}
              stroke={d && d.dash ? d.c : 'var(--co-border-strong)'}
              strokeWidth={d && d.dash ? 2 : 1}
              strokeDasharray={d && d.dash ? '3 2' : undefined}
              opacity={whole === 'missing' ? 0.25 : 1}
            />
          );
        })}
        {whole === 'crown' ? (
          <rect x={1} y={1} width={32} height={32} rx={4} fill="none" stroke="var(--co-ai)" strokeWidth={2.5} />
        ) : null}
        {whole === 'missing' || whole === 'extract' ? (
          <path
            d="M4 4L30 30M30 4L4 30"
            stroke={whole === 'extract' ? 'var(--co-warning)' : 'var(--co-ink-2)'}
            strokeWidth={2.5}
            strokeDasharray={whole === 'extract' ? '4 3' : undefined}
          />
        ) : null}
        {whole === 'rct' ? <path d={upper ? 'M17 2V-6' : 'M17 32V40'} stroke="var(--co-danger)" strokeWidth={3} /> : null}
        {whole === 'implant' ? (
          <path d="M12 8h10M11 13h12M12 18h10M13 23h8M15 28h4" stroke="var(--co-ink-2)" strokeWidth={2} />
        ) : null}
        {whole === 'rct' ? <circle cx={17} cy={17} r={3} fill="var(--co-danger)" /> : null}
      </svg>
      <span className="co-tooth-t">
        {whole === 'rct' ? 'RCT' : whole === 'implant' ? 'Impl' : whole === 'bridge' ? 'Pontic' : whole === 'impacted' ? 'Imp' : ''}
      </span>
    </button>
  );
}

const EMPTY_TEETH: Readonly<Record<number, ToothRecord>> = {};
const EMPTY_PLAN: ReadonlyArray<DentalPlanItem> = [];

function range(a: number, b: number, step: number): number[] {
  const o: number[] = [];
  for (let n = a; step > 0 ? n <= b : n >= b; n += step) o.push(n);
  return o;
}

/**
 * DentalChart draws all 32 adult teeth in universal numbering with five surfaces each, marks caries, restorations,
 * crowns, root canals, implants and missing teeth, and lists the phased treatment plan with fees.
 */
export const DentalChart = forwardRef<HTMLElement, DentalChartProps>(function DentalChart(
  {
    teeth = EMPTY_TEETH,
    plan = EMPTY_PLAN,
    selected,
    selectedTooth,
    onSelectedChange,
    title = 'Dental chart',
    subtitle = 'Universal numbering . viewed facing the patient',
    readOnly = false,
    onPerioChart,
    onAddProcedure,
    rangeContext,
    className,
    ...rest
  },
  ref
) {
  const [sel, setSel] = useControllableState<number | null>(selectedTooth, selected ?? null, onSelectedChange);
  const arch = (nums: number[], lab: string) => (
    <div role="group" aria-label={lab} className="co-dental-arch">
      {nums.map((n) => (
        <Tooth key={n} n={n} t={teeth[n]} sel={sel === n} onClick={() => setSel(sel === n ? null : n)} />
      ))}
    </div>
  );
  const st = sel != null ? teeth[sel] : undefined;
  const open = plan.filter((x) => x.status !== 'declined' && x.status !== 'completed');
  const tot = open.reduce((a, x) => a + (x.fee || 0), 0);
  const ins = open.reduce((a, x) => a + (x.insurance || 0), 0);
  const findings = st
    ? [st.whole ? WHOLE[st.whole] : null]
        .concat(surfaceEntries(st).map(([k, c]) => k + ': ' + DCOND[c].l))
        .concat(st.note ? [st.note] : [])
        .filter(Boolean)
        .join(' . ') || 'No findings'
    : 'No findings recorded';
  return (
    <RangeContextProvider value={rangeContext}>
      <Card
        ref={ref}
        className={cx('co-dental', className)}
        title={title}
        subtitle={subtitle}
        actions={
          readOnly ? null : (
            <>
              <Button size="sm" onClick={onPerioChart}>
                Perio Chart
              </Button>
              <Button size="sm" variant="primary" iconLeft="plus" onClick={onAddProcedure}>
                Add Procedure
              </Button>
            </>
          )
        }
        {...rest}
      >
        <div className="co-dental-scroll">
          <div className="co-dental-head">
            <span>PATIENT RIGHT</span>
            <span>MAXILLARY</span>
            <span>PATIENT LEFT</span>
          </div>
          {arch(range(1, 16, 1), 'Maxillary arch, teeth 1 to 16')}
          <div className="co-dental-mid" />
          {arch(range(32, 17, -1), 'Mandibular arch, teeth 32 to 17')}
          <div className="co-dental-foot">MANDIBULAR</div>
        </div>
        <div className="co-sp-legend co-dental-legend">
          {(Object.keys(DCOND) as SurfaceCondition[]).map((k) => (
            <span key={k}>
              <span
                className={cx('co-sp-sw', DCOND[k].dash && 'is-dash')}
                style={{ borderColor: DCOND[k].c, background: DCOND[k].dash ? undefined : DCOND[k].c }}
              />
              {DCOND[k].l}
            </span>
          ))}
          <span>
            <span className="co-sp-sw is-dash" style={{ borderColor: 'var(--co-ai)' }} />
            Crown
          </span>
          <span>✕ Missing</span>
          <span>Surfaces: M mesial, O occlusal or incisal, D distal, B buccal, L lingual</span>
        </div>
        {sel != null ? (
          <div className="co-sp-box co-dental-sel" aria-live="polite">
            <b>{'Tooth ' + sel + ' . ' + toothKind(sel)}</b>
            <div className="co-mi-s">{findings}</div>
            {plan
              .filter((x) => x.tooth === sel)
              .map((x, i) => (
                <div key={i} className="co-row co-gap-6 co-dental-proc">
                  <span className="co-code">{x.cdt}</span>
                  <span>{x.desc}</span>
                  <Badge tone={PLANST[x.status] || 'neutral'} size="sm">
                    {x.status}
                  </Badge>
                </div>
              ))}
          </div>
        ) : null}
        {plan.length ? (
          <SpecTable
            caption="Treatment plan"
            cols={['Phase', 'Tooth', 'Surface', 'CDT', 'Procedure', 'Status', 'Fee', 'Est. insurance', 'Est. patient']}
            num={[6, 7, 8]}
            rows={plan.map((x) => [
              x.phase ?? 1,
              x.tooth || 'Full mouth',
              x.surface || '',
              <span key="c" className="co-code">
                {x.cdt}
              </span>,
              x.desc,
              <Badge key="s" tone={PLANST[x.status] || 'neutral'} size="sm">
                {x.status}
              </Badge>,
              <V key="f" k="usd" v={x.fee} />,
              <V key="i" k="usd" v={x.insurance || 0} />,
              <V key="p" k="usd" v={(x.fee || 0) - (x.insurance || 0)} />,
            ])}
          />
        ) : (
          <EmptyState compact title="No treatment planned" />
        )}
        {plan.length ? (
          <div className="co-row co-dental-tot">
            <span>
              Open plan total <V k="usd" v={tot} />
            </span>
            <span>
              Est. patient portion <V k="usd" v={tot - ins} />
            </span>
          </div>
        ) : null}
        <div className="co-help">
          Insurance amounts are estimates from the fee schedule, not a benefits determination. Confirm with a pre-treatment
          estimate.
        </div>
      </Card>
    </RangeContextProvider>
  );
});
