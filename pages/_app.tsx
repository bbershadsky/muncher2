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

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
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
        // i18nProvider={i18nProvider}
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
              // label: t("dashboard.title"),
              // icon: <Dashboard />,
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
    </>
  );
}

export default MyApp;
