import type { Metadata } from "next";
import "./globals.scss";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import React from "react";
import StoreProvider from "@/app/StoreProvider";
export const metadata: Metadata = {
  title: "Intake",
  description: "Intake app",
};

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <StoreProvider withPersistor={false}>
    <html lang="en">
      <body>
        <AntdRegistry>
          <main className="flex min-h-screen flex-col">{children}</main>
        </AntdRegistry>
      </body>
    </html>
  </StoreProvider>
);

export default RootLayout;
