import axios from "axios";
import { axiosInstance } from "@/utils/config";

const AUTH_URL = "/auth";

export const forgotPassword = (data: {
  email: string;
  isAdmin?: boolean;
  isEmployee?: boolean;
}) => {
  return axiosInstance.post(`${AUTH_URL}/forgot-password`, data);
};
export const resetPassword = (data: { password: string }, token: string) => {
  const newAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });
  return newAxios.post(`${AUTH_URL}/reset-password`, data, {
    headers: { Authorization: token },
  });
};
