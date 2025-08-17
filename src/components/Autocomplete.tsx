import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { fetchStations } from "@/lib/fetch";
import { useStationStore, type station } from "@/store/station";

/**
 * Filter Stations using the Value from Autocomplete Input
 * @param {string} filterString The Autocomplete Input used to Filter Stations
 * @returns {station[]} Either an array with stations or an empty array
 */
const filterStations = ({
  filterString,
  stations,
}: {
  filterString: string;
  stations: station[];
}): station[] => {
  return stations.filter((station) =>
    station.name.toLowerCase().includes(filterString.toLowerCase())
  );
};

const Autocomplete = () => {
  const [inputValue, setinputValue] = useState<string>("");
  const [autocompleteValues, setautocompleteValues] = useState<station[]>([]);
  //Store
  const stations = useStationStore((state) => state.stations);
  const setStations = useStationStore((state) => state.setStations);
  const setSelectedStation = useStationStore(
    (state) => state.setSelectedStation
  );
  const selectedstation = useStationStore((state) => state.selectedStation);
  //Fetch All Stations and save them to State
  useEffect(() => {
    fetchStations().then((stations) => {
      setStations(stations as station[]);
    });
  }, [setStations]);

  //Filter the Station when Input changes
  useEffect(() => {
    if (inputValue !== "" && inputValue !== selectedstation?.name) {
      // dont show autcomplete if the input is ether empty or the value is the Selected Station
      setautocompleteValues(
        filterStations({
          filterString: inputValue,
          stations: stations,
        })
      );
    } else {
      setautocompleteValues([]);
    }

    return () => {
      setautocompleteValues([]);
    };
  }, [selectedstation?.name, inputValue, stations]);

  /**
   * When Selected a Station give the Value to Parent Component, Set the Input to the Select Station Name and empty the Autocomplete Array
   * @param autocompleteValue the Selected Station
   */
  const handleSelect = (autocompleteValue: station) => {
    setSelectedStation(autocompleteValue);
    setinputValue(autocompleteValue.name);
    setautocompleteValues([]);
  };

  return (
    <div className="flex flex-col space-y-1 ">
      <Input
        className={inputValue === selectedstation?.name ? "font-bold" : ""}
        placeholder="Search Station"
        value={inputValue}
        onChange={(event) => setinputValue(event.currentTarget.value)}
      />
      {autocompleteValues.length > 0 && (
        <Card className="p-0 m-0">
          <ul>
            {autocompleteValues.map((autocompleteValue) => (
              <li key={autocompleteValue.id}>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => handleSelect(autocompleteValue)}
                >
                  {autocompleteValue.name}
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default Autocomplete;
