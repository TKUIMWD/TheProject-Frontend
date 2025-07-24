export interface Course {
    _id?: string,
    course_name: string,
    course_subtitle: string,
    course_description: string,
    duration_in_minutes: number,
    difficulty: string,
    class_ids: Array<string>,
}

export interface CourseInfo {
    _id: string,
    course_name: string,
    duration_in_minutes: number,
    difficulty: string,
    rating: number,
    teacher_name: string,
    update_date: string,
}