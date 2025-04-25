import type { Metadata } from "next";
import "@mantine/charts/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { NextIntlClientProvider } from "next-intl";
import Script from "next/script";
import { Notifications } from "@mantine/notifications";
import { getMessages, getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Fituno",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  console.log("RootLayout rendering with locale:", locale);

  const messages = await getMessages();

  return (
    <html lang={locale} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places&language=pt-BR&region=BR`}
        strategy="afterInteractive"
      />
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MantineProvider>
            <Notifications />
            {children}
          </MantineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
