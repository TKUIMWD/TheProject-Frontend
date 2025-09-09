import { Breadcrumb, Image } from "react-bootstrap";
import { CourseHeaderProps } from "../../interface/Course/CourseHeaderProp";
import { CoursePageDTO } from "../../interface/Course/CoursePageDTO";
import '../../style/BoxAndCourseUniversal/UniversalHeader.css';

export default function CourseHeader(courseData: CoursePageDTO) {
    const imageUrl = "/src/assets/images/Course/course_banner.jpg";

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
        <div className="header">
            <Image className="header-img" src={imageUrl} fluid />
            <div className="header-title">
                <h1>{title}</h1>
                <h5>{subtitle}</h5>
                <Breadcrumb>
                    <Breadcrumb.Item href="../dashboard?tab=MyCourses">我的課程</Breadcrumb.Item>
                    <Breadcrumb.Item active>{title}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            {/* <div className="course-info">
                <i className="bi bi-clock"></i><span className="course-meta">{formatDuration(duration)}</span>
                <i className="bi bi-bar-chart-fill"></i><span className="course-meta">{difficulty}</span>
                <i className="bi bi-star-fill text-warning"></i><span className="course-meta">{formatRating(rating)}</span>
            </div> */}
        </div>
    );
}
