import axios from "axios";

const AUTH_URL = "/auth";

export const forgotPassword = (data: {
  email: string;
  isAdmin?: boolean;
  isEmployee?: boolean;
}) => {
  return axios.post(`${AUTH_URL}/forgot-password`, data);
};
export const resetPassword = (data: { password: string }, token: string) => {
  const newAxios = axios.create();
  return newAxios.post(`${AUTH_URL}/reset-password`, data, {
    headers: { Authorization: token },
  });
};
