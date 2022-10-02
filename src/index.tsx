import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error from "Error";
import CategoryDirectory from "components/Directory/CategoryDirectory";
import ChannelDirectory from "components/Directory/ChannelDirectory";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
  },
  {
    path: "directory/category",
    element: <CategoryDirectory />,
  },
  {
    path: "directory/channels",
    element: <ChannelDirectory />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
