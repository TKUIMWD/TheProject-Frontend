import { Container, Row, Col, ToastContainer, Toast } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import CourseHeader from "../component/Course/CourseHeader";
import CourseContent from "../component/Course/CourseContent";
import CourseMenu from "../component/Course/CourseMenu";
import SubmitterInfo from "../component/Course/SubmitterInfo";
import { asyncGet } from "../utils/fetch";
import { course_api } from "../enum/api";
import { CoursePageDTO } from "../interface/Course/CoursePageDTO";
import { CourseMenuProps } from "../interface/Course/CourseMenuProps"
import { useParams } from "react-router-dom";
import '../style/course/Course.css';

export default function Course() {
    const cache = useRef<boolean>(false);
    const [courseData, setCourseData] = useState<CoursePageDTO | null>(null);
    const [courseMenu, setCourseMenu] = useState<CourseMenuProps | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastBg, setToastBg] = useState<"success" | "danger" | "secondary">("secondary");
    const [loading, setLoading] = useState(true);

    const { courseId } = useParams();
    const apiUrl = `${course_api.getCourseById}/${courseId}`;

    const setToast = (message: string, bg: "success" | "danger" | "secondary") => {
        setToastMessage(message);
        setToastBg(bg);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 2000);
    };

    useEffect(() => {
        if (!cache.current) {
            cache.current = true;
            setLoading(true);

            if (!courseId) {
                setToast("無效的課程 ID", "danger");
                setLoading(false);
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                setToast("請先登入", "danger");
                setLoading(false);
                return;
            }

            const fetchCourseData = async () => {
                try {
                    asyncGet(apiUrl, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }).then((res) => {
                        if (res.code === 200) {
                            setCourseData(res.body);
                        } else {
                            setToast("載入課程失敗", "danger");
                        }
                    })
                } catch (error) {
                    console.error("載入課程時發生錯誤:", error);
                    setToast("載入課程時發生錯誤", "danger");
                }
            }

            const fetchCourseMenu = async () => {
                try {
                    asyncGet(`${apiUrl}/menu`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }).then((res) => {
                        if (res.code === 200) {
                            setCourseMenu(res.body);
                        } else {
                            setToast("載入課程目錄失敗", "danger");
                        }
                    })
                } catch (error) {
                    console.error("載入課程目錄時發生錯誤:", error);
                    setToast("載入課程目錄時發生錯誤", "danger");
                }
            }

            fetchCourseData();
            fetchCourseMenu();
            setLoading(false);
        }
    }, [courseId]);

    return (
        <>
            {courseData && courseMenu && (
                <>
                    <NavBar />
                    <Container fluid className="course-container">
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
                                <CourseMenu {...courseMenu} />
                                <SubmitterInfo {...courseData} />
                            </Col>
                        </Row>
                    </Container>
                    <Footer />
                </>
            )}

            {loading && (
                <div className="loading-overlay">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">載入中...</span>
                    </div>
                </div>
            )}

            <ToastContainer position="top-center" className="p-3 profile-toast">
                <Toast bg={toastBg} show={showToast} onClose={() => setShowToast(false)} delay={2000} autohide>
                    <Toast.Body className="text-center text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}