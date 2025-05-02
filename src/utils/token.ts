import { jwtDecode } from "jwt-decode";
import TokenPayload from "../interface/TokenPayload";
import AuthStatus from "../type/AuthStatus";

export function getAuthStatus(): AuthStatus {
    const token = localStorage.getItem('token');
    if (!token) {
        return 'notLogon';
    }

    try {
        const decoded: TokenPayload = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            localStorage.removeItem('token');
            return 'notLogon';
        }

        if (decoded.role === 'user') {
            return 'user';
        } else if (decoded.role === 'admin') {
            return 'admin';
        }
        else if (decoded.role === 'superadmin') {
            return 'superadmin';
        } else {
            return 'notLogon';
        }
    } catch (error) {
        localStorage.removeItem('token');
        return 'notLogon';
    }
}