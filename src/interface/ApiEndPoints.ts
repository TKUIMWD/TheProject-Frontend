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
    getUserCourses: string;
    getUserCRP: string;
    getUserById: (id: string) => string;
}

export interface CourseApiEndpoints {
    addCourse: string;
    getAllPublicCourses: string;
    getCourseById: (course_id: string) => string;
    getCourseMenu: (course_id: string) => string;
    updateCourseById: (course_id: string) => string;
    deleteCourseById: (course_id: string) => string;
    joinCourseById: (course_id: string) => string;
}

export interface ClassApiEndpoints {
    getClassById: (class_id: string) => string;
    addClassToCourse: (course_id: string) => string;
    updateClassById: (class_id: string) => string;
    deleteClassById: (class_id: string) => string;
}

export interface ChapterApiEndpoints {
    getChapterById: (chapter_id: string) => string;
    addChapterToClass: (class_id: string) => string;
    updateChapterById: (chapter_id: string) => string;
    deleteChapterById: (chapter_id: string) => string;
}

export interface VMApiEndpoints {
    getUsersOwnedVMs: string;
    getAllMachines: string;
    getVMStatus: string;
    getVMNetworkInfo: string;
}

export interface VMOperateApiEndpoints {
    boot: string,
    shutdown: string,
    poweroff: string,
    reboot: string,
    reset: string
}

export interface VMManageApiEndpoints {
    createFromTemplate: string;
    deleteVM: string;
    updateVMConfig: string;
}

export interface PVEApiEndpoints {
    getQemuConfig: string;
    getNodes: string;
}

export interface GuacamoleApiEndpoints {
    sshConnection: string;
    rdpConnection: string;
    vncConnection: string;
    disConnect: string;
    deleteConnection: string;
    listConnections: string;
}

export interface VMTemplateApiEndpoints {
    getAllTemplates: string;
    getAccessibleTemplates: string;
    convertVMtoTemplate: string;
    submitTemplate: string;
    getAllSubmittedTemplates: string;
    audit: string;
}

export interface VMTemplateManageApiEndpoints {
    update: string;
    delete: string;
    clone: string;
};

export interface SuperadminApiEndpoints {
    getAllUsers: string;
    getAllAdminUsers: string;
}

export interface SuperadminCRPApiEndpoints {
    create: string;
    update: (crp_id: string) => string;
    delete: (crp_id: string) => string;
    getAll: string;
    getById: (crp_id: string) => string;
}

export interface BoxApiEndpoints {
    submitBox: string;
    auditBox: string; // superadmin
    getSubmittedBoxes: string; // superadmin
    rateBox: string;
    getPublicBoxes: string;
    getPendingBoxes: string; // superadmin
    getBoxReviews: string;
}
