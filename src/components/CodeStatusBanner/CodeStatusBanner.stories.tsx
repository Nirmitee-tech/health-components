import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CodeStatusBanner } from './CodeStatusBanner';

const meta = {
  title: 'Complex/Clinical/CodeStatusBanner',
  component: CodeStatusBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'CodeStatusBanner shows code status and advance directive, red for DNR, DNI or comfort care (role alert) and green for Full Code (role status).',
      },
    },
  },
  argTypes: {
    status: { control: 'text' },
    directive: { control: 'text' },
    polst: { control: 'text' },
    proxy: { control: 'text' },
  },
  args: { status: 'DNR / DNI', onViewDocuments: fn() },
} satisfies Meta<typeof CodeStatusBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { directive: 'Living will on file', polst: '03/02/2026', proxy: 'Maria Edwards (wife)' },
};

/** The design system demo: a DNR / DNI with documents and a Full Code with none. */
export const Statuses: Story = {
  render: () => (
    <div className="co-dt">
      <CodeStatusBanner
        status="DNR / DNI"
        directive="Living will on file"
        polst="03/02/2026"
        proxy="Maria Edwards (wife)"
      />
      <CodeStatusBanner status="Full Code" />
    </div>
  ),
};

export const ComfortCare: Story = {
  args: { status: 'Comfort care only', directive: 'Living will on file', proxy: 'James Cole (son)' },
};

export const AsLink: Story = { args: { status: 'Full Code', directive: 'Living will on file', documentsHref: '#documents' } };
