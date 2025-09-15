import { AuthApiEndpoints, BoxApiEndpoints, ClassApiEndpoints, GuacamoleApiEndpoints, PVEApiEndpoints, SuperadminApiEndpoints, SuperadminCRPApiEndpoints, VMApiEndpoints, VMManageApiEndpoints, VMOperateApiEndpoints, VMTemplateApiEndpoints, VMTemplateManageApiEndpoints } from "../interface/ApiEndPoints";
import { UserApiEndpoints } from "../interface/ApiEndPoints";
import { CourseApiEndpoints } from "../interface/ApiEndPoints";
import { ChapterApiEndpoints } from "../interface/ApiEndPoints";

const auth_api_base = import.meta.env.VITE_API_BASE_URL + "/auth";
const user_api_base = import.meta.env.VITE_API_BASE_URL + "/user";
const course_api_base = import.meta.env.VITE_API_BASE_URL + "/courses";
const class_api_base = import.meta.env.VITE_API_BASE_URL + "/classes";
const chapter_api_base = import.meta.env.VITE_API_BASE_URL + "/chapters";
const vm_api_base = import.meta.env.VITE_API_BASE_URL + "/vm";
const vm_manage_api_base = import.meta.env.VITE_API_BASE_URL + "/vm/manage";
const vm_operate_api_base = import.meta.env.VITE_API_BASE_URL + "/vm/operate";
const pve_api_base = import.meta.env.VITE_API_BASE_URL + "/pve";
const guacamole_api_base = import.meta.env.VITE_API_BASE_URL + "/guacamole";
const vm_template_api_base = import.meta.env.VITE_API_BASE_URL + "/template";
const vm_template_manage_api_base = import.meta.env.VITE_API_BASE_URL + "/template/manage";
const superadmin_api_base = import.meta.env.VITE_API_BASE_URL + "/superadmin";
const superadmin_crp_api_base = import.meta.env.VITE_API_BASE_URL + "/superadmin/crp";
const box_api_base = import.meta.env.VITE_API_BASE_URL + "/vmbox";

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
    getUserCourses: `${user_api_base}/getUserCourses`,
    getUserCRP: `${user_api_base}/getUserCRP`,
    getUserById: (id: string) => `${user_api_base}/getUserById/${id}`
};

export const course_api: CourseApiEndpoints = {
    addCourse: `${course_api_base}/add`,
    getAllPublicCourses: `${course_api_base}/allPublicCourses`,
    InviteToJoinCourse: `${course_api_base}/invite`,
    getCourseById: (course_id: string) => `${course_api_base}/get/${course_id}`,
    getCourseMenu: (course_id: string) => `${course_api_base}/${course_id}/menu`,
    updateCourseById: (course_id: string) => `${course_api_base}/update/${course_id}`,
    deleteCourseById: (course_id: string) => `${course_api_base}/delete/${course_id}`,
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

export const vm_operate_api:VMOperateApiEndpoints = {
    boot: `${vm_operate_api_base}/boot`,
    shutdown: `${vm_operate_api_base}/shutdown`,
    poweroff: `${vm_operate_api_base}/poweroff`,
    reboot: `${vm_operate_api_base}/reboot`,
    reset: `${vm_operate_api_base}/reset`,
}

export const vm_manage_api: VMManageApiEndpoints = {
    createFromTemplate: `${vm_manage_api_base}/createFromTemplate`,
    deleteVM: `${vm_manage_api_base}/delete`,
    updateVMConfig: `${vm_manage_api_base}/updateConfig`,
    createFromBoxTemplate: `${vm_manage_api_base}/createFromBoxTemplate`
};

export const pve_api: PVEApiEndpoints = {
    getQemuConfig: `${pve_api_base}/getQemuConfig`,
    getNodes: `${pve_api_base}/getNodes`,
};

export const guacamole_api: GuacamoleApiEndpoints = {
    sshConnection: `${guacamole_api_base}/ssh`,
    rdpConnection: `${guacamole_api_base}/rdp`,
    vncConnection: `${guacamole_api_base}/vnc`,
    disConnect: `${guacamole_api_base}/disconnect`,
    deleteConnection: `${guacamole_api_base}/deleteConnection`,
    listConnections: `${guacamole_api_base}/connections`
};

export const vm_template_api: VMTemplateApiEndpoints = {
    getAllTemplates: `${vm_template_api_base}/getAll`,
    getAccessibleTemplates: `${vm_template_api_base}/getAccessable`,
    convertVMtoTemplate: `${vm_template_api_base}/convert`,
    submitTemplate: `${vm_template_api_base}/submit`,
    getAllSubmittedTemplates: `${vm_template_api_base}/getAllSubmittedTemplates`,
    audit: `${vm_template_api_base}/audit`
};

export const vm_template_manage_api: VMTemplateManageApiEndpoints = {
    update: `${vm_template_manage_api_base}/update`,
    delete: `${vm_template_manage_api_base}/delete`,
    clone: `${vm_template_manage_api_base}/clone`
};

export const superadmin_api: SuperadminApiEndpoints = {
    getAllUsers: `${superadmin_api_base}/getAllUsers`,
    getAllAdminUsers: `${superadmin_api_base}/getAllAdminUsers`
}

export const superadmin_crp_api: SuperadminCRPApiEndpoints = {
    create: `${superadmin_crp_api_base}/create`,
    getAll: `${superadmin_crp_api_base}/getAll`,
    getById: (crp_id: string) => `${superadmin_crp_api_base}/getById/${crp_id}`,
    update: (crp_id: string) => `${superadmin_crp_api_base}/update/${crp_id}`,
    delete: (crp_id: string) => `${superadmin_crp_api_base}/delete/${crp_id}`,
}

export const box_api: BoxApiEndpoints = {
    submitBox: `${box_api_base}/submit`,
    auditBox: `${box_api_base}/audit`, // superadmin
    getSubmittedBoxes: `${box_api_base}/submissions`, // superadmin
    rateBox: `${box_api_base}/rate`,
    getPublicBoxes: `${box_api_base}/public`,
    getPendingBoxes: `${box_api_base}/pending`, // superadmin
    getBoxReviews: `${box_api_base}/reviews`,
    getMyAnswerRecord: `${box_api_base}/getMyAnswerRecord`,
    subitBoxAnswer: `${box_api_base}/submitBoxAnswer`,
}