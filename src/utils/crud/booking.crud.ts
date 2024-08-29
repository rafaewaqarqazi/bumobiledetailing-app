import { axiosInstance } from "@/utils/config";
import { IVehicle } from "@/utils/crud/vehicle.crud";
import { ICustomer } from "@/utils/crud/customer.crud";
import { IService } from "@/utils/crud/service.crud";
import { IPackage } from "@/utils/crud/package.crud";
import { ISchedule } from "@/utils/crud/schedule.crud";
import { ICustomerAddOn } from "@/utils/crud/customerService.crud";
import { Statuses } from "@/utils/helpers";
import { IEmployee } from "@/utils/crud/employee.crud";

const BOOKING_URL = "/booking";

export interface IBooking {
  id: number;
  vehicle: Partial<IVehicle>;
  service: IService;
  package: IPackage;
  customerAddOns: ICustomerAddOn[];
  schedule: ISchedule;
  customer?: ICustomer;
  statusId: Statuses;
  quote: {
    quotedAmount: string;
  };
  serviceAssignments: {
    id: number;
    employee: IEmployee;
  }[];
}
interface IBookingInput {
  vehicle: Partial<IVehicle>;
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
  create: (data: IBookingInput) => {
    return axiosInstance.post(BOOKING_URL, data);
  },
  list: (params: any) => {
    return axiosInstance.get(`${BOOKING_URL}s`, { params });
  },
  getById: (id: number) => {
    return axiosInstance.get(`${BOOKING_URL}/${id}`);
  },
  update: (data: IBookingInput) => {
    return axiosInstance.put(BOOKING_URL, data);
  },
  delete: (id: number) => {
    return axiosInstance.delete(`${BOOKING_URL}/${id}`);
  },
  assignEmployee: (id: number, data: { employee: number }) => {
    return axiosInstance.put(`${BOOKING_URL}/${id}/employee`, data);
  },
  updateStatus: (id: number, statusId: Statuses) => {
    return axiosInstance.put(`${BOOKING_URL}/${id}/status`, { statusId });
  },
};
