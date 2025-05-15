import AuthInitializer from "@components/AuthInitializer";
import RouteError from "@components/pages/errors/RouteError.jsx";
import AdminPanel from "@components/ui/surveys/AdminPanel.jsx";
import CreateSurvey from "@components/ui/surveys/CreateSurvey.jsx";
import EditSurvey from "@components/ui/surveys/EditSurvey.jsx";
import SurveyDetail from "@components/ui/surveys/SurveyDetail.jsx";
import { useSelector } from "react-redux";
import { createBrowserRouter, Navigate, Outlet, useLocation } from "react-router-dom";
import App from "src/App.jsx";
import { selectIsAdmin, selectIsAuth } from "src/services/store/slices/userSlice.jsx";

// Wrapper component to add AuthInitializer to all routes
const AuthWrapper = ({ children }) => {
    return (
        <>
            <AuthInitializer />
            {children}
        </>
    );
};

// Компонент для захисту маршрутів, доступних тільки авторизованим користувачам
const ProtectedRoute = ({ adminOnly = false, children }) => {
    const isAuth = useSelector(selectIsAuth);
    const isAdmin = useSelector(selectIsAdmin);
    const location = useLocation();

    if (!isAuth) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return (
        <AuthWrapper>
            {children}
        </AuthWrapper>
    );
};

// Компонент для захисту маршрутів, доступних тільки адміністраторам
const AdminRoute = ({ children }) => {
    const isAdmin = useSelector(selectIsAdmin);
    const location = useLocation();

    if (!isAdmin) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return (
        <AuthWrapper>
            {children}
        </AuthWrapper>
    );
};

// Root layout for adding AuthInitializer to all routes
const RootLayout = () => {
    return (
        <>
            <AuthInitializer />
            <Outlet />
        </>
    );
};

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        errorElement: <RouteError />,
        children: [
            {
                path: "/",
                element: <App />,
            },
            {
                path: "/surveys/:id",
                element: <SurveyDetail />,
            },
            {
                path: "/admin-panel",
                element: (
                    <ProtectedRoute adminOnly={true}>
                        <AdminPanel />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/create-survey",
                element: (
                    <AdminRoute>
                        <CreateSurvey />
                    </AdminRoute>
                ),
            },
            {
                path: "/edit-survey/:id",
                element: (
                    <AdminRoute>
                        <EditSurvey />
                    </AdminRoute>
                ),
            }
        ]
    }
]);