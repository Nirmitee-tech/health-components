import { forwardRef, type ComponentProps, type HTMLAttributes } from 'react';
import { useControllableState } from '../../internal/hooks';
import { Badge } from '../Badge/Badge';
import { Card } from '../Card/Card';
import { EmptyState } from '../EmptyState/EmptyState';
import { ICD10Picker } from '../ICD10Picker/ICD10Picker';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';

/** One coded problem. */
export interface ProblemItem {
  /** Stable key; default code */
  id?: string;
  /** ICD-10-CM code ("E11.9"); required */
  code: string;
  /** Description; required */
  label: string;
  /** Onset year or date; default "unknown" */
  onset?: string;
  /** Who added it ("Mandy Harley LCSW"); default none */
  by?: string;
  /** Shows the Chronic tag; default false */
  chronic?: boolean;
  /** HCC category, shown as "HCC 38"; default none */
  hcc?: string;
  /** 'active' | 'resolved'; default 'active' */
  status?: 'active' | 'resolved';
}

/** One ICD-10 code offered when adding a problem. */
export interface ProblemCodeOption {
  code: string;
  label: string;
}

/** Which problems are shown. */
export type ProblemFilter = 'active' | 'resolved' | 'all';

type ICD10Select = ComponentProps<typeof ICD10Picker>['onSelect'];

export interface ProblemListProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Array<{code, label, onset?, by?, chronic?, hcc?, status?}>; required */
  items: ProblemItem[];
  /** Array<{code,label}> for the Add problem picker; default [] */
  icdOptions?: ProblemCodeOption[];
  /** Hides the Add problem picker; default false */
  readOnly?: boolean;
  /** Status filter (controlled): 'active' | 'resolved' | 'all'; default undefined (uncontrolled) */
  filter?: ProblemFilter;
  /** Initial status filter (uncontrolled); default 'active' */
  defaultFilter?: ProblemFilter;
  /** Called when the filter changes; default none */
  onFilterChange?: (filter: ProblemFilter) => void;
  /** Called with the code picked in Add problem; default none */
  onAdd?: ICD10Select;
}

const FILTERS = [
  { value: 'active', label: 'Active' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'all', label: 'All' },
];

/** ProblemList is the coded problem list with ICD-10 codes, onset, chronic and HCC tags, filtered by Active, Resolved or All. */
export const ProblemList = forwardRef<HTMLElement, ProblemListProps>(function ProblemList(
  { items, icdOptions = [], readOnly = false, filter: filterProp, defaultFilter = 'active', onFilterChange, onAdd, ...rest },
  ref
) {
  const [filter, setFilter] = useControllableState<ProblemFilter>(filterProp, defaultFilter, onFilterChange);
  const shown = items.filter((x) => filter === 'all' || (x.status ?? 'active') === filter);
  return (
    <Card
      ref={ref}
      title="Problems"
      actions={
        <SegmentedControl
          size="sm"
          label="Status"
          value={filter}
          onChange={(v) => setFilter(v as ProblemFilter)}
          options={FILTERS}
        />
      }
      {...rest}
    >
      {shown.length ? (
        <ul className="co-list">
          {shown.map((x) => (
            <li key={x.id ?? x.code} className="co-li">
              <span className="co-code">{x.code}</span>
              <div className="co-li-b">
                <b>{x.label}</b>
                <span className="co-mi-s">{[`Onset ${x.onset || 'unknown'}`, x.by].filter(Boolean).join(' . ')}</span>
              </div>
              {x.chronic ? <Badge tone="info">Chronic</Badge> : null}
              {x.status === 'resolved' ? <Badge tone="success">Resolved</Badge> : null}
              {x.hcc ? <Badge tone="outline">{`HCC ${x.hcc}`}</Badge> : null}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState compact title={filter === 'all' ? 'No problems' : `No ${filter} problems`} />
      )}
      {readOnly ? null : <ICD10Picker label="Add problem" options={icdOptions} onSelect={onAdd} />}
    </Card>
  );
});
