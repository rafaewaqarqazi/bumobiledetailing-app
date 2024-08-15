import { AppStore, RootState } from "@/lib/store";
import { Axios } from "axios";
import { authActions } from "@/lib/features/authSlice";
import { message } from "antd";

interface IEnvironment {
  apiURL: string;
  appURL: string;
  DEV: boolean;
}
export const environment: IEnvironment = {
  apiURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4005/api",
  appURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  DEV: process.env.NEXT_PUBLIC_NODE_ENV === "development",
};
export default function setupAxios(axios: Axios, store: AppStore) {
  axios.defaults.headers.common.Accept = "application/json";
  axios.interceptors.request.use(
    (config) => {
      const { auth: auth } = store.getState() as RootState;

      if (auth.token) {
        config.headers.Authorization = auth.token;
      }

      return config;
    },
    (err) => Promise.reject(err),
  );
  // Session Expire Interceptor
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (401 === error?.response?.status) {
        message.error("Session Expired, Please Login Again");
        store.dispatch(authActions.logout());
        return Promise.reject(error);
      }
      return Promise.reject(error);
    },
  );
}
