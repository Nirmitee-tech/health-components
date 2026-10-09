import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { InsuranceCoverageCard, type Coverage } from "./InsuranceCoverageCard";

const coverages: Coverage[] = [
  {
    payer: "AARP Medicare Supplement",
    plan: "Plan G",
    memberId: "AR 3388 1021",
    status: "Active",
    checked: "10/08/2026",
  },
  {
    payer: "Medicare Part B",
    plan: "Original Medicare",
    memberId: "1EG4-TE5-MK72",
    status: "Active",
    checked: "10/08/2026",
  },
  {
    payer: "Aetna",
    plan: "Retiree PPO",
    memberId: "W123456789",
    group: "0844512",
    subscriber: "Spouse: Maria Edwards",
    status: "Inactive",
    checked: "09/02/2026",
  },
];

const meta = {
  title: "Complex/Revenue/InsuranceCoverageCard",
  component: InsuranceCoverageCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "InsuranceCoverageCard lists a patient's active coverages in billing order (COB), with reorder arrows, eligibility status and a suggested-order warning. Also exported as `CoverageStack`.",
      },
    },
  },
  argTypes: {
    suggested: { control: "text" },
    selfPay: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
  args: {
    defaultCoverages: coverages,
    onReorder: fn(),
    onAdd: fn(),
    onApplySuggested: fn(),
    onKeepOrder: fn(),
    onCheckEligibility: fn(),
    onCoverageAction: fn(),
  },
} satisfies Meta<typeof InsuranceCoverageCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SuggestedOrder: Story = {
  args: { suggested: "Medicare Part B first, then AARP Medicare Supplement" },
};

export const SelfPay: Story = { args: { selfPay: true, defaultCoverages: [] } };

export const ReadOnly: Story = {
  args: { readOnly: true, defaultCoverages: coverages.slice(1, 3) },
};
