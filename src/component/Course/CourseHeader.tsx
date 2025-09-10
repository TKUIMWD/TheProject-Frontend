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

    const { title, subtitle } = courseHeaderProps;

    

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
            
        </div>
    );
}
