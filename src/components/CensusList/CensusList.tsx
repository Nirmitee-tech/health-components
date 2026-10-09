import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, number, useRangeContext, type RangeContextId } from '../../clinical';
import { useControllableState } from '../../internal/hooks';
import {
  INPATIENT_DEFAULT_CONTEXT,
  Value,
  inpatientFlag,
  isCritical,
  type InpatientMeasureValue,
} from '../../internal/inpatientFlow';
import { Badge } from '../Badge/Badge';
import { Card } from '../Card/Card';
import { DataTable, type DataTableColumn } from '../DataTable/DataTable';
import { EmptyState } from '../EmptyState/EmptyState';
import { IsolationBadge, type IsolationType } from '../IsolationBadge/IsolationBadge';
import { LevelOfCareBadge, type LevelOfCare } from '../LevelOfCareBadge/LevelOfCareBadge';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { Skeleton } from '../Skeleton/Skeleton';

export type { InpatientMeasureKey, InpatientMeasureValue } from '../../internal/inpatientFlow';

/** Census filter. */
export type CensusFilter = 'all' | 'dc' | 'iso' | 'flag' | 'obs';

/** One patient on the census. */
export interface CensusRow {
  /** Bed ('401A', 'ED 7') */
  bed: string;
  /** 'Last, First' */
  name: string;
  /** Medical record number (row key) */
  mrn: string;
  /** Age in years */
  age: number;
  /** 'F' | 'M' | other */
  sex: string;
  /** Diagnosis */
  dx: string;
  /** Level of care */
  level: LevelOfCare;
  /** Requested level of care; default none */
  pendingTo?: LevelOfCare;
  /** Length of stay in days */
  los: number;
  /** Expected length of stay (GMLOS) in days; LOS above it is flagged H; default none */
  gmlos?: number;
  /** Last vitals: [{ measure, value, range }]; default [] */
  vitals?: InpatientMeasureValue[];
  /** Isolation type; default none */
  isolation?: IsolationType;
  /** Organism; default none */
  organism?: string;
  /** Attending */
  attending?: string;
  /** Expected discharge ('14:00', '10/11'); default '--' */
  edd?: string;
  /** Discharge expected today; default false */
  dischargeToday?: boolean;
}

export interface CensusListProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Array of { bed, name, mrn, age, sex, dx, level, pendingTo, los, gmlos, vitals: [{ measure, value }], isolation, organism, attending, edd, dischargeToday }; required */
  rows: CensusRow[];
  /** 'all' | 'dc' | 'iso' | 'flag' | 'obs': starting filter (uncontrolled); default 'all' */
  defaultFilter?: CensusFilter;
  /** Filter (controlled); default uncontrolled */
  filter?: CensusFilter;
  /** Called with the new filter; default none */
  onFilterChange?: (filter: CensusFilter) => void;
  /** Shows skeleton rows; default false */
  loading?: boolean;
  /** Rows per page; default 10 */
  pageSize?: number;
  /** Card title; default 'Census' */
  title?: string;
  /** Line under the title; default none */
  subtitle?: string;
  /** Which shared reference range flags use; the lab range on a result still wins; default 'inpatient' when no global context is set */
  rangeContext?: RangeContextId;
}

