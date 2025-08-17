import React, { useEffect, useState } from "react";
import { addDays, addWeeks, format, startOfWeek, subWeeks } from "date-fns";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";

const Calendar = () => {
  const [startDate, setStartDate] = useState<Date>(startOfWeek(new Date()));
  const [currentWeekDays, setCurrentWeekDays] = useState<Date[]>();

  useEffect(() => {
    const WeekDays = [];
    for (let index = 0; index <= 6; index++) {
      WeekDays.push(addDays(startDate, index));
    }
    setCurrentWeekDays(WeekDays);
  }, [startDate]);

  const handlePreviousWeek = () => {
    setStartDate(subWeeks(startDate, 1));
  };

  const handleNextWeek = () => {
    setStartDate(addWeeks(startDate, 1));
  };

  return (
    <>
      <div className="grid grid-cols-7 gap-1">
        {currentWeekDays?.map((currentWeekDay) => (
          <Card>{format(currentWeekDay, "dd.MM")}</Card>
        ))}
      </div>
      <Button onClick={() => handlePreviousWeek()}>Previous Week</Button>
      <Button onClick={() => handleNextWeek()}>Next Week</Button>
    </>
  );
};

export default Calendar;
