import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PermissionMatrix, type PermissionRow } from "./PermissionMatrix";

const rows: PermissionRow[] = [
  {
    module: "Clinical",
    action: "Sign visit notes",
    levels: { Provider: "approve", Biller: "none" },
  },
  {
    module: "Clinical",
    action: "Enter vitals",
    levels: { Provider: "edit", Biller: "edit" },
  },
  { module: "Billing", action: "Edit claims", levels: { Provider: "view" } },
];

describe("PermissionMatrix", () => {
  it("renders a table with role columns, action row headers and level tags", () => {
    render(
      <PermissionMatrix roles={["Provider", "Biller"]} defaultRows={rows} />,
    );
    const table = screen.getByRole("table", { name: "Permissions by role" });
    expect(
      within(table).getByRole("columnheader", { name: "Provider" }),
    ).toBeInTheDocument();
    expect(
      within(table).getByRole("rowheader", { name: "Sign visit notes" }),
    ).toBeInTheDocument();
    const row = within(table).getByRole("row", { name: /Edit claims/ });
    // missing role reads as None
    expect(within(row).getByText("View")).toBeInTheDocument();
    expect(within(row).getByText("None")).toBeInTheDocument();
    // module shown once per group
    expect(within(table).getAllByText("Clinical")).toHaveLength(1);
  });

  it("hides matching rows when only differences is switched on", async () => {
    const onOnly = vi.fn();
    render(
      <PermissionMatrix
        roles={["Provider", "Biller"]}
        defaultRows={rows}
        onOnlyDifferencesChange={onOnly}
      />,
    );
    await userEvent.click(
      screen.getByRole("switch", { name: "Only show differences" }),
    );
    expect(onOnly).toHaveBeenCalledWith(true);
    expect(
      screen.queryByRole("rowheader", { name: "Enter vitals" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("rowheader", { name: "Edit claims" }),
    ).toBeInTheDocument();
  });

  it("shows the empty text when every row matches", () => {
    render(
      <PermissionMatrix
        roles={["Provider", "Biller"]}
        defaultRows={[rows[1]!]}
        defaultOnlyDifferences
      />,
    );
    expect(
      screen.getByText("These roles have the same level on every action."),
    ).toBeInTheDocument();
  });

  it("edits a level and reports row, role and level", async () => {
    const onChange = vi.fn();
    const onRowsChange = vi.fn();
    render(
      <PermissionMatrix
        roles={["Provider", "Biller"]}
        defaultRows={rows}
        editable
        onChange={onChange}
        onRowsChange={onRowsChange}
      />,
    );
    const sel = screen.getByRole("combobox", {
      name: "Sign visit notes for Biller",
    });
    await userEvent.selectOptions(sel, "view");
    expect(sel).toHaveValue("view");
    expect(onChange).toHaveBeenCalledWith(rows[0], "Biller", "view");
    expect(onRowsChange.mock.calls[0]![0][0].levels).toEqual({
      Provider: "approve",
      Biller: "view",
    });
  });

  it("is controlled by rows", async () => {
    render(<PermissionMatrix roles={["Provider"]} rows={rows} editable />);
    const sel = screen.getByRole("combobox", {
      name: "Edit claims for Provider",
    });
    await userEvent.selectOptions(sel, "edit");
    expect(sel).toHaveValue("view");
  });
});
