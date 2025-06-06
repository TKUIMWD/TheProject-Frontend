import { auth_api } from "../enum/api";
import { asyncPost } from "./fetch";

interface LogoutProps {
    setToastMessage: (message: string) => void;
    setShowToast: (show: boolean) => void;
}

export default async function logout({ setToastMessage, setShowToast }: LogoutProps) {
    const token = localStorage.getItem('token');
    const response = await asyncPost(
        auth_api.logout,
        {},
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

    if (response.code === 200) {
        setToastMessage('已成功登出');
    } else {
        setToastMessage(response.message);
    }
    localStorage.removeItem('token');
    setTimeout(() => {
        window.location.href = '/';
    }, 1000);
    setShowToast(true);
}