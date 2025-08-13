import { SubmitterInfo } from "./SubmitterInfo.ts";

export interface CoursePageDTO {
    _id: string;
    course_name: string;
    course_subtitle: string;
    course_description: string;
    course_duration_in_minutes: number;
    course_difficulty: "Easy" | "Medium" | "Hard";
    course_rating: number;
    course_reviews: Array<string>; // !temp
    course_update_date: Date;
    submitterInfo: SubmitterInfo;
}