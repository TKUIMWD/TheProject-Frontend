import { Breadcrumb, Image } from "react-bootstrap";
import { ChapterPageDTO } from "../../interface/Chapter/ChapterPageDTO";
import { useNavigate } from "react-router-dom";
import '../../style/BoxAndCourseUniversal/UniversalHeader.css';

export default function ChapterHeader(chapterDTO: ChapterPageDTO) {
    const navigate = useNavigate();
    const imageUrl = "/src/assets/images/Course/course_banner.jpg";
    const { chapter_name, chapter_subtitle, chapter_order, course_id, course_name } = chapterDTO;

    return (
        <div className="header">
            <Image className="header-img" src={imageUrl} fluid />
            <div className="header-title">
                <h1>Chapter {chapter_order}. {chapter_name}</h1>
                <h5>{chapter_subtitle}</h5>
                <Breadcrumb>
                    <Breadcrumb.Item href="../dashboard?tab=MyCourses">我的課程</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate(`/courses/${course_id}`)}>{course_name}</Breadcrumb.Item>
                    <Breadcrumb.Item active>{chapter_name}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
        </div>
    );
}
