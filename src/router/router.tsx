import { createBrowserRouter } from "react-router";
import Landing from "../view/Landing";
import EmailVerify from "../view/EmailVerify";
import UpdateForgotPassword from "../view/UpdateForgotPassword";
import Dashboard from "../view/Dashboard";
import ProtectedRoute from "./ProtectedRoute";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Landing />,
    },
    {
        path: '/verify',
        element: <EmailVerify />,
    },
    {
        path: 'forgotPassword',
        element: <UpdateForgotPassword />,
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
                <Dashboard />
            </ProtectedRoute>
        )
    }
]);