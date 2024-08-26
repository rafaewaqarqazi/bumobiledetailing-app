import { ITimeslot } from "@/utils/crud/timeslot.crud";
import { IVehicle } from "@/utils/crud/vehicle.crud";
import { ICustomer } from "@/utils/crud/customer.crud";
import { axiosInstance } from "@/utils/config";

const SCHEDULE_URL = "/schedule";

export interface ISchedule {
  id: number;
  date: string;
  timeslot: ITimeslot;
  vehicle: IVehicle;
  customer: ICustomer;
}

export const scheduleCrud = {
  create: (data: ISchedule) => {
    return axiosInstance.post(SCHEDULE_URL, data);
  },
  list: (params: any) => {
    return axiosInstance.get(`${SCHEDULE_URL}s`, { params });
  },
  getById: (id: number) => {
    return axiosInstance.get(`${SCHEDULE_URL}/${id}`);
  },
  update: (data: ISchedule) => {
    return axiosInstance.put(SCHEDULE_URL, data);
  },
  delete: (id: number) => {
    return axiosInstance.delete(`${SCHEDULE_URL}/${id}`);
  },
};
