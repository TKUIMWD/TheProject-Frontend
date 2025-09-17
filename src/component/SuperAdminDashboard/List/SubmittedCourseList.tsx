
import { Button, Table } from "react-bootstrap";
import { CourseInfo } from "../../../interface/Course/Course";
import { formatISOString, minute_to_hour } from "../../../utils/timeFormat";
import { useNavigate } from "react-router-dom";

interface CourseListProps {
    courses: CourseInfo[];
    handleAudit: (course_id: string, approved: boolean) => void;
}

export default function SubmittedCourseList({ courses, handleAudit }: CourseListProps) {
    const navigate = useNavigate();
    const course_image_base = "/src/assets/images/Dashboard/course_image.jpg";
    
    function handleClick(e: React.MouseEvent, course_id: string) {
        e.stopPropagation();
        navigate(`/courses/${course_id}`);
    }

    const course_title = (course: CourseInfo) => (
        <div className="d-flex align-items-center gap-3">
            <img src={course_image_base} alt="course-image" className="course-image" />
            <div className="text-start">
                <h5 className="mb-1">{course.course_name}</h5>
                <div className="d-flex align-items-center gap-3 text-muted small">
                    <span>
                        <i className="bi bi-clock me-1"></i>
                        {minute_to_hour(course.duration_in_minutes)} hr
                    </span>
                    <span>
                        <i className="bi bi-bar-chart-fill me-1"></i>
                        {course.difficulty}
                    </span>
                    <span>
                        <i className="bi bi-star-fill me-1 text-warning"></i>
                        {course.rating.toFixed(1)}
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <Table bordered hover className="text-center">
            <thead>
                <tr>
                    <th>#</th>
                    <th className="text-start">課程</th>
                    <th>狀態</th>
                    <th>教師</th>
                    <th>更新時間</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                {courses.map((course, index) => (
                    <tr key={course._id} className="text-center align-middle" onClick={(e) => { handleClick(e, course._id) }}>
                        <td>{index + 1}</td>
                        <td>{course_title(course)}</td>
                        <td>{course.status}</td>
                        <td>{course.teacher_name}</td>
                        <td>{formatISOString(course.update_date)}</td>
                        <td>
                            <Button className="me-2" variant="outline-success" onClick={(e) => { e.stopPropagation(); handleAudit(course._id, true); }}>核准</Button>
                            <Button variant="outline-danger" onClick={(e) => { e.stopPropagation(); handleAudit(course._id, false); }}>拒絕</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}