import type { Metadata } from "next";
import "./globals.scss";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import React from "react";
import StoreProvider from "@/app/StoreProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/actions";
import { environment } from "@/utils/config";
import Script from "next/script";
export const metadata: Metadata = {
  title: "BU Mobile Detailing",
  description: "BU Mobile Detailing",
};

const RootLayout = async ({ children }: React.PropsWithChildren) => {
  const session = await getServerSession(authOptions);

  return (
    <StoreProvider withPersistor={false} session={session}>
      <html lang="en">
        <head>
          {!environment.DEV && (
            <>
              <Script id="gtm-script" strategy="afterInteractive">
                {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${environment.gtmKey}');`}
              </Script>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${environment.gAdsKey}`}
              />
              <Script id="gtm-script2" strategy="afterInteractive">
                {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${environment.gAdsKey}');`}
              </Script>
            </>
          )}
        </head>
        <body>
          <AntdRegistry>
            <main className="flex flex-grow flex-col">{children}</main>
          </AntdRegistry>
        </body>
      </html>
    </StoreProvider>
  );
};

export default RootLayout;
