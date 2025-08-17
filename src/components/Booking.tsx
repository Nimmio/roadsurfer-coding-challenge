import {
  fetchAndReturnStationNameForId,
  fetchBookingDetails,
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
import { useStationStore, type booking } from "@/store/station";

const Booking = () => {
  const [booking, setBooking] = useState<booking | undefined>(undefined);
  const [stationName, setStationName] = useState<string | undefined>(undefined);
  const selectedStation = useStationStore((state) => state.selectedStation);
  const selectedBookingId = useStationStore((state) => state.selectedBookingId);
  const unSetSelectedBookingId = useStationStore(
    (state) => state.unSetSelectedBookingId
  );
  useEffect(() => {
    fetchBookingDetails({
      stationId: selectedStation?.id as string,
      bookingId: selectedBookingId as string,
    }).then((booking) => setBooking(booking as booking));
  }, [selectedStation?.id, selectedBookingId]);

  useEffect(() => {
    fetchAndReturnStationNameForId(selectedStation?.id as string).then(
      (stationName) => setStationName(stationName)
    );
  }, [selectedStation?.id]);

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
        <Button onClick={() => unSetSelectedBookingId()}>Back</Button>
      </CardFooter>
    </Card>
  );
};

export default Booking;
