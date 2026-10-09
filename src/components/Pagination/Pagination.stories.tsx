import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Pagination } from './Pagination';

const meta = {
  title: 'Basic/Data display/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Pagination shows the record range and lets staff change rows per page and move between pages. It is a nav landmark named Pagination; the page info is aria-live.',
      },
    },
  },
  args: { total: 248, defaultPage: 2, onPage: fn(), onPageSize: fn() },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Pagination label="Claims pages" total={248} defaultPage={2} pageSize={10} />
      <Pagination label="Referrals pages" total={8} defaultPage={1} pageSize={10} />
      <Pagination label="Remittances pages" total={248} defaultPage={25} pageSize={10} pageSizes={false} />
    </div>
  ),
};

export const FewRecords: Story = { args: { total: 8, defaultPage: 1 } };

export const NoRecords: Story = { args: { total: 0 } };

export const WithoutPageSizes: Story = { args: { total: 248, defaultPage: 25, pageSizes: false } };
