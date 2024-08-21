import { axiosInstance } from "@/utils/config";

const ADDON_CATEGORY_URL = "/addOnCategory";

export interface IAddOnCategory {
  id: number;
  name: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export const addOnCategoryCrud = {
  create: (data: IAddOnCategory) => {
    return axiosInstance.post(ADDON_CATEGORY_URL, data);
  },
  list: (params: any) => {
    return axiosInstance.get(`${ADDON_CATEGORY_URL}/list`, { params });
  },
  getById: (id: number) => {
    return axiosInstance.get(`${ADDON_CATEGORY_URL}/${id}`);
  },
  update: (data: IAddOnCategory) => {
    return axiosInstance.put(ADDON_CATEGORY_URL, data);
  },
  delete: (id: number) => {
    return axiosInstance.delete(`${ADDON_CATEGORY_URL}/${id}`);
  },
};
