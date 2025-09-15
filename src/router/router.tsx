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
import SuperAdminDashboard from "../view/SuperAdminDashboard";


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
        element: <Layout />,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
                        <Dashboard />
                    </ProtectedRoute>
                )
            }
        ],
    },
    {
        path: '/courses/:courseId',
        element: <Layout />,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
                        <Course />
                    </ProtectedRoute>
                ),
            }
        ]
    },
    {
        path: '/chapters/:chapterId',
        element: <Layout />,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
                        <Chapter />
                    </ProtectedRoute>
                ),
            }
        ]
    },
    {
        path: '/CourseResources',
        element: <Layout />,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
                        <CourseResources />
                    </ProtectedRoute>
                )
            }
        ],
    },
    {
        path: '/vmDetail/:vmId',
        element: <Layout />,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
                        <VMConsoleWrapper />
                    </ProtectedRoute>
                )

            }
        ]
    },
    {
        path: '/boxResources',
        element: <Layout />,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
                        <BoxResources />
                    </ProtectedRoute>
                )

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
    {
        path: '/superadmin/dashboard',
        element:(
            <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
                <SuperAdminDashboard />
            </ProtectedRoute>
        )
    }
]);