import { useRef } from "react";
import { Dropdown, Table } from "react-bootstrap";
import { CourseInfo } from "../../../interface/Course/Course";
import { formatISOString, minute_to_hour } from "../../../utils/timeFormat";
import { useNavigate } from "react-router-dom";
import '../../../style/superAdmin/List/CourseList.css';

interface CourseListProps {
    courses: CourseInfo[];
    handleDelete: (course_id: string) => void;
}

export default function AllCourse({ courses, handleDelete }: CourseListProps) {
    
    const navigate = useNavigate();
    
    const course_image_base = "/src/assets/images/Dashboard/course_image.jpg";
    const dropdownClicked = useRef(false);

    

    

    function handleClick(e: React.MouseEvent, course_id: string) {
        e.stopPropagation();
        // 3. 在執行 navigate 之前，檢查 "鎖"
        if (dropdownClicked.current) {
            // 如果鎖是啟用的 (代表剛剛的操作是在 dropdown 內)，
            // 則重置鎖，並立即返回，不執行跳轉。
            dropdownClicked.current = false;
            return;
        }

        // 如果鎖是關閉的，才執行頁面跳轉
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
                            <Dropdown
                                onMouseEnter={() => { dropdownClicked.current = true; }}
                            >
                                <Dropdown.Toggle variant="none" className="no-arrow">
                                    <i className="bi bi-three-dots-vertical"></i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleDelete(course._id)}>
                                        刪除
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}