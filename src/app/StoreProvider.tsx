"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import setupAxios, { environment } from "@/utils/config";
import axios from "axios";
import { ConfigProvider } from "antd";
import { Colors } from "@/utils/helpers";
import { componentsTheme, tokenTheme } from "@/utils/theme";
axios.defaults.baseURL = environment.apiURL;
setupAxios(axios, store);
export default function StoreProvider({
  withPersistor,
  children,
}: {
  children: React.ReactNode;
  withPersistor?: boolean;
}) {
  const persistorRef = React.useRef<any>();
  if (withPersistor) {
    persistorRef.current = persistStore(store);
  }
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: Colors.primary,
          ...tokenTheme,
        },
        ...componentsTheme,
      }}
    >
      <Provider store={store}>
        {persistorRef.current ? (
          <PersistGate persistor={persistorRef.current}>{children}</PersistGate>
        ) : (
          children
        )}
      </Provider>
    </ConfigProvider>
  );
}
