import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StepperForm, type StepperFormStep } from "./StepperForm";

const steps: StepperFormStep[] = [
  { label: "Demographics", content: <p>Demographics fields</p> },
  { label: "Insurance", content: <p>Insurance fields</p>, error: true },
  { label: "Review", content: <p>Review fields</p> },
];

describe("StepperForm", () => {
  it("shows the first step with its subtitle and a Next button naming the next step", () => {
    render(<StepperForm title="Add Patient" steps={steps} />);
    expect(
      screen.getByRole("heading", { name: "Add Patient" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Step 1 of 3 . Demographics")).toBeInTheDocument();
    expect(screen.getByText("Demographics fields")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Back/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Next: Insurance/ }),
    ).toBeInTheDocument();
  });

  it("moves forward and back, reporting the step and keeping focus in the form", async () => {
    const onStep = vi.fn();
    render(<StepperForm title="Add Patient" steps={steps} onStep={onStep} />);
    await userEvent.click(
      screen.getByRole("button", { name: /Next: Insurance/ }),
    );
    expect(onStep).toHaveBeenLastCalledWith(1);
    expect(screen.getByText("Insurance fields")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Insurance" })).toHaveFocus();
    await userEvent.click(screen.getByRole("button", { name: /Back/ }));
    expect(onStep).toHaveBeenLastCalledWith(0);
    expect(screen.getByText("Demographics fields")).toBeInTheDocument();
  });

  it("shows the finish label on the last step and calls onFinish", async () => {
    const onFinish = vi.fn();
    render(
      <StepperForm
        title="Add Patient"
        steps={steps}
        defaultCurrent={2}
        finishLabel="Save Patient"
        onFinish={onFinish}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Save Patient" }));
    expect(onFinish).toHaveBeenCalled();
  });

  it("shows the error summary, Save Draft and Cancel", async () => {
    const onSaveDraft = vi.fn();
    const onCancel = vi.fn();
    render(
      <StepperForm
        title="Add Patient"
        steps={steps}
        errorSummary="Member ID is required."
        onSaveDraft={onSaveDraft}
        onCancel={onCancel}
      />,
    );
    expect(
      screen.getByText("Fix these before you continue"),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Save Draft" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onSaveDraft).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });

  it("is controlled by current", async () => {
    render(<StepperForm title="Add Patient" steps={steps} current={0} />);
    await userEvent.click(
      screen.getByRole("button", { name: /Next: Insurance/ }),
    );
    expect(screen.getByText("Demographics fields")).toBeInTheDocument();
  });
});
