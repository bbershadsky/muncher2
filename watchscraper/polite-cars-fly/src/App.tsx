import { Refine } from "@refinedev/core";

import {
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import routerBindings from "@refinedev/react-router-v6";
import { dataProvider, liveProvider } from "@refinedev/appwrite";
import { appwriteClient } from "./utility";
import "@refinedev/antd/dist/reset.css";
import { WatchSaverList } from "./components/WatchSaver";
import { Dashboard } from "@mui/icons-material";

function App() {
  return (
    <BrowserRouter>
      <Refine
        dataProvider={dataProvider(appwriteClient, {
          databaseId: import.meta.env.VITE_NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        })}
        liveProvider={liveProvider(appwriteClient, {
          databaseId: import.meta.env.VITE_NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        })}
        routerProvider={routerBindings}
        notificationProvider={useNotificationProvider}
        options={{ syncWithLocation: true }}
        resources={[
          {
            name: import.meta.env
              .VITE_NEXT_PUBLIC_APPWRITE_WATCHSAVER_COLLECTION_ID,

            list: "/",
            meta: {
              icon: <Dashboard />,
            },
          },
        ]}
      >
        <Routes>
          <Route path="/" element={<WatchSaverList />} />
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}

export default App;
