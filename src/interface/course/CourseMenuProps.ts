import { ClassMap } from "./Maps";

export interface CourseMenuProps {
    showJoinCourseModal: () => void;
    isEnrolled?: boolean;
    class_titles: ClassMap[];
}