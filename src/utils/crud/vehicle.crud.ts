import { axiosInstance } from "@/utils/config";

const VEHICLE_URL = "/vehicle";

export interface IVehicle {
  id: number;
  type: string;
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  color: string;
  customer: number;
}
export const vehicleCrud = {
  create: (vehicle: IVehicle) => {
    return axiosInstance.post(VEHICLE_URL, vehicle);
  },
  update: (vehicle: IVehicle) => {
    return axiosInstance.put(VEHICLE_URL, vehicle);
  },
  delete: (id: number) => {
    return axiosInstance.delete(`${VEHICLE_URL}/${id}`);
  },
  list: (params: any) => {
    return axiosInstance.get(`${VEHICLE_URL}s`, { params });
  },
};
