import { createBrowserRouter } from "react-router";
import Landing from "../view/Landing";
import ProtectedRoute from "./ProtectedRoute";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Landing />,
    },
]);