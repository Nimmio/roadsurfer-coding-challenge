import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Autocomplete from "./Autocomplete";
import { fetchStations } from "@/lib/fetch";
import { useStationStore } from "@/store/station";

// Mocks
const mockStations = [
  { id: "1", name: "Berlin" },
  { id: "2", name: "Lisabon" },
  { id: "3", name: "Barcelona" },
];

vi.mock("@/lib/fetch", () => ({
  fetchStations: vi.fn(() => Promise.resolve(mockStations)),
}));

const mockStore = {
  stations: [],
  selectedStation: undefined,
  setStations: vi.fn(),
  setSelectedStation: vi.fn(),
};

vi.mock("@/store/station", () => ({
  useStationStore: vi.fn((selector) => selector(mockStore)),
}));

vi.mock("./ui/input", () => ({
  Input: vi.fn((props) => (
    <input
      data-testid="mock-input"
      {...props}
      onChange={(e) => props.onChange(e)}
    />
  )),
}));

vi.mock("./ui/button", () => ({
  Button: vi.fn((props) => (
    <button data-testid="mock-button" {...props} onClick={props.onClick}>
      {props.children}
    </button>
  )),
}));

vi.mock("./ui/card", () => ({
  Card: vi.fn((props) => <div data-testid="mock-card" {...props} />),
}));

describe("Autocomplete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.stations = [...mockStations];
    mockStore.selectedStation = undefined;
    mockStore.setStations.mockImplementation((stations) => {
      mockStore.stations = stations;
    });
    mockStore.setSelectedStation.mockImplementation((station) => {
      mockStore.selectedStation = station;
    });
  });

  // Tests
  it("should render the input and not show the autocomplete dropdown initially", async () => {
    render(<Autocomplete />);
    expect(screen.getByPlaceholderText("Search Station")).toBeInTheDocument();

    const card = screen.queryByTestId("mock-card");
    expect(card).not.toBeInTheDocument();

    await waitFor(() => {
      expect(vi.mocked(fetchStations)).toHaveBeenCalledTimes(1);
    });
  });

  it("should display filtered stations when the user types", async () => {
    const user = userEvent.setup();
    render(<Autocomplete />);

    mockStore.stations = mockStations;

    const input = screen.getByPlaceholderText("Search Station");
    await user.type(input, "Li");

    await waitFor(() => {
      const card = screen.getByTestId("mock-card");
      expect(card).toBeInTheDocument();
    });

    expect(screen.getByText("Lisabon")).toBeInTheDocument();
    expect(screen.queryByText("Barcelona")).not.toBeInTheDocument();
  });

  it("should call setSelectedStation and update the input value when a station is selected", async () => {
    const user = userEvent.setup();
    render(<Autocomplete />);

    mockStore.stations = mockStations;

    const input = screen.getByPlaceholderText("Search Station");
    await user.type(input, "Ber");

    const berlinButton = screen.getByText("Berlin");

    fireEvent.click(berlinButton);

    expect(mockStore.setSelectedStation).toHaveBeenCalledWith(mockStations[0]);

    mockStore.selectedStation = mockStations[0];
    mockStore.stations = [];
    render(<Autocomplete />);
  });

  it("should apply 'font-bold' class if the input value matches the selectedStation name", async () => {
    const user = userEvent.setup();

    mockStore.selectedStation = mockStations[0];
    mockStore.stations = mockStations;

    const { container } = render(<Autocomplete />);

    const input = screen.getByPlaceholderText("Search Station");

    await user.type(input, "Berl");
    const berlinButton = screen.getByText("Berlin");

    fireEvent.click(berlinButton);
    expect(input.value).toBe("Berlin");
    expect(input.className).toContain("font-bold");
  });
});
