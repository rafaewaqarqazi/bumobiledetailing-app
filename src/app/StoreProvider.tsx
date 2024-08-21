"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { ConfigProvider } from "antd";
import { Colors } from "@/utils/helpers";
import { componentsTheme, tokenTheme } from "@/utils/theme";
import { SidebarProvider } from "@/context/SidebarContext";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export default function StoreProvider({
  withPersistor,
  session,
  children,
}: {
  children: React.ReactNode;
  withPersistor?: boolean;
  session: Session | null;
}) {
  const persistorRef = React.useRef<any>();
  if (withPersistor) {
    persistorRef.current = persistStore(store);
  }
  return (
    <SessionProvider session={session}>
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
          <SidebarProvider>
            {persistorRef.current ? (
              <PersistGate persistor={persistorRef.current}>
                {children}
              </PersistGate>
            ) : (
              children
            )}
          </SidebarProvider>
        </Provider>
      </ConfigProvider>
    </SessionProvider>
  );
}
