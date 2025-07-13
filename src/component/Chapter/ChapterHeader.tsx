import { Container, Row, Col } from "react-bootstrap";
import { ChapterPageDTO } from "../../interface/Chpater/ChapterPageDTO";
import { useNavigate } from "react-router-dom";
import '../../style/course/CourseHeader.css';

export default function ChapterHeader(chapterDTO: ChapterPageDTO) {
    const navigate = useNavigate();
    const { chapter_name, chapter_subtitle, chapter_order, course_id, course_name } = chapterDTO;

    return (
        <Container fluid className="course-header">
            <Row>
                <Col lg={8}>
                    <div>
                        <a className="course-path" onClick={() => navigate(`/dashboard?tab=MyCourses`)} >我的課程 </a>
                        <span><i className="bi bi-arrow-right course-path-arrow"></i> </span>
                        <a className="course-path" onClick={() => navigate(`/courses/${course_id}`)} >{course_name} </a>
                        <span><i className="bi bi-arrow-right course-path-arrow"></i> </span>
                        <span className="course-path">{chapter_name}</span>
                    </div>
                    <h1 className="course-title">Chapter {chapter_order}. {chapter_name}</h1>
                    <h4 className="course-subtitle">{chapter_subtitle}</h4>
                </Col>
            </Row>
        </Container>
    );
}
