export type station = { id: string; name: string; bookings: booking[] };

export type booking = {
  id: string;
  pickupReturnStationId: string;
  customerName: string;
  startDate: string;
  endDate: string;
};

const stationApiUrl: string =
  "https://605c94c36d85de00170da8b4.mockapi.io/stations";
const bookingApiUrl: string =
  "https://605c94c36d85de00170da8b4.mockapi.io/stations/{station-id}/bookings/{booking-id}";

/**
 * Fetches the Stations from the Api
 * @returns a Promise containing the fetched Stations
 */
export const fetchStations = async (): Promise<station[] | undefined> => {
  try {
    const response = await fetch(stationApiUrl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return (await response.json()) as station[];
  } catch (error: unknown) {
    console.error(error.message);
  }
};

const getBookingDetailsUrl = ({
  stationId,
  bookingId,
}: {
  stationId: string;
  bookingId: string;
}): string => {
  return bookingApiUrl
    .replace("{station-id}", stationId)
    .replace("{booking-id}", bookingId);
};

export const fetchBookingDetails = async ({
  stationId,
  bookingId,
}: {
  stationId: string;
  bookingId: string;
}): Promise<booking | undefined> => {
  try {
    const response = await fetch(
      getBookingDetailsUrl({ stationId, bookingId })
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
  }
};

export const fetchAndReturnStationNameForId = async (
  stationId: string
): Promise<string | undefined> => {
  try {
    const response = await fetch(`${stationApiUrl}/${stationId}`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = (await response.json()) as station;
    return result.name;
  } catch (error: unknown) {
    console.error(error.message);
  }
};
