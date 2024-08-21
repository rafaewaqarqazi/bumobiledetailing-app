import { axiosInstance } from "@/utils/config";
import { IPackage } from "@/utils/crud/package.crud";

const SERVICE_URL = "/service";

export interface IServicePackage {
  id: number;
  package: IPackage;
  service: IService;
}

export interface IService {
  id: number;
  name: string;
  description: string;
  image: string;
  servicePackages: IServicePackage[];
  createdAt: Date;
  updatedAt: Date;
}

export const serviceCrud = {
  create: (data: IService) => {
    return axiosInstance.post(SERVICE_URL, data);
  },
  list: (params: any) => {
    return axiosInstance.get(`${SERVICE_URL}s`, { params });
  },
  getById: (id: number) => {
    return axiosInstance.get(`${SERVICE_URL}/${id}`);
  },
  update: (data: IService) => {
    return axiosInstance.put(SERVICE_URL, data);
  },
  delete: (id: number) => {
    return axiosInstance.delete(`${SERVICE_URL}/${id}`);
  },
};
