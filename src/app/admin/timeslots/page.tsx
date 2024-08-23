import React from "react";
import Timeslots from "@/components/timeslot/Timeslots";
import { environment } from "@/utils/config";

const TimeslotsPage = () => {
  return <Timeslots />;
};
export const metadata = {
  title: `Timeslots | ${environment.appName}`,
  description: `Timeslots | ${environment.appName}`,
};

export default TimeslotsPage;
