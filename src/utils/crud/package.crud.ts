import { axiosInstance } from "@/utils/config";
import { IAddOn } from "@/utils/crud/addOn.crud";

const PACKAGE_URL = "/package";

export interface IPackage {
  id: number;
  name: string;
  displayName: string;
  description: string;
  price: number;
  isPopular: boolean;
  image: string;
  services: any[];
  packageAddOns: IPackageAddOn[];
  createdAt: Date;
  updatedAt: Date;
}
export interface IPackageAddOn {
  id: number;
  addOn: IAddOn;
  package: IPackage;
  rank: number;
}
export const packageCrud = {
  create: (data: IPackage) => {
    return axiosInstance.post(PACKAGE_URL, data);
  },
  list: (params: any) => {
    return axiosInstance.get(`${PACKAGE_URL}s`, { params });
  },
  getById: (id: number) => {
    return axiosInstance.get(`${PACKAGE_URL}/${id}`);
  },
  update: (data: IPackage) => {
    return axiosInstance.put(PACKAGE_URL, data);
  },
  delete: (id: number) => {
    return axiosInstance.delete(`${PACKAGE_URL}/${id}`);
  },
};
