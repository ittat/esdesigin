import Root from "@/pages/Root";
import HomePage from "@/pages/home";
import Page from "@/pages/page";
import Error from "@/pages/error";
import Canvas from "@/pages/canvas";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const globalInitLoader = async () => {
  return {};
};

// Data API
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    loader: globalInitLoader,

    children: [
      // use  <Outlet> in <Root /> instead of children

      //   "/" "/home"
      //  "/page/:pageid"
      // "/:setting"
      {
        path: "/",
        element: <HomePage />,
        index: true,
      },
      {
        path: "/:appid/:pageid",
        element: <Page />,
      },

      {
        path: "/canvas/:appid/:pageid",
        element: <Canvas />,
      },
    ],
  },
]);

export default router;
