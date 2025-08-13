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