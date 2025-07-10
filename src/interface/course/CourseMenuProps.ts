export interface CourseMenuProps {
    class_titles: ClassTitle[];
}

export interface ClassTitle {
    class_order: number;
    class_name: string;
    chapter_titles: ChapterTitle[];
}

export interface ChapterTitle {
    chapter_order: number;
    chapter_name: string;
}