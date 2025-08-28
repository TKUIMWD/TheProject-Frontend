import { getAuthStatus } from "../utils/token";
import UserVMConsole from "./Dasboard/VM/UserVMConsole";
import VMDetailPage from "./SuperAdminDashboard/VM/VMDetailPage";

export default function VMConsoleWrapper() {
    const userRole = getAuthStatus();

    if (userRole === "admin") {
        return <UserVMConsole />;
    }

    return <VMDetailPage />;
}