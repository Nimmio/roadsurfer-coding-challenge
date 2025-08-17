import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Autocomplete from "./Autocomplete";
import { fetchStations } from "@/lib/fetch";

//Mocks.
const mockStations = [
  { id: "1", name: "Berlin" },
  { id: "2", name: "Lisabon" },
  { id: "3", name: "Barcelona" },
];

vi.mock("@/lib/fetch", () => ({
  fetchStations: vi.fn(() => Promise.resolve(mockStations)),
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
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });
  //Tests
  it("should render the input and not show the autocomplete dropdown initially", async () => {
    render(<Autocomplete onSelect={mockOnSelect} selectedValue={undefined} />);
    expect(screen.getByPlaceholderText("Search Station")).toBeInTheDocument();

    const card = screen.queryByTestId("mock-card");
    expect(card).not.toBeInTheDocument();
    expect(vi.mocked(fetchStations)).toHaveBeenCalledTimes(1);
  });

  it("should display filtered stations when the user types", async () => {
    const user = userEvent.setup();

    render(<Autocomplete onSelect={mockOnSelect} selectedValue={undefined} />);

    await screen.findByPlaceholderText("Search Station");

    const input = screen.getByPlaceholderText("Search Station");
    await user.type(input, "Li");

    const card = screen.getByTestId("mock-card");
    expect(card).toBeInTheDocument();

    expect(screen.getByText("Berlin")).toBeInTheDocument();
    expect(screen.getByText("Lisabon")).toBeInTheDocument();
  });

  it("should call onSelect and update the input value when a station is selected", async () => {
    const user = userEvent.setup();

    render(<Autocomplete onSelect={mockOnSelect} selectedValue={undefined} />);

    await screen.findByPlaceholderText("Search Station");
    const input = screen.getByPlaceholderText("Search Station");
    await user.type(input, "Ber");

    const berlinButton = screen.getByText("Berlin");

    fireEvent.click(berlinButton);

    expect(mockOnSelect).toHaveBeenCalledWith(mockStations[0]);

    expect(input.value).toBe("Berlin");
  });

  it("should apply 'font-bold' class if the input value matches the selectedValue name", async () => {
    const user = userEvent.setup();

    const selectedStation = mockStations[0];
    const { container } = render(
      <Autocomplete onSelect={mockOnSelect} selectedValue={selectedStation} />
    );

    await screen.findByPlaceholderText("Search Station");
    const input = screen.getByPlaceholderText("Search Station");

    await user.type(input, "Berl");

    const berlinButton = screen.getByText("Berlin");

    fireEvent.click(berlinButton);

    expect(input.value).toBe(selectedStation.name);

    expect(container.querySelector("input").className).toContain("font-bold");
  });
});
