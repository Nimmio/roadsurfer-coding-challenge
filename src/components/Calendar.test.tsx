import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Calendar from "./Calendar";
import { type booking } from "@/store/station";
import { startOfWeek, subWeeks, addWeeks, isSameDay, parseISO } from "date-fns";

// Mock data
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

const mockStore = {
  selectedStation: undefined,
  setSelectedBookingId: vi.fn(),
};

vi.mock("@/store/station", () => ({
  useStationStore: vi.fn((selector) => selector(mockStore)),
}));

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
  Card: vi.fn(({ children, ...props }) => (
    <div data-testid="mock-card" {...props}>
      {children}
    </div>
  )),
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

// Tests
describe("Calendar", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockStore.selectedStation = mockSelectedStation;
    mockStore.setSelectedBookingId = vi.fn();

    const mockStartDate = new Date("2024-06-16T00:00:00.000Z");
    vi.mocked(startOfWeek).mockReturnValue(mockStartDate);
    vi.mocked(addWeeks).mockReturnValue(new Date("2024-06-23T00:00:00.000Z"));
    vi.mocked(subWeeks).mockReturnValue(new Date("2024-06-09T00:00:00.000Z"));
    vi.mocked(isSameDay).mockImplementation(
      (dateLeft, dateRight) =>
        dateLeft.toISOString().split("T")[0] ===
        dateRight.toISOString().split("T")[0]
    );
    vi.mocked(parseISO).mockImplementation(
      (dateString) => new Date(dateString)
    );
  });

  it("should render 7 days of the week based on the start date", () => {
    render(<Calendar />);
    expect(screen.getAllByTestId("mock-card")).toHaveLength(8); // 7 Week Days + 1 Wrapper Card
  });

  it("should display the correct formatted date for each day", () => {
    render(<Calendar />);
    expect(screen.getByText("Mock-Date-16")).toBeInTheDocument();
    expect(screen.getByText("Mock-Date-17")).toBeInTheDocument();
  });

  it("should display bookings for the correct dates", () => {
    render(<Calendar />);
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Alex Johnson")).toBeInTheDocument();
    expect(screen.getByText("Chris Lee")).toBeInTheDocument();
    expect(screen.getAllByTestId("mock-badge")).toHaveLength(3);
  });

  it("should call setSelectedBookingId with the correct id when a booking badge is clicked", async () => {
    const user = userEvent.setup();
    render(<Calendar />);

    const bookingBadge = screen.getByText("Jane Smith");
    await user.click(bookingBadge);

    expect(mockStore.setSelectedBookingId).toHaveBeenCalledTimes(1);
    expect(mockStore.setSelectedBookingId).toHaveBeenCalledWith("booking-1");
  });

  it("should navigate to the next week when 'Next Week' button is clicked", () => {
    render(<Calendar />);
    const nextButton = screen.getByText("Next Week");
    fireEvent.click(nextButton);
    expect(addWeeks).toHaveBeenCalledTimes(1);
  });

  it("should navigate to the previous week when 'Previous Week' button is clicked", () => {
    render(<Calendar />);
    const prevButton = screen.getByText("Previous Week");
    fireEvent.click(prevButton);
    expect(subWeeks).toHaveBeenCalledTimes(1);
  });

  it("should render without bookings if no station is selected", () => {
    mockStore.selectedStation = undefined;

    render(<Calendar />);
    // There are still 7 calendar cards and one wrapper card
    expect(screen.getAllByTestId("mock-card")).toHaveLength(8);
    expect(screen.queryByTestId("mock-badge")).not.toBeInTheDocument();
  });

  it("should render without bookings if the station has no bookings", () => {
    const emptyStation = {
      id: "station-2",
      name: "Empty Station",
      bookings: [],
    };
    mockStore.selectedStation = emptyStation;

    render(<Calendar />);
    expect(screen.getAllByTestId("mock-card")).toHaveLength(8);
    expect(screen.queryByTestId("mock-badge")).not.toBeInTheDocument();
  });
});
