import { IVehicle } from "@/utils/crud/vehicle.crud";
import { IPackage } from "@/utils/crud/package.crud";
import { ICustomer } from "@/utils/crud/customer.crud";
import { IService } from "@/utils/crud/service.crud";
import { ISchedule } from "@/utils/crud/schedule.crud";
import { IAddOn } from "@/utils/crud/addOn.crud";
import { axiosInstance } from "@/utils/config";

const CUSTOMER_SERVICE_URL = "/customer-service";

export interface ICustomerAddOn {
  id: number;
  quantity: number;
  customer: ICustomer;
  addOn: IAddOn;
}
export interface ICustomerService {
  id: number;
  customer: ICustomer;
  service: IService;
  package: IPackage;
  schedule: ISchedule;
  customerAddOns: ICustomerAddOn[];
  vehicle: IVehicle;
  createdAt: Date;
}
interface ICustomerServiceInput {
  customer: number;
  service: number;
  package: number;
  schedule: number;
  vehicle: number;
  customerAddOns: {
    [key: number]: number;
  };
  timeslot: {
    timeslot: number;
    date: string;
  };
  totalPrice: string;
}
export const customerServiceCrud = {
  create: (data: Partial<ICustomerServiceInput>) => {
    return axiosInstance.post(CUSTOMER_SERVICE_URL, data);
  },
  list: (params: any) => {
    return axiosInstance.get(`${CUSTOMER_SERVICE_URL}s`, { params });
  },
  getById: (id: number) => {
    return axiosInstance.get(`${CUSTOMER_SERVICE_URL}/${id}`);
  },
  update: (data: ICustomerService) => {
    return axiosInstance.put(CUSTOMER_SERVICE_URL, data);
  },
  delete: (id: number) => {
    return axiosInstance.delete(`${CUSTOMER_SERVICE_URL}/${id}`);
  },
};
