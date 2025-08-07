import { useEffect, useRef, useState } from "react";
import { ChapterPageDTO } from "../interface/Chapter/ChapterPageDTO";
import { Col, Container, Row, Toast, ToastContainer } from "react-bootstrap";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import { useParams } from "react-router-dom";
import { chapter_api, course_api } from "../enum/api";
import { asyncGet } from "../utils/fetch";
import ChapterHeader from "../component/Chapter/ChapterHeader";
import { CourseMenuProps } from "../interface/Course/CourseMenuProps";
import CourseMenu from "../component/Course/CourseMenu";
import '../style/course/Course.css';
import ChapterContent from "../component/Chapter/ChapterContent";

export default function Chapter() {
    const cache = useRef<boolean>(false);
    const [chapter, setChapter] = useState<ChapterPageDTO | null>(null);
    const [courseMenu, setCourseMenu] = useState<CourseMenuProps | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastBg, setToastBg] = useState<"success" | "danger" | "secondary">("secondary");
    const [loading, setLoading] = useState(true);
    const { chapterId } = useParams();

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
            const fetchAllData = async () => {
                cache.current = true;
                setLoading(true);

                if (!chapterId) {
                    setToast("無效的章節 ID", "danger");
                    setLoading(false);
                    return;
                }

                const token = localStorage.getItem('token');
                if (!token) {
                    setToast("請先登入", "danger");
                    setLoading(false);
                    return;
                }

                try {
                    const chapterApiUrl = chapter_api.getChapterById(chapterId);
                    const chapterRes = await asyncGet(chapterApiUrl, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (chapterRes.code !== 200) {
                        throw new Error(chapterRes.message || "載入章節資料失敗");
                    }

                    const chapterData = chapterRes.body;
                    setChapter(chapterData);

                    const courseId = chapterData?.course_id;
                    if (!courseId) {
                        throw new Error(chapterData.message || "從章節資料中找不到 course_id");
                    }

                    const courseMenuApiUrl = course_api.getCourseMenu(courseId);
                    const courseMenuRes = await asyncGet(courseMenuApiUrl, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (courseMenuRes.code !== 200) {
                        throw new Error(courseMenuRes.message || "載入課程目錄失敗");
                    }

                    setCourseMenu(courseMenuRes.body);
                    console.log(courseMenuRes.body);

                } catch (error: any) {
                    console.error("載入資料時發生錯誤:", error);
                    setToast(error.message || "載入資料時發生錯誤", "danger");
                } finally {
                    setLoading(false);
                }
            }

            fetchAllData();
        }
    }, [chapterId]);

    return (
        <>
            {chapter && courseMenu && (
                <>
                    <NavBar />
                    <Container fluid className="course-container">
                        <Row>
                            <Col>
                                <ChapterHeader {...chapter} />
                            </Col>
                        </Row>
                        <Row className="course-main-section">
                            <Col lg={8} md={12} className="course-left-section">
                                <ChapterContent {...chapter}/>
                            </Col>
                            <Col lg={4} md={12} className="course-right-section">
                                <CourseMenu {...courseMenu} />
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
