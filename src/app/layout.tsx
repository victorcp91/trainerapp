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

export const metadata: Metadata = {
  title: "Fituno",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  return (
    <html lang="pt" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places&language=pt-BR&region=BR`}
        strategy="afterInteractive"
      />
      <body className="antialiased">
        <NextIntlClientProvider>
          <MantineProvider>
            <Notifications />
            {children}
          </MantineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
