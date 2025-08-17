import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Calendar from "./Calendar";
import { startOfWeek, subWeeks, addWeeks, isSameDay, parseISO } from "date-fns";
import type { booking } from "@/lib/fetch";

//Mocks
vi.mock("date-fns", async () => {
  const actual = await vi.importActual("date-fns");
  return {
    ...actual,
    startOfWeek: vi.fn(),
    subWeeks: vi.fn(),
    addWeeks: vi.fn(),
    isSameDay: vi.fn(),
    parseISO: vi.fn(),
  };
});

vi.mock("@/lib/utils", () => ({
  formatDate: vi.fn((date) => `Mock-Date-${date.getDate()}`),
}));

vi.mock("./ui/card", () => ({
  Card: vi.fn(({ children }) => <div data-testid="mock-card">{children}</div>),
}));

vi.mock("./ui/badge", () => ({
  Badge: vi.fn((props) => (
    <span data-testid="mock-badge" {...props} onClick={props.onClick}>
      {props.children}
    </span>
  )),
}));

vi.mock("./ui/button", () => ({
  Button: vi.fn((props) => (
    <button data-testid="mock-button" {...props} onClick={props.onClick}>
      {props.children}
    </button>
  )),
}));
//Tests
describe("Calendar", () => {
  const mockOnBookingSelect = vi.fn();
  const mockBookings: booking[] = [
    {
      id: "booking-1",
      customerName: "Jane Smith",
      startDate: "2024-06-17T00:00:00.000Z",
      endDate: "2024-06-17T00:00:00.000Z",
      pickupReturnStationId: "1",
    },
    {
      id: "booking-2",
      customerName: "Alex Johnson",
      startDate: "2024-06-18T00:00:00.000Z",
      endDate: "2024-06-18T00:00:00.000Z",
      pickupReturnStationId: "1",
    },
    {
      id: "booking-3",
      customerName: "Chris Lee",
      startDate: "2024-06-20T00:00:00.000Z",
      endDate: "2024-06-25T00:00:00.000Z",
      pickupReturnStationId: "1",
    },
  ];

  const mockSelectedStation = {
    id: "1",
    name: "Test Station",
    bookings: mockBookings,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    const mockStartDate = new Date("2024-06-16T00:00:00.000Z");
    vi.mocked(startOfWeek).mockReturnValue(mockStartDate);
    vi.mocked(addWeeks).mockReturnValue(new Date("2024-06-23T00:00:00.000Z"));
    vi.mocked(subWeeks).mockReturnValue(new Date("2024-06-09T00:00:00.000Z"));

    vi.mocked(isSameDay).mockImplementation(
      (dateLeft, dateRight) => dateLeft.toString() === dateRight.toString()
    );

    vi.mocked(parseISO).mockImplementation(
      (dateString) => new Date(dateString)
    );
  });
  //Tests
  it("should render 7 days of the week based on the start date", () => {
    render(
      <Calendar
        selectedStation={mockSelectedStation}
        onBookingSelect={mockOnBookingSelect}
      />
    );
    expect(screen.getAllByTestId("mock-card")).toHaveLength(8); // 7 Week Days + 1 Wrapper Card
  });

  it("should display the correct formatted date for each day", () => {
    render(
      <Calendar
        selectedStation={mockSelectedStation}
        onBookingSelect={mockOnBookingSelect}
      />
    );
    expect(screen.getByText("Mock-Date-16")).toBeInTheDocument();
    expect(screen.getByText("Mock-Date-17")).toBeInTheDocument();
  });

  it("should display bookings for the correct dates", () => {
    render(
      <Calendar
        selectedStation={mockSelectedStation}
        onBookingSelect={mockOnBookingSelect}
      />
    );

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Alex Johnson")).toBeInTheDocument();
    expect(screen.getByText("Chris Lee")).toBeInTheDocument();

    expect(screen.getAllByTestId("mock-badge")).toHaveLength(3);
  });

  it("should call onBookingSelect with the correct id when a booking badge is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Calendar
        selectedStation={mockSelectedStation}
        onBookingSelect={mockOnBookingSelect}
      />
    );

    const bookingBadge = screen.getByText("Jane Smith");
    await user.click(bookingBadge);

    expect(mockOnBookingSelect).toHaveBeenCalledTimes(1);
    expect(mockOnBookingSelect).toHaveBeenCalledWith("booking-1");
  });

  it("should navigate to the next week when 'Next Week' button is clicked", () => {
    render(
      <Calendar
        selectedStation={mockSelectedStation}
        onBookingSelect={mockOnBookingSelect}
      />
    );
    const nextButton = screen.getByText("Next Week");
    fireEvent.click(nextButton);

    expect(addWeeks).toHaveBeenCalledTimes(1);
  });

  it("should navigate to the previous week when 'Previous Week' button is clicked", () => {
    render(
      <Calendar
        selectedStation={mockSelectedStation}
        onBookingSelect={mockOnBookingSelect}
      />
    );
    const prevButton = screen.getByText("Previous Week");
    fireEvent.click(prevButton);

    expect(subWeeks).toHaveBeenCalledTimes(1);
  });

  it("should render without bookings if selectedStation is undefined", () => {
    render(
      <Calendar
        selectedStation={undefined}
        onBookingSelect={mockOnBookingSelect}
      />
    );

    expect(screen.getAllByTestId("mock-card")).toHaveLength(8); // 7 Calendar Cards + 1 Wrapper Card;
    expect(screen.queryByTestId("mock-badge")).not.toBeInTheDocument();
  });

  it("should render without bookings if the station has no bookings", () => {
    const emptyStation = {
      id: "station-2",
      name: "Empty Station",
      bookings: [],
    };
    render(
      <Calendar
        selectedStation={emptyStation}
        onBookingSelect={mockOnBookingSelect}
      />
    );

    expect(screen.getAllByTestId("mock-card")).toHaveLength(8); // 7 Calendar Cards + 1 Wrapper Card;
    expect(screen.queryByTestId("mock-badge")).not.toBeInTheDocument();
  });
});
