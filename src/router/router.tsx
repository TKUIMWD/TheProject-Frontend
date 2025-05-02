import { createBrowserRouter } from "react-router";
import Landing from "../view/Landing";
import EmailVerify from "../view/EmailVerify";
import UpdateForgotPassword from "../view/UpdateForgotPassword";


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
]);