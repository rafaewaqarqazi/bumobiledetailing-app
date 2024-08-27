import { axiosInstance } from "@/utils/config";

const COUPON_URL = "/coupon";

export interface ICoupon {
  id: number;
  code: string;
  discountAmount: string;
  discountPercentage: string;
  startAt: string;
  endAt: string;
  createdAt: Date;
  updatedAt: Date;
}

export const couponCrud = {
  create: (data: ICoupon) => {
    return axiosInstance.post(COUPON_URL, data);
  },
  list: (params: any) => {
    return axiosInstance.get(`${COUPON_URL}s`, { params });
  },
  getById: (id: number) => {
    return axiosInstance.get(`${COUPON_URL}/${id}`);
  },
  getByCode: (code: string) => {
    return axiosInstance.get(`${COUPON_URL}/code/${code}`);
  },
  update: (data: ICoupon) => {
    return axiosInstance.put(COUPON_URL, data);
  },
  delete: (id: number) => {
    return axiosInstance.delete(`${COUPON_URL}/${id}`);
  },
};
