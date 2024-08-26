import { axiosInstance } from "@/utils/config";

const BOOKING_URL = "/booking";

export interface IBooking {
  car: string;
  service: number;
  package: number;
  customerAddOns: {
    [key: number]: number;
  };
  timeslot: { date: string; timeslot: number };
  customer?: number;
  totalPrice: string;
}

export const bookingCrud = {
  create: (data: IBooking) => {
    return axiosInstance.post(BOOKING_URL, data);
  },
  list: (params: any) => {
    return axiosInstance.get(`${BOOKING_URL}s`, { params });
  },
  getById: (id: number) => {
    return axiosInstance.get(`${BOOKING_URL}/${id}`);
  },
  update: (data: IBooking) => {
    return axiosInstance.put(BOOKING_URL, data);
  },
  delete: (id: number) => {
    return axiosInstance.delete(`${BOOKING_URL}/${id}`);
  },
};
