import { create } from "zustand";

export type station = { id: string; name: string; bookings: booking[] };

export type booking = {
  id: string;
  pickupReturnStationId: string;
  customerName: string;
  startDate: string;
  endDate: string;
};

interface StationState {
  stations: station[];
  selectedStation: station | undefined;
  selectedBookingId: string | undefined;
  setStations: (newStations: station[]) => void;
  setSelectedStation: (newSelectedStation: station) => void;
  unSetSelectedStation: () => void;
  setSelectedBookingId: (newSelectedBooking: string) => void;
  unSetSelectedBookingId: () => void;
}

export const useStationStore = create<StationState>()((set) => ({
  stations: [],
  selectedStation: undefined,
  selectedBookingId: undefined,
  setStations: (newStations) => set(() => ({ stations: newStations })),
  setSelectedStation: (newSelectedStation) =>
    set(() => ({ selectedStation: newSelectedStation })),
  unSetSelectedStation: () => set(() => ({ selectedStation: undefined })),
  setSelectedBookingId: (newSelectedBookingId) =>
    set(() => ({ selectedBookingId: newSelectedBookingId })),
  unSetSelectedBookingId: () => set(() => ({ selectedBookingId: undefined })),
}));
