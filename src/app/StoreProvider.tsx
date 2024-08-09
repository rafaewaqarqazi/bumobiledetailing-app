"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

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
    <Provider store={store}>
      {persistorRef.current ? (
        <PersistGate persistor={persistorRef.current}>{children}</PersistGate>
      ) : (
        children
      )}
    </Provider>
  );
}
