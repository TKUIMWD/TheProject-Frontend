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

/**
 * 獲取 API 請求所需的 options 物件。
 * 如果成功，返回包含 Authorization header 的物件。
 * 如果失敗 (找不到 token)，則拋出一個錯誤。
 * @returns { headers: { Authorization: string } }
 * @throws {Error} 如果 localStorage 中沒有 token。
 */
export function getOptions() {
    const token = localStorage.getItem("token");

    // 條件不滿足時，直接拋出錯誤
    if (!token) {
        throw new Error("請重新登入");
    }

    // 成功時，直接返回結果
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
}