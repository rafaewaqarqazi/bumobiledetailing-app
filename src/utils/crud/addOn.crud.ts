import { axiosInstance } from "@/utils/config";
import { IAddOnCategory } from "@/utils/crud/addOn.category.crud";

const ADDON_URL = "/addOn";

export interface IAddOn {
  id: number;
  name: string;
  image: string;
  price: number;
  duration: number;
  category: IAddOnCategory;
  createdAt: Date;
  updatedAt: Date;
}

export const addOnCrud = {
  create: (data: IAddOn) => {
    return axiosInstance.post(ADDON_URL, data);
  },
  list: (params: any) => {
    return axiosInstance.get(`${ADDON_URL}s`, { params });
  },
  getById: (id: number) => {
    return axiosInstance.get(`${ADDON_URL}/${id}`);
  },
  update: (data: IAddOn) => {
    return axiosInstance.put(ADDON_URL, data);
  },
  delete: (id: number) => {
    return axiosInstance.delete(`${ADDON_URL}/${id}`);
  },
};
