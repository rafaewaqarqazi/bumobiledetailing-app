import axios from "axios";

const PACKAGE_URL = "/package";
export interface IPackage {
  id: number;
  name: string;
  description: string;
  price: number;
  isPopular: boolean;
  services: any[];
  packageAddOns: any[];
  createdAt: Date;
  updatedAt: Date;
}
export const packageCrud = {
  create: (data: IPackage) => {
    return axios.post(PACKAGE_URL, data);
  },
  list: (params: any) => {
    return axios.get(`${PACKAGE_URL}s`, { params });
  },
  getById: (id: number) => {
    return axios.get(`${PACKAGE_URL}/${id}`);
  },
  update: (data: IPackage) => {
    return axios.put(PACKAGE_URL, data);
  },
  delete: (id: number) => {
    return axios.delete(`${PACKAGE_URL}/${id}`);
  },
};
