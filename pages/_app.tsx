// src/pages/_app.tsx
import React from "react";
import type { AppProps } from "next/app";
import { Refine } from "@refinedev/core";
import routerProvider, {
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/nextjs-router/pages";
import { authProvider } from "../auth-provider";
import { dataProvider, liveProvider } from "@refinedev/appwrite";
import { Layout } from "@components/Layout";
import "src/styles/global.css";
import { appwriteClient, resources } from "utility";
import { ThemeContextProvider } from "src/context/ThemeContext";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ThemeContextProvider>
      <Refine
        dataProvider={{
          default: dataProvider(appwriteClient, {
            databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          }),
        }}
        liveProvider={liveProvider(appwriteClient, {
          databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        })}
        authProvider={authProvider}
        routerProvider={routerProvider}
        options={{
          liveMode: "auto",
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
          breadcrumb: false,
          useNewQueryKeys: true,
          disableTelemetry: true,
        }}
        resources={[
          {
            name: "dashboard",
            list: "/",
            meta: {
              label: "Home",
            },
          },
        ]}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <UnsavedChangesNotifier />
        <DocumentTitleHandler />
      </Refine>
    </ThemeContextProvider>
  );
}

export default MyApp;
