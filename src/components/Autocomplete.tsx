import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { fetchStationsAndFilter, type station } from "@/lib/fetch";

interface AutocompleteProps {
  onSelect: (value: station) => void;
}

const Autocomplete = ({ onSelect }: AutocompleteProps) => {
  const [inputValue, setinputValue] = useState<string>("");
  const [debouncedValue] = useDebounce<string>(inputValue, 500);
  const [autocompleteValues, setautocompleteValues] = useState<station[]>([]);

  useEffect(() => {
    if (debouncedValue !== "") {
      fetchStationsAndFilter(debouncedValue).then((stations) =>
        setautocompleteValues(stations)
      );
    } else {
      setautocompleteValues([]);
    }

    return () => {
      setautocompleteValues([]);
    };
  }, [debouncedValue]);

  return (
    <Card>
      <Input
        value={inputValue}
        onChange={(event) => setinputValue(event.currentTarget.value)}
      />
      {autocompleteValues.length > 0 && (
        <ul>
          {autocompleteValues.map((autocompleteValue) => (
            <li>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => onSelect(autocompleteValue)}
              >
                {autocompleteValue.name}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default Autocomplete;
