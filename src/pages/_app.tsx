import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import Header from "~/components/Header";
import { ThemeProvider } from "next-themes";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
        <NextUIProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Header />
          </ThemeProvider>
          <Component {...pageProps} />
        </NextUIProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);