import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { PriorAuthTimeline, UnitsMeter } from "./PriorAuthTimeline";

const meta = {
  title: "Complex/Revenue/PriorAuthTimeline",
  component: PriorAuthTimeline,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "PriorAuthTimeline shows a prior authorization: status, units used against approved (UnitsMeter), any alert and the status history. UnitsMeter is also exported alone; the card is also exported as `PriorAuthCard`.",
      },
    },
  },
  argTypes: {
    status: {
      control: "select",
      options: [
        "Not Started",
        "Draft",
        "Submitted",
        "In Review",
        "Pended",
        "More Info Needed",
        "Approved",
        "Partially Approved",
        "Denied",
        "Expired",
      ],
    },
    alertTone: {
      control: "inline-radio",
      options: ["warning", "error", "info"],
    },
    used: { control: { type: "number", min: 0 } },
    approved: { control: { type: "number", min: 0 } },
  },
  args: {
    authId: "PA-2026-11873",
    service: "Physical therapy 97110",
    payer: "Aetna",
    patient: "Leslie Alexander",
    status: "Approved",
    used: 17,
    approved: 20,
    unit: "visits",
    expires: "10/01/2026 to 12/31/2026",
    alert: {
      title: "3 visits left",
      body: "Request an extension before the next visit on 10/14.",
      action: "Request Extension",
      onAction: fn(),
    },
    events: [
      {
        title: "Submitted",
        time: "09/24/2026",
        by: "Sam Patel",
        status: "done",
      },
      {
        title: "Approved, 20 visits",
        time: "09/26/2026",
        by: "Aetna",
        status: "done",
        tag: "Approved",
      },
    ],
  },
} satisfies Meta<typeof PriorAuthTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: (args) => (
    <div className="pv-grid">
      <PriorAuthTimeline {...args} />
      <PriorAuthTimeline
        authId="PA-2026-11902"
        service="MRI lumbar spine 72148"
        payer="BCBS IL"
        patient="Ralph Edwards"
        status="Pended"
        alertTone="warning"
        alert={{
          title: "Payer asked for clinical notes",
          body: "Upload the last 2 visit notes and the X-ray report by 10/12.",
          action: "Upload Records",
        }}
        events={[
          {
            title: "Submitted",
            time: "10/01/2026",
            by: "Sam Patel",
            status: "done",
          },
          {
            title: "Pended: more info needed",
            time: "10/03/2026",
            by: "BCBS IL",
            status: "current",
            tag: "Pended",
          },
          { title: "Decision", status: "pending" },
        ]}
      />
    </div>
  ),
};

export const Denied: Story = {
  args: {
    authId: "PA-2026-11755",
    service: "Sleep study 95810",
    payer: "UnitedHealthcare",
    patient: "Jacob Jones",
    status: "Denied",
    used: undefined,
    approved: undefined,
    expires: undefined,
    alertTone: "error",
    alert: {
      title: "Denied: not medically necessary",
      body: "Appeal within 60 days with the home sleep test results.",
      action: "Start Appeal",
    },
    events: [
      {
        title: "Submitted",
        time: "09/12/2026",
        by: "Sam Patel",
        status: "done",
      },
      {
        title: "Denied",
        time: "09/19/2026",
        by: "UnitedHealthcare",
        status: "failed",
        tag: "Denied",
      },
    ],
  },
};

export const UnitsMeterAlone: Story = {
  render: () => (
    <div className="pv-stack">
      <UnitsMeter
        used={12}
        approved={20}
        unit="visits"
        helper="Valid 10/01/2026 to 12/31/2026"
      />
      <UnitsMeter
        used={16}
        approved={20}
        unit="visits"
        label="Visits used, warning"
      />
      <UnitsMeter
        used={19}
        approved={20}
        unit="visits"
        label="Visits used, almost out"
      />
    </div>
  ),
};
