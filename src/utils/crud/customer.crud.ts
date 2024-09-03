import { PreferencesTypes } from "@/utils/enums";
import { axiosInstance } from "@/utils/config";
import { IVehicle } from "@/utils/crud/vehicle.crud";
import { ICustomerService } from "@/utils/crud/customerService.crud";
import { ISMSConversation } from "@/utils/crud/sms.crud";

const CUSTOMER_URL = "/customer";
export interface ICustomer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  vehicles: IVehicle[];
  customerServices: ICustomerService[];
  smsConversations: ISMSConversation[];
  preferences: {
    id?: number;
    type: PreferencesTypes;
    appointment: boolean;
    marketing: boolean;
  };
}
export const customerCrud = {
  create(customerObj: ICustomer) {
    return axiosInstance.post(CUSTOMER_URL, customerObj);
  },
  update(customerObj: ICustomer) {
    return axiosInstance.put(CUSTOMER_URL, customerObj);
  },
  delete(id: number) {
    return axiosInstance.delete(`${CUSTOMER_URL}/${id}`);
  },
  getById(id: number) {
    return axiosInstance.get(`${CUSTOMER_URL}/${id}`);
  },
  list(params?: any) {
    return axiosInstance.get(`${CUSTOMER_URL}s`, { params });
  },
};
