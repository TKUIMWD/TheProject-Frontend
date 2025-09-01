import defaultAvatarImg from "../assets/images/Dashboard/default-avatar.jpg";

// 處理頭像路徑的輔助函數
export function processAvatarPath(avatarPath: string | null | undefined): string {
    if (!avatarPath || avatarPath === "/uploads/avatars/default-avatar.jpg") {
        return defaultAvatarImg;
    }

    // 如果已經是完整URL，直接返回
    if (avatarPath.startsWith('http')) {
        return avatarPath;
    }

    // 否則組合後端基礎URL
    return `${import.meta.env.VITE_BACKEND_BASE_URL}${avatarPath}`;
}