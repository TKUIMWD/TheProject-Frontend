import { AuthApiEndpoints, ClassApiEndpoints, GuacamoleApiEndpoints, PVEApiEndpoints, VMApiEndpoints } from "../interface/ApiEndPoints";
import { UserApiEndpoints } from "../interface/ApiEndPoints";
import { CourseApiEndpoints } from "../interface/ApiEndPoints";
import { ChapterApiEndpoints } from "../interface/ApiEndPoints";


const auth_api_base = import.meta.env.VITE_API_BASE_URL + "/auth";
const user_api_base = import.meta.env.VITE_API_BASE_URL + "/user";
const course_api_base = import.meta.env.VITE_API_BASE_URL + "/courses";
const class_api_base = import.meta.env.VITE_API_BASE_URL + "/classes";
const chapter_api_base = import.meta.env.VITE_API_BASE_URL + "/chapters";
const vm_api_base = import.meta.env.VITE_API_BASE_URL + "/vm";
const pve_api_base = import.meta.env.VITE_API_BASE_URL + "/pve";
const guacamole_api_base = import.meta.env.VITE_API_BASE_URL + "/guacamole";

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
    uploadAvatar: `${user_api_base}/uploadAvatar`,
    deleteAvatar: `${user_api_base}/deleteAvatar`,
    getUserCourses: `${user_api_base}/getUserCourses`
};

export const course_api: CourseApiEndpoints = {
    addCourse: `${course_api_base}/add`,
    getAllPublicCourses: `${course_api_base}/allPublicCourses`,
    getCourseById: (course_id: string) => `${course_api_base}/get/${course_id}`,
    getCourseMenu: (course_id: string) => `${course_api_base}/${course_id}/menu`,
    updateCourseById: (course_id: string) => `${course_api_base}/update/${course_id}`,
    deleteCourseById: (course_id: string) => `${course_api_base}/update/${course_id}`,
    joinCourseById: (course_id: string) => `${course_api_base}/join/${course_id}`
};

export const class_api: ClassApiEndpoints = {
    getClassById: (class_id: string) => `${class_api_base}/${class_id}`,
    addClassToCourse: (course_id: string) => `${class_api_base}/addClassToCourse/${course_id}`,
    updateClassById: (class_id: string) => `${class_api_base}/update/${class_id}`,
    deleteClassById: (class_id: string) => `${class_api_base}/delete/${class_id}`
};

export const chapter_api: ChapterApiEndpoints = {
    getChapterById: (chapter_id) => `${chapter_api_base}/${chapter_id}`,
    addChapterToClass: (class_id) => `${chapter_api_base}/addChapterToClass/${class_id}`,
    updateChapterById: (chapter_id) => `${chapter_api_base}/update/${chapter_id}`,
    deleteChapterById: (chapter_id) => `${chapter_api_base}/delete/${chapter_id}`
};

export const vm_api: VMApiEndpoints = {
    getUsersOwnedVMs: `${vm_api_base}/getUserOwned`,
    getAllMachines: `${vm_api_base}/getAll`,
    getVMStatus: `${vm_api_base}/status`,
    getVMNetworkInfo: `${vm_api_base}/network`,
};

export const pve_api: PVEApiEndpoints = {
    getQemuConfig: `${pve_api_base}/getQemuConfig`
};

export const guacamole_api: GuacamoleApiEndpoints = {
    sshConnection: `${guacamole_api_base}/ssh`,
    rdpConnection: `${guacamole_api_base}/rdp`,
    vncConnection: `${guacamole_api_base}/vnc`
};