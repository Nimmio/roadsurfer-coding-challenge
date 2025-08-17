import React, { useEffect, useState } from "react";
import {
  addDays,
  addWeeks,
  isSameDay,
  parseISO,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { formatDate } from "@/lib/utils";
import { useStationStore, type booking } from "@/store/station";

const Calendar = () => {
  const [startDate, setStartDate] = useState<Date>(startOfWeek(new Date()));
  const [currentWeekDays, setCurrentWeekDays] = useState<Date[]>();
  const selectedStation = useStationStore((state) => state.selectedStation);
  const setSelectedBookingId = useStationStore(
    (state) => state.setSelectedBookingId
  );
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
  const getBookingForDate = (date: Date): booking[] => {
    const filteredBooking = selectedStation?.bookings.filter(
      (booking) =>
        isSameDay(parseISO(booking.startDate), date) ||
        isSameDay(parseISO(booking.endDate), date)
    );
    return filteredBooking || [];
  };

  return (
    <Card className="p-4">
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4">
        {currentWeekDays?.map((currentWeekDay) => (
          <Card
            key={currentWeekDay.toString()}
            className="w-30 mx-auto"
            id="calendarCard"
          >
            <span className="text-center">{formatDate(currentWeekDay)}</span>
            {getBookingForDate(currentWeekDay).map((booking) => (
              <Badge
                key={booking.id}
                onClick={() => setSelectedBookingId(booking.id)}
                className="mx-auto cursor-pointer "
                variant="secondary"
              >
                {booking.customerName}
              </Badge>
            ))}
          </Card>
        ))}
      </div>
      <div className="flex justify-between">
        <Button onClick={() => handlePreviousWeek()}>Previous Week</Button>
        <Button onClick={() => handleNextWeek()}>Next Week</Button>
      </div>
    </Card>
  );
};

export default Calendar;
