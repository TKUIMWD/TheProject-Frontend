import { auth_api } from "../enum/api";
import { asyncPost } from "./fetch";

type ShowToastFunction = (message: string, variant?: 'success' | 'danger' | 'secondary' | 'warning' | 'info') => void;

export default async function logout(showToast: ShowToastFunction) {
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
        showToast("登出成功", "success")
    } else {
        showToast(response.message, "danger");
    }
    localStorage.removeItem('token');
    setTimeout(() => {
        window.location.href = '/';
    }, 1000);
}