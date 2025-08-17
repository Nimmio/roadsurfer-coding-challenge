import Autocomplete from "./components/Autocomplete";
import Booking from "./components/Booking";
import Calendar from "./components/Calendar";
import { useStationStore } from "./store/station";

function App() {
  const selectedBookingId = useStationStore((state) => state.selectedBookingId);
  return (
    <div className="container mx-auto pt-4">
      {selectedBookingId === undefined ? (
        <div className="flex flex-col space-y-4 ">
          <Autocomplete />
          <Calendar />
        </div>
      ) : (
        <Booking />
      )}
    </div>
  );
}

export default App;
