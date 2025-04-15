import { createBrowserRouter } from "react-router-dom";
import App from "src/App";
import RouteError from "@components/pages/errors/RouteError";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <RouteError />,
    },
]);