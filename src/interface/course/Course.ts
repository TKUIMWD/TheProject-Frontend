export interface Course {
    _id?: string,
    course_name: string,
    course_subtitle: string,
    course_description: string,
    duration_in_minutes: number,
    difficulty: string,
    class_ids: Array<string>,
    status?: "公開" | "未公開" | "編輯中" | "審核中" | "審核未通過"
}

export interface CourseInfo {
    _id: string,
    course_name: string,
    duration_in_minutes: number,
    difficulty: string,
    rating: number,
    teacher_name: string,
    update_date: string,
    status?: "公開" | "未公開" | "編輯中" | "審核中" | "審核未通過"
}