import { createBrowserRouter } from "react-router-dom";
import App from "src/App.jsx";
import RouteError from "@components/pages/errors/RouteError.jsx";
import SurveyDetail from "@components/ui/surveys/SurveyDetail.jsx";
import UserSurveys from "@components/ui/surveys/UserSurveys.jsx";
import CreateSurvey from "@components/ui/surveys/CreateSurvey.jsx";
import EditSurvey from "@components/ui/surveys/EditSurvey.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <RouteError />
    },
    {
        path: "/surveys/:id",
        element: <SurveyDetail />,
        errorElement: <RouteError />
    },
    {
        path: "/my-surveys",
        element: <UserSurveys />,
        errorElement: <RouteError />
    },
    {
        path: "/create-survey",
        element: <CreateSurvey />,
        errorElement: <RouteError />
    },
    {
        path: "/edit-survey/:id",
        element: <EditSurvey />,
        errorElement: <RouteError />
    }
]);