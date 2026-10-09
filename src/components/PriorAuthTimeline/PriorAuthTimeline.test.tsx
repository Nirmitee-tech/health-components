import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PriorAuthTimeline, UnitsMeter } from "./PriorAuthTimeline";
import { PriorAuthCard } from "./index";

describe("PriorAuthTimeline", () => {
  it("renders title, status, units meter and history", () => {
    render(
      <PriorAuthTimeline
        authId="PA-2026-11873"
        service="Physical therapy 97110"
        payer="Aetna"
        patient="Leslie Alexander"
        status="Approved"
        used={17}
        approved={20}
        unit="visits"
        expires="10/01/2026 to 12/31/2026"
        events={[{ title: "Submitted", time: "09/24/2026", by: "Sam Patel" }]}
      />,
    );
    expect(
      screen.getByRole("heading", {
        name: "PA-2026-11873 . Physical therapy 97110",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Aetna . Leslie Alexander")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();
    const meter = screen.getByRole("meter", { name: "Units used" });
    expect(meter).toHaveAttribute("aria-valuenow", "17");
    expect(
      screen.getByText("Valid 10/01/2026 to 12/31/2026"),
    ).toBeInTheDocument();
    expect(screen.getByText("Submitted")).toBeInTheDocument();
  });

  it("omits the meter without approved units and runs the alert action", async () => {
    const onAction = vi.fn();
    render(
      <PriorAuthTimeline
        status="Pended"
        alert={{
          title: "Payer asked for clinical notes",
          action: "Upload Records",
          onAction,
        }}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Prior authorization" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Upload Records" }),
    );
    expect(onAction).toHaveBeenCalled();
  });

  it("UnitsMeter is a meter with a unit text", () => {
    render(<UnitsMeter used={12} approved={20} unit="visits" />);
    expect(screen.getByRole("meter", { name: "Units used" })).toHaveAttribute(
      "aria-valuemax",
      "20",
    );
  });

  it("is exported as PriorAuthCard", () => {
    expect(PriorAuthCard).toBe(PriorAuthTimeline);
  });
});
