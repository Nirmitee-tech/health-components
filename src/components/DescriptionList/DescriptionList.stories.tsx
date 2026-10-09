import type { Meta, StoryObj } from '@storybook/react-vite';
import { DescriptionList } from './DescriptionList';

const meta = {
  title: 'Basic/Data display/DescriptionList',
  component: DescriptionList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'DescriptionList shows label and value pairs in two columns, such as Patient, Date of Birth and MRN. Native dl, dt and dd.',
      },
    },
  },
  args: {
    items: [
      ['Patient', 'Nora Scott'],
      ['Date of Birth', '06/11/1999'],
      ['MRN', 'MRN-100377'],
      ['Payer', 'Blue Cross Blue Shield of Illinois'],
      ['Authorization', 'PA-2026-11873, 20 visits, expires 12/31/2026'],
    ],
  },
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Compact: Story = {
  args: {
    compact: true,
    items: [
      ['Payer', 'Aetna PPO'],
      ['Member ID', 'W123456789'],
      ['Copay', '$25 office visit'],
    ],
  },
};
