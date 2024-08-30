import { RootState, store } from "@/lib/store";
import axios from "axios";
import { authActions } from "@/lib/features/authSlice";
import { message } from "antd";
import { getSession, signOut } from "next-auth/react";

interface IEnvironment {
  apiURL: string;
  appURL: string;
  DEV: boolean;
  googlePlacesKey?: string;
  appName: string;
  ga4MeasurementId: string;
  gtmKey?: string;
  gAdsKey?: string;
}
export const environment: IEnvironment = {
  apiURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4005/api",
  appURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  DEV: process.env.NEXT_PUBLIC_NODE_ENV === "development",
  googlePlacesKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
  appName: "BU Mobile Detailing",
  ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || "",
  gtmKey: process.env.NEXT_PUBLIC_GTM_KEY,
  gAdsKey: process.env.NEXT_PUBLIC_GADS_KEY,
};

const axiosInstance = axios.create({
  baseURL: environment.apiURL,
});
axiosInstance.defaults.headers.common.Accept = "application/json";
axiosInstance.interceptors.request.use(
  async (config) => {
    const { auth } = store.getState() as RootState;
    if (auth?.token) {
      config.headers.Authorization = auth?.token;
    } else {
      const session = await getSession();
      if (session?.user?.accessToken) {
        config.headers.Authorization = session?.user?.accessToken;
      }
    }

    return config;
  },
  (err) => Promise.reject(err),
);
// Session Expire Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (401 === error?.response?.status) {
      message.error("Session Expired, Please Login Again");
      store.dispatch(authActions.logout());
      signOut();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);
export { axiosInstance };
