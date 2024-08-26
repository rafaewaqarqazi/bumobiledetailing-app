import React from "react";
import Bookings from "@/components/booking/Bookings";
import { environment } from "@/utils/config";

const BookingsPage = () => {
  return <Bookings />;
};
export const metadata = {
  title: `Bookings | ${environment.appName}`,
  description: `Bookings | ${environment.appName}`,
};

export default BookingsPage;
