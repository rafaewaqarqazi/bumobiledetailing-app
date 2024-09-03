import { Statuses } from "@/utils/helpers";
import { ICoupon } from "@/utils/crud/coupon.crud";
import { axiosInstance } from "@/utils/config";

const AGENT_URL = `/agent`;

export interface IAgent {
  id: number;
  name: string;
  type: string;
  prompt: string;
  statusId: Statuses;
  emailSubjectFormat: string;
  coupon: ICoupon;
  createdAt: Date;
  updatedAt: Date;
}
interface IAgentInput {
  id: number;
  name: string;
  prompt: string;
  coupon: number;
  statusId: number;
  emailSubjectFormat: string;
}

export const agentCrud = {
  getAgents: (params: any) => axiosInstance.get(`${AGENT_URL}s`, { params }),
  getAgentByTypeAndName: (type: string, name: string) =>
    axiosInstance.get(`${AGENT_URL}/${type}/${name}`),
  createAgent: (data: IAgentInput) => axiosInstance.post(AGENT_URL, data),
  updateAgent: (data: Partial<IAgentInput>) =>
    axiosInstance.put(AGENT_URL, data),
  duplicateAgent: (id: number) =>
    axiosInstance.post(`${AGENT_URL}/duplicate/${id}`),
};
