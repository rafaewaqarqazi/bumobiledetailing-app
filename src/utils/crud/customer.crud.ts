import axios from "axios";
import { PreferencesTypes } from "@/utils/enums";

const CUSTOMER_URL = "/customer";
export interface ICustomer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferences: {
    id?: number;
    type: PreferencesTypes;
    appointment: boolean;
    marketing: boolean;
  };
}
export const customerCrud = {
  create(customerObj: ICustomer) {
    return axios.post(CUSTOMER_URL, customerObj);
  },
  update(customerObj: ICustomer) {
    return axios.put(CUSTOMER_URL, customerObj);
  },
  delete(id: number) {
    return axios.delete(`${CUSTOMER_URL}/${id}`);
  },
  get(id: number) {
    return axios.get(`${CUSTOMER_URL}/${id}`);
  },
  list(params?: any) {
    return axios.get(CUSTOMER_URL, { params });
  },
};
