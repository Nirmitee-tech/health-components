import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { StatusTag } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { EmptyState } from '../EmptyState/EmptyState';
import type { MenuItem } from '../Menu/Menu';
import { DataTable, type DataTableColumn } from './DataTable';

interface Claim {
  id: string;
  patient: string;
  payer: string;
  dos: string;
  amount: number;
  status: string;
}

const toDate = (mdY: string) => {
  const [m, d, y] = mdY.split('/').map(Number);
  return new Date(y!, m! - 1, d);
};

const columns: DataTableColumn<Claim>[] = [
  {
    key: 'id',
    label: 'Claim',
    sortable: true,
    render: (r) => (
      <a href={`#claims/${r.id}`} style={{ color: 'var(--co-link)' }}>
        {r.id}
      </a>
    ),
  },
  { key: 'patient', label: 'Patient', sortable: true },
  { key: 'payer', label: 'Payer' },
  { key: 'dos', label: 'DOS', sortable: true, sortValue: (r) => toDate(r.dos) },
  { key: 'amount', label: 'Billed', sortable: true, align: 'right', render: (r) => `$${r.amount.toFixed(2)}` },
  { key: 'status', label: 'Status', render: (r) => <StatusTag kind="claim" status={r.status} /> },
];

const rows: Claim[] = [
  { id: 'CLM-20871', patient: 'Henna West', payer: 'Aetna', dos: '10/06/2026', amount: 182, status: 'Rejected' },
  { id: 'CLM-20866', patient: 'Ralph Edwards', payer: 'Medicare', dos: '10/03/2026', amount: 96.5, status: 'Paid' },
  { id: 'CLM-20859', patient: 'Nora Scott', payer: 'BCBS IL', dos: '10/02/2026', amount: 240, status: 'Pending' },
  { id: 'CLM-20841', patient: 'Darlene Robertson', payer: 'UnitedHealthcare', dos: '09/29/2026', amount: 310, status: 'Denied' },
  { id: 'CLM-20832', patient: 'Jacob Jones', payer: 'Cigna', dos: '09/28/2026', amount: 125, status: 'Submitted' },
  { id: 'CLM-20811', patient: 'Kristin Watson', payer: 'Aetna', dos: '09/25/2026', amount: 88, status: 'Partially Paid' },
];

const menu = (): MenuItem[] => [
  { label: 'Open Claim', icon: 'file' },
  { label: 'Check Status (276)', icon: 'clock' },
  { label: 'Assign to Me', icon: 'user' },
  { divider: true },
  { label: 'Void Claim', danger: true, icon: 'trash' },
];

/** DataTable bound to the Claim row type, so Storybook infers the column and row types. */
const ClaimTable = DataTable<Claim>;

const meta = {
  title: 'Complex/Data/DataTable',
  component: ClaimTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'DataTable lists records with sorting, row selection with bulk actions, a row menu, expandable rows, empty and loading states, and pagination with rows per page. It is generic: `DataTable<Claim>` types the columns and row callbacks. Sort, selection, expanded rows and page are uncontrolled by default and controllable.',
      },
    },
  },
  argTypes: {
    caption: { control: 'text' },
    pageSize: { control: 'select', options: [5, 10, 25, 50] },
  },
  args: {
    columns,
    rows,
    caption: 'Claims',
    pageSize: 5,
    onSortChange: fn(),
    onSelectedChange: fn(),
    onPageChange: fn(),
  },
} satisfies Meta<typeof ClaimTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { selectable: true, defaultSort: { key: 'dos', dir: 'desc' } } };

export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="Claims" padding="default">
        <DataTable
          caption="Claims"
          columns={columns}
          rows={rows}
          selectable
          defaultSelected={['CLM-20871', 'CLM-20841']}
          pageSize={5}
          defaultSort={{ key: 'dos', dir: 'desc' }}
          rowMenu={menu}
          renderExpanded={() => (
            <div className="co-muted">
              Line 1: 99214 Office visit, est. $182.00. 277CA: A7 Rejected, invalid subscriber ID (2010BA NM109).
            </div>
          )}
          defaultExpanded={['CLM-20871']}
          bulkActions={() => (
            <>
              <Button size="sm">Assign</Button>
              <Button size="sm" variant="primary">
                Resubmit
              </Button>
            </>
          )}
        />
      </Card>
      <div className="pv-grid">
        <Card title="Empty">
          <DataTable caption="Empty claims" columns={columns.slice(0, 4)} rows={[]} pagination={false} />
        </Card>
        <Card title="Loading">
          <DataTable caption="Loading claims" columns={columns.slice(0, 4)} rows={[]} loading />
        </Card>
      </div>
    </div>
  ),
};

export const Selectable: Story = {
  args: {
    selectable: true,
    defaultSelected: ['CLM-20866'],
    bulkActions: (ids) => (
      <Button size="sm" variant="primary">
        Resubmit {ids.length}
      </Button>
    ),
  },
};

export const RowMenuAndExpand: Story = {
  args: {
    rowMenu: menu,
    renderExpanded: (r) => <div className="co-muted">Claim {r.id}: 99214 Office visit, est. ${r.amount.toFixed(2)}</div>,
    defaultExpanded: ['CLM-20871'],
  },
};

export const WithToolbar: Story = {
  args: {
    toolbar: (
      <>
        <Button size="sm" iconLeft="download">
          Export
        </Button>
        <Button size="sm" iconLeft="plus" variant="primary">
          New Claim
        </Button>
      </>
    ),
  },
};

export const Empty: Story = {
  args: {
    rows: [],
    pagination: false,
    emptyState: (
      <EmptyState compact kind="noresults" title="No claims match">
        Try the claim number or patient MRN.
      </EmptyState>
    ),
  },
};

export const Loading: Story = { args: { rows: [], loading: true } };

export const WithoutPagination: Story = { args: { pagination: false } };
