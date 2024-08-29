import React from "react";
import { environment } from "@/utils/config";
import BookingDetails from "@/components/booking/BookingDetails";

const Page = () => {
  return <BookingDetails />;
};
export const metadata = {
  title: `Bookings | ${environment.appName}`,
  description: `Bookings | ${environment.appName}`,
};
export default Page;
