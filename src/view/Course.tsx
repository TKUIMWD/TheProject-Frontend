import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import CourseHeader from "../component/Course/CourseHeader";
import CourseContent from "../component/Course/CourseContent";
import CourseMenu from "../component/Course/CourseMenu";
import SubmitterInfo from "../component/Course/SubmitterInfo";
import JoinCourseModal from "../component/modal/JoinCourseModal";
import { asyncGet } from "../utils/fetch";
import { course_api } from "../enum/api";
import { CoursePageDTO } from "../interface/Course/CoursePageDTO";
import { CourseMenuProps } from "../interface/Course/CourseMenuProps"
import { useToast } from "../context/ToastProvider";
import '../style/course/Course.css';

export default function Course() {
    const cache = useRef<boolean>(false);
    const [courseData, setCourseData] = useState<CoursePageDTO | null>(null);
    const [courseMenu, setCourseMenu] = useState<CourseMenuProps | null>(null);
    const [isEnrolled, setIsEnrolled] = useState(false); // 使用者是否加入課程的狀態
    const [showJoinCourseModal, setShowJoinCourseModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const { courseId } = useParams();

    useEffect(() => {
        if (!cache.current) {
            cache.current = true;
            setLoading(true);

            if (!courseId) {
                showToast("無效的課程 ID", "danger");
                setLoading(false);
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                showToast("請先登入", "danger");
                setLoading(false);
                return;
            }

            const fetchCourseData = async () => {
                try {
                    asyncGet(course_api.getCourseById(courseId), {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }).then((res) => {
                        if (res.code === 200) {
                            setCourseData(res.body);
                            setIsEnrolled(true);
                        } else if (res.code === 403) {
                            setCourseData(res.body);
                            setIsEnrolled(false);
                        } else {
                            showToast("載入課程失敗", "danger");
                        }
                    })
                } catch (error) {
                    console.error("載入課程時發生錯誤:", error);
                    showToast("載入課程時發生錯誤", "danger");
                }
            }

            const fetchCourseMenu = async () => {
                try {
                    asyncGet(course_api.getCourseMenu(courseId), {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }).then((res) => {
                        if (res.code === 200) {
                            setCourseMenu(res.body);
                            setIsEnrolled(true);
                        } else if (res.code === 403) {
                            setCourseMenu(res.body);
                            setIsEnrolled(false);
                        } else {
                            showToast("載入課程目錄失敗", "danger");
                        }
                    })
                } catch (error) {
                    console.error("載入課程目錄時發生錯誤:", error);
                    showToast("載入課程目錄時發生錯誤", "danger");
                }
            }

            Promise.all([fetchCourseData(), fetchCourseMenu()]).finally(() => {
                setLoading(false);
            });
        }
    }, [courseId]);

    return (
                <>
            <NavBar />
            <Container fluid className="course-container">
                {loading ? (
                    <div className="loading-overlay">
                       <Spinner animation="border" />
                    </div>
                ) : courseData ? (
                    <>
                        <Row>
                            <Col>
                                <CourseHeader {...courseData} />
                            </Col>
                        </Row>
                        <Row className="course-main-section">
                            <Col lg={8} md={12} className="course-left-section">
                                <CourseContent {...courseData} />
                            </Col>
                            <Col lg={4} md={12} className="course-right-section">
                                <CourseMenu
                                    // 確保即使 menu 為 null 也不會出錯
                                    class_titles={courseMenu?.class_titles || []}
                                    isEnrolled={isEnrolled}
                                    showJoinCourseModal={() => setShowJoinCourseModal(true)}
                                />
                                <SubmitterInfo {...courseData} />
                            </Col>
                        </Row>
                    </>
                ) : (
                    <div className="text-center my-5">無法載入課程資訊。</div>
                )}
            </Container>
            <Footer />

            <JoinCourseModal
                courseId={courseId || ""}
                show={showJoinCourseModal}
                setShow={() => setShowJoinCourseModal(false)}
            />
        </>
    );
}