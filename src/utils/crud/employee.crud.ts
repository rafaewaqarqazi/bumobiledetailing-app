import { axiosInstance } from "@/utils/config";

const EMPLOYEE_URL = "/employee";

export interface IEmployee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  statusId: number;
}

export const employeeCrud = {
  create: (data: IEmployee) => {
    return axiosInstance.post(EMPLOYEE_URL, data);
  },
  list: (params: any) => {
    return axiosInstance.get(`${EMPLOYEE_URL}s`, { params });
  },
  getById: (id: number) => {
    return axiosInstance.get(`${EMPLOYEE_URL}/${id}`);
  },
  update: (data: IEmployee) => {
    return axiosInstance.put(EMPLOYEE_URL, data);
  },
  delete: (id: number) => {
    return axiosInstance.delete(`${EMPLOYEE_URL}/${id}`);
  },
};
