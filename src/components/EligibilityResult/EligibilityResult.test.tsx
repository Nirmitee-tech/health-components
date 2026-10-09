import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EligibilityResult } from "./EligibilityResult";

describe("EligibilityResult", () => {
  it("shows an active result with benefits and the deductible meter", async () => {
    const onRerun = vi.fn();
    render(
      <EligibilityResult
        payer="Aetna"
        headline="Active: Aetna PPO"
        checkedAt="10/09/2026 9:12 AM"
        benefits={[["Copay, office visit", "$25"]]}
        deductible={[1180, 1500]}
        onRerun={onRerun}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Response (271)" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Active: Aetna PPO")).toBeInTheDocument();
    expect(screen.getByText("$25")).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "Deductible met" }),
    ).toHaveAttribute("aria-valuetext", "$1,180 of $1,500");
    expect(
      screen.queryByRole("button", { name: "Fix Coverage Details" }),
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Re-run" }));
    expect(onRerun).toHaveBeenCalled();
  });

  it("shows the AAA code, meaning and next step on error", () => {
    render(
      <EligibilityResult
        state="error"
        payer="Aetna"
        aaa="72"
        headline="Invalid member ID"
        meaning="No member with that ID."
        todo="Fix the ID."
      />,
    );
    expect(screen.getByText("AAA 72: Invalid member ID")).toBeInTheDocument();
    expect(screen.getByText("What it means:")).toBeInTheDocument();
    expect(screen.getByText("What to do:")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Fix Coverage Details" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Self-pay Good Faith Estimate" }),
    ).toBeInTheDocument();
  });

  it("uses the default headline by state", () => {
    render(
      <EligibilityResult
        state="inactive"
        payer="Aetna"
        benefits={[["Copay", "$25"]]}
      />,
    );
    expect(screen.getByText("Inactive")).toBeInTheDocument();
    expect(screen.queryByText("$25")).not.toBeInTheDocument();
  });

  it("shows a spinner while waiting", () => {
    render(<EligibilityResult state="waiting" payer="Aetna" />);
    expect(
      screen.getByText("Waiting for Aetna... most answer in 1 to 5 seconds."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Re-run" }),
    ).not.toBeInTheDocument();
  });
});
