import { axiosInstance } from "@/utils/config";

const ADMIN_URL = "/admin";

export interface IAdmin {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export const adminCrud = {
  create: (data: IAdmin) => {
    return axiosInstance.post(ADMIN_URL, data);
  },
  list: (params: any) => {
    return axiosInstance.get(`${ADMIN_URL}/list`, { params });
  },
  getById: (id: number) => {
    return axiosInstance.get(`${ADMIN_URL}/${id}`);
  },
  update: (data: IAdmin) => {
    return axiosInstance.put(ADMIN_URL, data);
  },
  delete: (id: number) => {
    return axiosInstance.delete(`${ADMIN_URL}/${id}`);
  },
  uploadFile: (data: any) => axiosInstance.post(`${ADMIN_URL}/file`, data),
};
