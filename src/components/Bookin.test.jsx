import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Booking from "./Booking";
import {
  fetchAndReturnStationNameForId,
  fetchBookingDetails,
} from "@/lib/fetch";
import { useStationStore } from "@/store/station";
import { format } from "date-fns";

// Mock data
const mockBooking = {
  id: "booking-123",
  customerName: "John Doe",
  startDate: "2024-01-10T00:00:00.000Z",
  endDate: "2024-01-20T00:00:00.000Z",
};
const mockStation = {
  id: "station-456",
  name: "Mock Station Name",
};

vi.mock("@/lib/fetch", () => ({
  fetchAndReturnStationNameForId: vi.fn(() =>
    Promise.resolve(mockStation.name)
  ),
  fetchBookingDetails: vi.fn(() => Promise.resolve(mockBooking)),
}));

const mockStore = {
  selectedStation: undefined,
  selectedBookingId: undefined,
  unSetSelectedBookingId: vi.fn(),
};

vi.mock("@/store/station", () => ({
  useStationStore: vi.fn((selector) => selector(mockStore)),
}));

vi.mock("@/lib/utils", () => ({
  formatDate: (date) => format(date, "MM/dd/yyyy"),
}));

vi.mock("./ui/card", () => ({
  Card: vi.fn(({ children }) => <div data-testid="mock-card">{children}</div>),
  CardHeader: vi.fn(({ children }) => (
    <div data-testid="mock-card-header">{children}</div>
  )),
  CardTitle: vi.fn(({ children }) => (
    <h2 data-testid="mock-card-title">{children}</h2>
  )),
  CardContent: vi.fn(({ children }) => (
    <div data-testid="mock-card-content">{children}</div>
  )),
  CardFooter: vi.fn(({ children }) => (
    <div data-testid="mock-card-footer">{children}</div>
  )),
}));

vi.mock("./ui/button", () => ({
  Button: vi.fn((props) => (
    <button data-testid="mock-button" {...props} onClick={props.onClick}>
      {props.children}
    </button>
  )),
}));

vi.mock("./ui/table", () => ({
  Table: vi.fn(({ children }) => (
    <table data-testid="mock-table">{children}</table>
  )),
  TableBody: vi.fn(({ children }) => (
    <tbody data-testid="mock-table-body">{children}</tbody>
  )),
  TableCell: vi.fn(({ children }) => (
    <td data-testid="mock-table-cell">{children}</td>
  )),
  TableRow: vi.fn(({ children }) => (
    <tr data-testid="mock-table-row">{children}</tr>
  )),
}));

// Tests
describe("Booking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.selectedStation = mockStation;
    mockStore.selectedBookingId = mockBooking.id;
    mockStore.unSetSelectedBookingId = vi.fn();
  });

  it("should display a loading message initially", () => {
    mockStore.selectedStation = undefined;
    mockStore.selectedBookingId = undefined;

    render(<Booking />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("should fetch and display booking details after data is loaded", async () => {
    render(<Booking />);

    const table = await screen.findByTestId("mock-table");
    expect(table).toBeInTheDocument();

    expect(fetchBookingDetails).toHaveBeenCalledWith({
      stationId: mockStation.id,
      bookingId: mockBooking.id,
    });
    expect(fetchAndReturnStationNameForId).toHaveBeenCalledWith(mockStation.id);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("01/10/2024")).toBeInTheDocument();
    expect(screen.getByText("01/20/2024")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Mock Station Name")).toBeInTheDocument();
  });

  it("should call the unSetSelectedBookingId store action when the 'Back' button is clicked", async () => {
    render(<Booking />);

    await screen.findByText("Back");
    const backButton = screen.getByText("Back");
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);

    expect(mockStore.unSetSelectedBookingId).toHaveBeenCalledTimes(1);
  });
});
