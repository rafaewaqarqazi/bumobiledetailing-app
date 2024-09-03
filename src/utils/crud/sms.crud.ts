import { axiosInstance } from "@/utils/config";
import { ICustomer } from "@/utils/crud/customer.crud";

export const SMS_URL = `/sms`;
export const CONVERSATION_URL = `/conversation`;

export interface ISMS {
  id: number;
  from: string;
  to: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface ISMSConversation {
  id: number;
  contact: string;
  did: string;
  lastMessage: string;
  test: object;
  isAgentActive: boolean;
  customer: ICustomer;
  smsCron: number;
  smsMessages: ISMS[];
  agent: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface ISMSConversationInput {
  id: number;
  contact: string;
  did: string;
  lastMessage: string;
  test: object;
  isAgentActive: boolean;
  customer: number;
  smsCron: number;
  agent: number;
}
export const smsCrud = {
  getConversation: (params: any) =>
    axiosInstance.get(CONVERSATION_URL, { params }),
  getConversationList: (params: any) =>
    axiosInstance.get(`${CONVERSATION_URL}s`, { params }),
  sendSms: (data: Partial<ISMS>) => axiosInstance.post(SMS_URL, data),
  createConversation: (data: Partial<ISMSConversationInput>) =>
    axiosInstance.post(CONVERSATION_URL, data),
  updateConversation: (data: Partial<ISMSConversationInput>) =>
    axiosInstance.put(CONVERSATION_URL, data),
  createTestConversation: (data: Partial<ISMSConversationInput>) =>
    axiosInstance.post(`${CONVERSATION_URL}/test`, data),
  sendSmsUserSimulation: (params: Partial<ISMS>) =>
    axiosInstance.get(`${SMS_URL}/callback`, { params }),
  generateSMS: (data: any, token: string, controller: AbortController) =>
    fetch(`${process.env.NEXT_PUBLIC_API_URL}${SMS_URL}/generate`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Authorization: token,
      },
      signal: controller.signal,
    }),
  updateConversationAgentActivation: (
    id: number,
    data: { isAgentActive: boolean },
  ) => axiosInstance.put(`${CONVERSATION_URL}/agent/activation/${id}`, data),
};
