import { Button, Card } from "react-bootstrap";
import { minute_to_hour } from "../../utils/timeFormat";
import { asyncPost } from "../../utils/fetch";
import { course_api } from "../../enum/api";
import { useToast } from "../../context/ToastProvider";
import { useNavigate } from "react-router-dom";
import { CourseInfo } from "../../interface/Course/Course";
import '../../style/courseResource/CourseResource.css';
import IMAGE_PATH from "/src/assets/images/Dashboard/course_image.jpg";

interface CourseResourceProps {
    courses: CourseInfo[] | null;
    userCourses: CourseInfo[] | null;
    loading: boolean;
}

export default function Cards({ courses, userCourses, loading }: CourseResourceProps) {
    const userCourseIds = new Set(userCourses?.map(c => c._id) || []);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleJoinCourse = (courseId: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("請先登入");
            window.location.href = "/";
            return;
        }

        if (!courseId) {
            showToast("無效的課程 ID", "danger");
            return;
        }

        asyncPost(course_api.joinCourseById(courseId), {}, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((res) => {
            if (res.code === 200) {
                showToast("成功加入課程", "success");
            } else {
                showToast(`加入課程失敗: ${res.message}`, "danger");
            }
        }).catch((error) => {
            console.error("加入課程時發生錯誤:", error);
            showToast("加入課程時發生錯誤", "danger");
        })
    }

    if (loading) {
        return <div className="text-center my-5">載入中...</div>;
    }

    if (courses === null || courses.length === 0) {
        return <div className="text-center my-5">沒有可用的課程資源</div>;
    }

    return (
        <div className="course-resources-container container mx-auto">
            {courses.map((course) => {
                const isEnrolled = userCourseIds.has(course._id);
                return (
                    <Card className="card" key={course._id} onClick={() => navigate(`/courses/${course._id}`)} style={{ width: '20rem', height: '35rem' }}>
                        <Card.Img variant="top" src={IMAGE_PATH} />
                        <Card.Body>
                            <div>
                                <Card.Title>{course.course_name}</Card.Title>
                                <Card.Text>
                                    <p className="text-muted mb-0">
                                        <span className="me-3">
                                            <i className="bi bi-clock"></i> {minute_to_hour(course.duration_in_minutes)} hr
                                        </span>
                                        <span className="me-3">
                                            <i className="bi bi-bar-chart-fill"></i> {course.difficulty}
                                        </span>
                                        <span className="me-3">
                                            <i className="bi bi-star-fill text-warning"></i>{course.rating.toFixed(1)}
                                        </span>
                                    </p>
                                    <div className="course-subtitle-container">
                                        {course.course_subtitle || "無副標題"}
                                    </div>
                                </Card.Text>
                            </div>

                            <div className="mt-auto">
                                <div>
                                    <hr />
                                    <p className="text-muted small mb-1">提交者：{course.teacher_name}</p>
                                    <p className="text-muted small mb-2">更新時間：{new Date(course.update_date).toLocaleDateString()}</p>
                                </div>
                                <Button
                                    variant="success"
                                    className="w-100"
                                    disabled={isEnrolled}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isEnrolled) {
                                            handleJoinCourse(course._id)
                                        }
                                    }}
                                >
                                    {isEnrolled ? "已加入課程" : "加入課程"}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                );
            })}
        </div>
    );
}