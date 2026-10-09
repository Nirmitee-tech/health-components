import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { InsuranceCoverageCard, type Coverage } from "./InsuranceCoverageCard";
import { CoverageStack } from "./index";

const coverages: Coverage[] = [
  {
    payer: "AARP Medicare Supplement",
    plan: "Plan G",
    memberId: "AR 3388 1021",
    status: "Active",
  },
  {
    payer: "Medicare Part B",
    plan: "Original Medicare",
    memberId: "1EG4-TE5-MK72",
    status: "Active",
  },
];

const order = () =>
  screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);

describe("InsuranceCoverageCard", () => {
  it("lists coverages in billing order with defaults", () => {
    render(<InsuranceCoverageCard defaultCoverages={coverages} />);
    expect(order()).toEqual(["AARP Medicare Supplement", "Medicare Part B"]);
    expect(screen.getByText("Primary")).toBeInTheDocument();
    expect(screen.getByText("Secondary")).toBeInTheDocument();
    expect(screen.getAllByText("Self")).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: "Move AARP Medicare Supplement up" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Move Medicare Part B down" }),
    ).toBeDisabled();
  });

  it("reorders with the arrows, reports the order and keeps focus on the moved coverage", async () => {
    const onReorder = vi.fn();
    render(
      <InsuranceCoverageCard
        defaultCoverages={coverages}
        onReorder={onReorder}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Move Medicare Part B up" }),
    );
    expect(order()).toEqual(["Medicare Part B", "AARP Medicare Supplement"]);
    expect(onReorder).toHaveBeenCalledWith([coverages[1], coverages[0]]);
    // its up arrow is now disabled, so focus moves to its down arrow
    expect(
      screen.getByRole("button", { name: "Move Medicare Part B down" }),
    ).toHaveFocus();
  });

  it("shows the suggested order warning and its actions", async () => {
    const onApply = vi.fn();
    render(
      <InsuranceCoverageCard
        defaultCoverages={coverages}
        suggested="Medicare Part B first"
        onApplySuggested={onApply}
      />,
    );
    expect(
      screen.getByText("The order on file does not match the suggested order"),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Apply Suggested Order" }),
    );
    expect(onApply).toHaveBeenCalled();
  });

  it("runs row actions", async () => {
    const onCheck = vi.fn();
    const onAction = vi.fn();
    render(
      <InsuranceCoverageCard
        defaultCoverages={coverages}
        onCheckEligibility={onCheck}
        onCoverageAction={onAction}
      />,
    );
    await userEvent.click(
      screen.getAllByRole("button", { name: "Check Eligibility" })[0]!,
    );
    expect(onCheck).toHaveBeenCalledWith(coverages[0]);
    await userEvent.click(
      screen.getByRole("button", { name: "More for Medicare Part B" }),
    );
    await userEvent.click(
      screen.getByRole("menuitem", { name: "Start prior auth" }),
    );
    expect(onAction).toHaveBeenCalledWith("prior-auth", coverages[1]);
  });

  it("hides arrows and Add Coverage when readOnly; shows self-pay", () => {
    render(
      <InsuranceCoverageCard defaultCoverages={coverages} readOnly selfPay />,
    );
    expect(
      screen.queryByRole("button", { name: /Move/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add Coverage" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Self-pay")).toBeInTheDocument();
  });

  it("is exported as CoverageStack", () => {
    expect(CoverageStack).toBe(InsuranceCoverageCard);
  });
});
