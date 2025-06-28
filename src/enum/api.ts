import { AuthApiEndpoints} from "../interface/ApiEndPoints";
import { UserApiEndpoints } from "../interface/ApiEndPoints";

const auth_api_base = import.meta.env.VITE_API_BASE_URL + "/auth";
const user_api_base = import.meta.env.VITE_API_BASE_URL + "/user";

export const auth_api: AuthApiEndpoints = {
    login: `${auth_api_base}/login`,
    register: `${auth_api_base}/register`,
    logout: `${auth_api_base}/logout`,
    verify: `${auth_api_base}/verify`,
    forgotPassword: `${auth_api_base}/forgotPassword`
};

export const user_api: UserApiEndpoints = {
    getProfile: `${user_api_base}/getProfile`,
    updateProfile: `${user_api_base}/updateProfile`,
    changePassword: `${user_api_base}/changePassword`,
};