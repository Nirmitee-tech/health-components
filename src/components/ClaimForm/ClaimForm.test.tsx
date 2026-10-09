import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ClaimForm, type ClaimLine } from "./ClaimForm";
import { ClaimLineEditor } from "./index";

const lines: ClaimLine[] = [
  {
    dos: "10/06/2026",
    cpt: "99214",
    mods: "25",
    dx: "A,B",
    units: 1,
    charge: 182,
  },
  {
    dos: "10/06/2026",
    cpt: "9921",
    dx: "Q",
    units: 2,
    charge: 38,
    errors: { cpt: "Enter a 5 character CPT code." },
  },
];

describe("ClaimForm", () => {
  it("renders lines with totals and the claim check", () => {
    render(<ClaimForm defaultLines={lines} />);
    expect(
      screen.getByRole("table", { name: "Service lines" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "CPT / HCPCS line 1" }),
    ).toHaveValue("99214");
    expect(screen.getByText("Total charge $258.00")).toBeInTheDocument();
    expect(screen.getByText("$76.00")).toBeInTheDocument();
    expect(screen.getByText("Claim check passed")).toBeInTheDocument();
    expect(screen.getByText("Payer order: Primary")).toBeInTheDocument();
  });

  it("marks line errors as invalid and describes them", () => {
    render(<ClaimForm defaultLines={lines} errorsCount={1} />);
    const cpt = screen.getByRole("textbox", { name: "CPT / HCPCS line 2" });
    expect(cpt).toHaveAttribute("aria-invalid", "true");
    expect(cpt).toHaveAccessibleDescription("Enter a 5 character CPT code.");
    expect(screen.getByText("1 errors")).toBeInTheDocument();
  });

  it("edits, adds and removes lines, reporting every change", async () => {
    const onChange = vi.fn();
    render(<ClaimForm defaultLines={lines} onChange={onChange} />);
    const charge = screen.getByRole("textbox", { name: "Charge line 1" });
    await userEvent.clear(charge);
    await userEvent.type(charge, "200");
    expect(screen.getByText("Total charge $276.00")).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Add Service Line" }),
    );
    expect(screen.getByRole("textbox", { name: "DOS line 3" })).toHaveValue(
      "10/06/2026",
    );
    expect(onChange).toHaveBeenLastCalledWith(
      expect.arrayContaining([{ dos: "10/06/2026", units: 1 }]),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Remove line 1" }),
    );
    expect(onChange.mock.lastCall![0]).toHaveLength(2);
    expect(
      screen.getByRole("textbox", { name: "CPT / HCPCS line 1" }),
    ).toHaveValue("9921");
  });

  it("submits from the split button", async () => {
    const onSubmit = vi.fn();
    render(<ClaimForm defaultLines={lines} onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Submit Claim" }));
    expect(onSubmit).toHaveBeenCalledWith("submit");
  });

  it("is read-only with a lock banner and no buttons", () => {
    render(<ClaimForm defaultLines={lines} readOnly />);
    expect(
      screen.getByText("Your role can view this claim but not edit it."),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "DOS line 1" })).toHaveAttribute(
      "readonly",
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("is exported as ClaimLineEditor", () => {
    expect(ClaimLineEditor).toBe(ClaimForm);
  });
});
