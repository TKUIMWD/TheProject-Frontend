export interface AuthApiEndpoints {
    login: string;
    register: string;
    logout: string;
    verify: string;
    forgotPassword: string;
}

export interface UserApiEndpoints {
    getProfile: string;
    updateProfile: string;
    changePassword: string;
    uploadAvatar: string;
    deleteAvatar: string;
}