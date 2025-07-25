import { createBrowserRouter } from "react-router";
import Landing from "../view/Landing";
import EmailVerify from "../view/EmailVerify";
import UpdateForgotPassword from "../view/UpdateForgotPassword";
import Dashboard from "../view/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Course from "../view/Course";
import Chapter from "../view/Chapter";
import SuperAdminDashboard from "../view/SuperAdminDashboard";


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
    },
    {
        path:'/courses/:courseId',
        element: (
            <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
                <Course />
            </ProtectedRoute>
        )
    },
    {
        path: '/chapters/:chapterId',
        element: (
            <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
                <Chapter />
            </ProtectedRoute>
        )
    },
    {
        path: '/superAdminDashboard',
        element: (
            <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminDashboard />
            </ProtectedRoute>
        )
    }
]);