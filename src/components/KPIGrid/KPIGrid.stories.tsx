import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { KPIGrid, type KPIGridItem } from './KPIGrid';

const paQueue: KPIGridItem[] = [
  { label: 'Needs Submission', value: '9', sub: 'drafts over 2 days: 3' },
  { label: 'Pended', value: '6', sub: 'payer asked for info' },
  { label: 'Expiring in 14 days', value: '4', trend: '2', trendGood: false },
  { label: 'Approved this week', value: '21', trend: '5', trendGood: true },
];

const meta = {
  title: 'Complex/Dashboards/KPIGrid',
  component: KPIGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'KPIGrid lays out StatCards in a responsive grid and can make them a single-select filter for the table below: selecting a card again clears the filter.',
      },
    },
  },
  argTypes: {
    defaultSelected: { control: 'select', options: [null, ...paQueue.map((k) => k.label)] },
    label: { control: 'text' },
  },
  args: { items: paQueue, onSelect: fn() },
} satisfies Meta<typeof KPIGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { filter: true, label: 'Filter prior authorizations', defaultSelected: 'Pended' } };

export const Filter: Story = { args: { filter: true, label: 'Filter prior authorizations', defaultSelected: 'Pended' } };

export const Static: Story = {
  args: {
    items: [
      { label: 'Visits today', value: '42', sub: '6 telehealth' },
      { label: 'Clean claim rate', value: '96.2%', trend: '1.4 pts', trendGood: true, sub: 'vs last month' },
      { label: 'Days in A/R', value: '31', trend: '3', trendDir: 'down', trendGood: true },
      { label: 'Open care gaps', value: '118', sub: 'HEDIS 2026' },
    ],
  },
};
