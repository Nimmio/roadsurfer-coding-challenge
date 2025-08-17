export type station = { id: string; name: string; bookings: booking[] };

type booking = {
  id: string;
  pickupReturnStationId: string;
  customerName: string;
  startDate: string;
  endDate: string;
};

const stationApiUrl: string =
  "https://605c94c36d85de00170da8b4.mockapi.io/stations";

export const fetchStationsAndFilter = async (
  input: string
): Promise<station[] | undefined> => {
  try {
    const response = await fetch(stationApiUrl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = (await response.json()) as station[];
    return result.filter((station) =>
      station.name.toLowerCase().includes(input.toLowerCase())
    );
  } catch (error: unknown) {
    console.error(error.message);
  }
};
