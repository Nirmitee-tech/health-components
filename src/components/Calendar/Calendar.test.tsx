import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Calendar, type CalendarAppointment } from "./Calendar";
import { ScheduleCalendar } from "./index";

const appts: CalendarAppointment[] = [
  {
    day: 9,
    slot: "8:00 AM",
    time: "8:00",
    patient: "Henna West",
    type: "Follow-Up",
    status: "Completed",
  },
  {
    day: 8,
    slot: "8:00 AM",
    time: "8:00",
    patient: "Jacob Jones",
    type: "Well Child",
    status: "Scheduled",
  },
  {
    date: "2026-11-03",
    time: "9:00",
    patient: "Nora Scott",
    type: "Therapy 50",
    status: "Confirmed",
  },
];

describe("Calendar", () => {
  it("renders the week of the date as a grid with today ringed", () => {
    render(
      <Calendar
        defaultDate="2026-10-09"
        today="2026-10-09"
        appointments={appts}
      />,
    );
    expect(screen.getByText("Friday, October 9, 2026")).toBeInTheDocument();
    const grid = screen.getByRole("grid", { name: "Week of October 4, 2026" });
    const cells = within(grid).getAllByRole("gridcell");
    expect(cells).toHaveLength(7);
    expect(cells[0]).toHaveTextContent("Sun 4");
    const today = within(grid).getByRole("gridcell", {
      name: "Friday, October 9, 2026",
    });
    expect(today).toHaveClass("is-today");
    expect(
      within(today).getByRole("button", { name: /Henna West/ }),
    ).toBeInTheDocument();
  });

  it("switches views; the day view shows only that day and books free slots", async () => {
    const onBook = vi.fn();
    const onViewChange = vi.fn();
    render(
      <Calendar
        defaultDate="2026-10-09"
        appointments={appts}
        onBook={onBook}
        onViewChange={onViewChange}
        blocks={{ "12:00 PM": "Lunch" }}
      />,
    );
    await userEvent.click(screen.getByRole("radio", { name: "Day" }));
    expect(onViewChange).toHaveBeenCalledWith("day");
    const grid = screen.getByRole("grid", { name: /Day schedule/ });
    expect(
      within(grid).getByRole("button", { name: /Henna West/ }),
    ).toBeInTheDocument();
    expect(
      within(grid).queryByRole("button", { name: /Jacob Jones/ }),
    ).not.toBeInTheDocument();
    expect(within(grid).getByText("Lunch")).toBeInTheDocument();
    await userEvent.click(
      within(grid).getByRole("button", { name: "+ Book 8:20 AM" }),
    );
    expect(onBook).toHaveBeenCalledWith("2026-10-09", "8:20 AM");
  });

  it("renders the month with dimmed outside days, counts and column headers", () => {
    render(
      <Calendar
        defaultView="month"
        defaultDate="2026-10-09"
        appointments={appts}
        monthBlocks={{ 16: "CME" }}
      />,
    );
    const grid = screen.getByRole("grid", { name: "October 2026" });
    expect(within(grid).getAllByRole("columnheader")).toHaveLength(7);
    // October 2026 starts on a Thursday: 4 lead days + 31 = 35 cells
    expect(within(grid).getAllByRole("gridcell")).toHaveLength(35);
    expect(
      within(grid).getByRole("gridcell", {
        name: "Wednesday, September 30, 2026",
      }),
    ).toHaveClass("is-dim");
    expect(
      within(grid).getByRole("gridcell", { name: "Friday, October 9, 2026" }),
    ).toHaveTextContent("1 appts");
    expect(within(grid).getByText("CME")).toBeInTheDocument();
  });

  it("navigates by view and back to today", async () => {
    const onNavigate = vi.fn();
    render(
      <Calendar
        defaultView="month"
        defaultDate="2026-10-09"
        appointments={appts}
        onNavigate={onNavigate}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(onNavigate).toHaveBeenCalledWith("next", "2026-11-09");
    const grid = screen.getByRole("grid", { name: "November 2026" });
    expect(
      within(grid).getByRole("button", { name: /Nora Scott/ }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Today" }));
    expect(
      screen.getByRole("grid", { name: "October 2026" }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(
      screen.getByRole("grid", { name: "September 2026" }),
    ).toBeInTheDocument();
  });

  it("colours chips by type from the Color by select and reports chip clicks", async () => {
    const onClick = vi.fn();
    render(
      <Calendar
        defaultDate="2026-10-09"
        appointments={appts}
        colorBy
        onAppointmentClick={onClick}
      />,
    );
    const chip = screen.getByRole("button", { name: /Henna West/ });
    expect(chip).toHaveClass("co-ap-s-Completed");
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Color by" }),
      "type",
    );
    expect(screen.getByRole("button", { name: /Henna West/ })).not.toHaveClass(
      "co-ap-s-Completed",
    );
    await userEvent.click(screen.getByRole("button", { name: /Henna West/ }));
    expect(onClick).toHaveBeenCalledWith(appts[0]);
  });

  it("is exported as ScheduleCalendar", () => {
    expect(ScheduleCalendar).toBe(Calendar);
  });
});
