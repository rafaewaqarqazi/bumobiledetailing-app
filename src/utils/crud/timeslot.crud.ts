import { axiosInstance } from "@/utils/config";

const TIMESLOT_URL = "/timeslot";

export interface ITimeslot {
  id: number;
  time: string;
  days: string;
  schedules: any[];
  createdAt: Date;
  updatedAt: Date;
}

export const timeslotCrud = {
  create: (data: ITimeslot) => {
    return axiosInstance.post(TIMESLOT_URL, data);
  },
  list: (params: any) => {
    return axiosInstance.get(`${TIMESLOT_URL}s`, { params });
  },
  getById: (id: number) => {
    return axiosInstance.get(`${TIMESLOT_URL}/${id}`);
  },
  getByDate: (date: string) => {
    return axiosInstance.get(`${TIMESLOT_URL}/date/${date}`);
  },
  update: (data: ITimeslot) => {
    return axiosInstance.put(TIMESLOT_URL, data);
  },
  delete: (id: number) => {
    return axiosInstance.delete(`${TIMESLOT_URL}/${id}`);
  },
};
