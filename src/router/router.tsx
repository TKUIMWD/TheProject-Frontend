import { createBrowserRouter } from "react-router";
import Landing from "../view/Landing";
import EmailVerify from "../view/EmailVerify";
import UpdateForgotPassword from "../view/UpdateForgotPassword";
import Dashboard from "../view/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Course from "../view/Course";
import Chapter from "../view/Chapter";
import CourseResources from "../view/CourseResources";
import VMConsoleWrapper from "../component/VMConsoleWrapper";
import BoxResources from "../view/BoxResources";
import Box from "../view/Box";
import Layout from "../component/Layout";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Landing />
            }
        ],
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
        path: '/courses/:courseId',
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
        path: '/CourseResources',
        element: <CourseResources />,
    },
    {
        path: '/vmDetail/:vmId',
        element: (
            <VMConsoleWrapper />
        )
    },
    {
        path: '/boxResources',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <BoxResources />
            }
        ],
    },
    {
        path: '/box/:boxId',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Box />
            }
        ],
    },
]);