import { useState } from "react";
import Autocomplete from "./components/Autocomplete";
import { type station } from "./lib/fetch";
import Booking from "./components/Booking";
import Calendar from "./components/Calendar";

function App() {
  const [selectedStation, setSelectedStation] = useState<station | undefined>(
    undefined
  );
  const [selectedBookingId, setSelectedBookingId] = useState<
    string | undefined
  >(undefined);

  const handleBookingBack = () => {
    setSelectedStation(undefined);
    setSelectedBookingId(undefined);
  };
  return (
    <div className="container mx-auto pt-4">
      {selectedBookingId === undefined ? (
        <div className="flex flex-col space-y-4 ">
          <Autocomplete
            onSelect={(selectedStation) => setSelectedStation(selectedStation)}
            selectedValue={selectedStation}
          />
          <Calendar
            selectedStation={selectedStation}
            onBookingSelect={(bookingId) => setSelectedBookingId(bookingId)}
          />
        </div>
      ) : (
        <Booking
          bookingId={selectedBookingId}
          stationId={selectedStation?.id as string}
          onBack={() => handleBookingBack()}
        />
      )}
    </div>
  );
}

export default App;
