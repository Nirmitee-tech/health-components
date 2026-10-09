import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { Alert } from '../Alert/Alert';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { DataTable, type DataTableColumn, type DataTableRowId } from '../DataTable/DataTable';
import type { MenuItem } from '../Menu/Menu';
import { Tabs, type TabItem } from '../Tabs/Tabs';

/** Priority of an inbox item. Critical shows an icon as well as the word. */
export type InboxPriority = 'Critical' | 'Abnormal' | 'Urgent' | 'Routine' | 'Normal';

/** One row of the inbox worklist. */
export interface InboxListItem {
  /** Unique id. */
  id: DataTableRowId;
  /** Item type; matches a category id ("Lab Results", "Co-sign") */
  type: string;
  /** Patient name */
  patient: string;
  /** What the item is ("Potassium 6.1 mmol/L (H)") */
  item: ReactNode;
  /** When it arrived ("08:42", "Yesterday") */
  received: string;
  /** 'Critical' | 'Abnormal' | 'Urgent' | 'Routine' | 'Normal' */
  priority: InboxPriority | (string & {});
  /** Work status ("New", "Reviewed", "Routed", "Overdue") */
  status: string;
}

/** One type tab. */
export interface InboxListCategory {
  /** Category name, also the value of `InboxListItem.type` */
  id: string;
  /** Count shown on the tab */
  count?: number;
  /** Shows the count in red (overdue); default false */
  alert?: boolean;
}

/** The critical-value alert pinned above the list. */
export interface InboxListCritical {
  /** Bold first line ("1 critical value waiting.") */
  title: ReactNode;
  /** Detail: patient, value, deadline */
  body?: ReactNode;
}

export interface InboxListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Array<{id, type, patient, item, received, priority, status}>. Required */
  items: InboxListItem[];
  /** Array<{id, count, alert?}>: one pill tab each after "All"; default [] */
  categories?: InboxListCategory[];
  /** {title, body}: critical-value alert pinned on top; default none */
  critical?: InboxListCritical;
  /** Whether the role can sign; false disables Sign Selected; default true */
  canSign?: boolean;
  /** Lock banner explaining what the role cannot do; default none */
  lockText?: ReactNode;
  /** Rows per page; default 5 */
  pageSize?: number;
  /** Selected type tab (controlled); default uncontrolled */
  category?: string;
  /** Initially selected type tab; default 'All' */
  defaultCategory?: string;
  /** Called with the new type tab; default none */
  onCategoryChange?: (category: string) => void;
  /** "Acknowledge and Call Patient" on the critical alert; default none */
  onAcknowledge?: () => void;
  /** "Open Chart" on the critical alert; default none */
  onOpenChart?: () => void;
  /** "Sign Selected" bulk action, with the selected ids; default none */
  onSign?: (ids: DataTableRowId[]) => void;
  /** "Mark Reviewed" bulk action; default none */
  onMarkReviewed?: (ids: DataTableRowId[]) => void;
  /** "Assign to..." bulk action; default none */
  onAssign?: (ids: DataTableRowId[]) => void;
  /** Row menu choice: 'open' | 'route' | 'pend'; default none */
  onRowAction?: (action: 'open' | 'route' | 'pend', item: InboxListItem) => void;
}

const PRIORITY_TONE: Record<string, BadgeTone> = {
  Critical: 'danger',
  Abnormal: 'warning',
  Urgent: 'warning',
  Routine: 'neutral',
  Normal: 'neutral',
};

const statusTone = (s: string): BadgeTone => (s === 'Overdue' ? 'danger' : s === 'New' ? 'info' : 'neutral');

const COLUMNS: DataTableColumn<InboxListItem>[] = [
  {
    key: 'priority',
    label: 'Priority',
    sortable: true,
    render: (r) => (
      <Badge tone={PRIORITY_TONE[r.priority] ?? 'neutral'} icon={r.priority === 'Critical' ? 'alert' : undefined}>
        {r.priority}
      </Badge>
    ),
  },
  { key: 'type', label: 'Type' },
  { key: 'patient', label: 'Patient', sortable: true },
  { key: 'item', label: 'Item' },
  { key: 'received', label: 'Received', sortable: true },
  { key: 'status', label: 'Status', render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
];

/** InboxList is the clinical inbox: a critical-value alert, type tabs with counts, and a selectable worklist with sign, review and assign. */
export const InboxList = forwardRef<HTMLDivElement, InboxListProps>(function InboxList(
  {
    items,
    categories = [],
    critical,
    canSign = true,
    lockText,
    pageSize = 5,
    category,
    defaultCategory = 'All',
    onCategoryChange,
    onAcknowledge,
    onOpenChart,
    onSign,
    onMarkReviewed,
    onAssign,
    onRowAction,
    className,
    ...rest
  },
  ref
) {
  const [cat, setCat] = useControllableState(category, defaultCategory, onCategoryChange);
  const rows = items.filter((it) => cat === 'All' || it.type === cat);
  const tabs: TabItem[] = [
    { id: 'All', label: 'All', count: items.length },
    ...categories.map((c) => ({ id: c.id, label: c.id, count: c.count, alert: c.alert })),
  ];
  const rowMenu = (row: InboxListItem): MenuItem[] => [
    { label: 'Open', onSelect: () => onRowAction?.('open', row) },
    { label: 'Route to...', onSelect: () => onRowAction?.('route', row) },
    { label: 'Pend', onSelect: () => onRowAction?.('pend', row) },
  ];

  return (
    <div ref={ref} className={cx('co-dt', className)} {...rest}>
      {critical ? (
        <Alert
          tone="error"
          title={critical.title}
          actions={
            <>
              <Button size="sm" variant="danger-solid" onClick={onAcknowledge}>
                Acknowledge and Call Patient
              </Button>
              <Button size="sm" onClick={onOpenChart}>
                Open Chart
              </Button>
            </>
          }
        >
          {critical.body}
        </Alert>
      ) : null}
      <Tabs variant="pill" label="Inbox type" value={cat} onChange={setCat} items={tabs} />
      {lockText ? <Alert tone="lock">{lockText}</Alert> : null}
      <DataTable<InboxListItem>
        rows={rows}
        columns={COLUMNS}
        pageSize={pageSize}
        selectable
        caption={`Inbox: ${cat}`}
        bulkActions={(ids) => (
          <>
            <Button size="sm" variant="primary" disabled={!canSign} onClick={() => onSign?.(ids)}>
              Sign Selected
            </Button>
            <Button size="sm" onClick={() => onMarkReviewed?.(ids)}>
              Mark Reviewed
            </Button>
            <Button size="sm" onClick={() => onAssign?.(ids)}>
              Assign to...
            </Button>
          </>
        )}
        rowMenu={rowMenu}
      />
    </div>
  );
});
