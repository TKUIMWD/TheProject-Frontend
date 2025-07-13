import { Container, Row, Col } from "react-bootstrap";
import '../../style/course/CourseHeader.css';
import { CourseHeaderProps } from "../../interface/Course/CourseHeaderProp";
import { CoursePageDTO } from "../../interface/Course/CoursePageDTO";
import { useNavigate } from "react-router-dom";

export default function CourseHeader(courseData: CoursePageDTO) {
    const navigate = useNavigate();
    const courseHeaderProps: CourseHeaderProps = {
        title: courseData.course_name,
        subtitle: courseData.course_subtitle,
        duration: courseData.course_duration_in_minutes,
        difficulty: courseData.course_difficulty,
        rating: courseData.course_rating,
    };

    const { title, subtitle, duration, difficulty, rating } = courseHeaderProps;

    const formatDuration = (duration: number): string => {
        const hours = Math.floor(duration / 60).toFixed(1);
        return `${hours} hr`
    };

    const formatRating = (rating: number): string => {
        return rating.toFixed(1);
    };

    return (
        <Container fluid className="course-header">
            <Row>
                <Col lg={8}>
                    <div>
                        <a className="course-path" onClick={() => navigate(`/dashboard?tab=MyCourses`) } >我的課程 </a>
                        <span><i className="bi bi-arrow-right course-path-arrow"></i> </span>
                        <span className="course-path">{title}</span>
                    </div>
                    <h1 className="course-title">{title}</h1>
                    <h4 className="course-subtitle">{subtitle}</h4>
                    <div className="course-info">
                        <i className="bi bi-clock"></i><span className="course-meta">{formatDuration(duration)}</span>
                        <i className="bi bi-bar-chart-fill"></i><span className="course-meta">{difficulty}</span>
                        <i className="bi bi-star-fill text-warning"></i><span className="course-meta">{formatRating(rating)}</span>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
