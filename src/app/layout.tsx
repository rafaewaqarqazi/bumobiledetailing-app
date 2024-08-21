import type { Metadata } from "next";
import "./globals.scss";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import React from "react";
import StoreProvider from "@/app/StoreProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/actions";
export const metadata: Metadata = {
  title: "BU Mobile Detailing",
  description: "BU Mobile Detailing",
};

const RootLayout = async ({ children }: React.PropsWithChildren) => {
  const session = await getServerSession(authOptions);

  return (
    <StoreProvider withPersistor={false} session={session}>
      <html lang="en">
        <body>
          <AntdRegistry>
            <main className="flex min-h-screen flex-col">{children}</main>
          </AntdRegistry>
        </body>
      </html>
    </StoreProvider>
  );
};

export default RootLayout;