/** CensusList is the unit or service list of current inpatients with bed, level of care, length of stay against the expected stay, last vitals with flags, isolation and expected discharge. */
export const CensusList = forwardRef<HTMLElement, CensusListProps>(function CensusList(
  {
    rows,
    defaultFilter = 'all',
    filter,
    onFilterChange,
    loading = false,
    pageSize = 10,
    title = 'Census',
    subtitle,
    rangeContext,
    ...rest
  },
  ref
) {
  const ctx = useRangeContext(INPATIENT_DEFAULT_CONTEXT, rangeContext);
  const [f, setF] = useControllableState<CensusFilter>(filter, defaultFilter, onFilterChange);
  const FIL: Record<CensusFilter, (r: CensusRow) => boolean> = {
    all: () => true,
    dc: (r) => !!r.dischargeToday,
    iso: (r) => !!r.isolation && r.isolation !== 'standard',
    obs: (r) => r.level === 'obs',
    flag: (r) => (r.vitals || []).some((v) => isCritical(inpatientFlag(v.measure, v.value, v.range, ctx))),
  };
  const shown = rows.filter(FIL[f] ?? FIL.all);
  const n = (k: CensusFilter) => rows.filter(FIL[k]).length;
  const cols: DataTableColumn<CensusRow>[] = [
    { key: 'bed', label: 'Bed', sortable: true },
    {
      key: 'name',
      label: 'Patient',
      sortable: true,
      render: (r) => (
        <div>
          <b>{r.name}</b>
          <div className="co-mi-s">
            {'MRN ' + r.mrn + ' · '}
            <Value measure="age" value={r.age} />
            {' ' + r.sex}
          </div>
        </div>
      ),
    },
    { key: 'dx', label: 'Diagnosis' },
    {
      key: 'level',
      label: 'Level',
      render: (r) => <LevelOfCareBadge level={r.level} size="sm" compact pendingTo={r.pendingTo} />,
    },
    {
      key: 'los',
      label: 'LOS',
      align: 'right',
      sortable: true,
      render: (r) => (
        <span title={r.gmlos != null ? 'Expected ' + number(r.gmlos, 1) + ' d (GMLOS)' : undefined}>
          <Value measure="los" value={r.los} flag={r.gmlos != null && r.los > r.gmlos ? 'H' : null} />
          {r.gmlos != null ? <div className="ip-v-r">{'exp ' + number(r.gmlos, 1) + ' d'}</div> : null}
        </span>
      ),
    },
    {
      key: 'vitals',
      label: 'Last vitals',
      render: (r) => (
        <div className="co-row co-gap-8" style={{ flexWrap: 'wrap' }}>
          {(r.vitals || []).map((v, i) => (
            <Value key={i} {...v} />
          ))}
        </div>
      ),
    },
    {
      key: 'isolation',
      label: 'Isolation',
      render: (r) =>
        r.isolation ? <IsolationBadge type={r.isolation} size="sm" compact organism={r.organism} /> : '--',
    },
    { key: 'attending', label: 'Attending' },
    {
      key: 'edd',
      label: 'Expected discharge',
      render: (r) =>
        r.dischargeToday ? (
          <Badge tone="success" size="sm">
            {'Today' + (r.edd ? ' ' + r.edd : '')}
          </Badge>
        ) : (
          r.edd || '--'
        ),
    },
  ];
  return (
    <RangeContextProvider value={rangeContext}>
      <Card ref={ref} title={title} subtitle={subtitle} padding="none" {...rest}>
        <div style={{ padding: '10px 14px' }}>
          <SegmentedControl
            label="Filter census"
            size="sm"
            value={f}
            onChange={(v) => setF(v as CensusFilter)}
            options={[
              { value: 'all', label: 'All', count: n('all') },
              { value: 'dc', label: 'Discharge today', count: n('dc') },
              { value: 'iso', label: 'Isolation', count: n('iso') },
              { value: 'flag', label: 'Critical vitals', count: n('flag') },
              { value: 'obs', label: 'Observation', count: n('obs') },
            ]}
          />
        </div>
        {loading ? (
          <div style={{ padding: 14 }}>
            <Skeleton variant="row" rows={4} label="Loading census" />
          </div>
        ) : shown.length ? (
          <DataTable
            columns={cols}
            rows={shown}
            rowKey="mrn"
            pageSize={pageSize}
            defaultSort={{ key: 'bed', dir: 'asc' }}
          />
        ) : (
          <div style={{ padding: 14 }}>
            <EmptyState kind="noresults" title="No patients match" compact>
              Clear the filter to see the whole unit.
            </EmptyState>
          </div>
        )}
      </Card>
    </RangeContextProvider>
  );
});
