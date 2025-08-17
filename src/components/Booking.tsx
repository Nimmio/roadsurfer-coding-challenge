import {
  fetchAndReturnStationNameForId,
  fetchBookingDetails,
  type booking,
} from "@/lib/fetch";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { differenceInDays, parseISO } from "date-fns";
import { Button } from "./ui/button";
import { formatDate } from "@/lib/utils";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

interface BookingProps {
  stationId: string;
  bookingId: string;
  onBack: () => void;
}

const Booking = ({ bookingId, stationId, onBack }: BookingProps) => {
  const [booking, setBooking] = useState<booking | undefined>(undefined);
  const [stationName, setStationName] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchBookingDetails({ stationId: stationId, bookingId: bookingId }).then(
      (booking) => setBooking(booking as booking)
    );
  }, [bookingId, stationId]);

  useEffect(() => {
    fetchAndReturnStationNameForId(stationId).then((stationName) =>
      setStationName(stationName)
    );
  }, [stationId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking</CardTitle>
      </CardHeader>
      <CardContent>
        {booking !== undefined ? (
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold">Customer Name</TableCell>
                <TableCell>{booking.customerName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Booking Start Date</TableCell>
                <TableCell>{formatDate(parseISO(booking.startDate))}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Booking End Date</TableCell>
                <TableCell>{formatDate(parseISO(booking.endDate))}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Booking Duration</TableCell>
                <TableCell>
                  {differenceInDays(booking.endDate, booking.startDate)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">
                  Pickup-Return Station Name:
                </TableCell>
                <TableCell>{stationName}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <>Loading</>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={() => onBack()}>Back</Button>
      </CardFooter>
    </Card>
  );
};

export default Booking;
