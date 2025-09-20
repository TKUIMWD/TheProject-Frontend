import { useEffect, useState } from "react";
import { ChapterPageDTO } from "../interface/Chapter/ChapterPageDTO";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { chapter_api, course_api, vm_template_api } from "../enum/api";
import { asyncGet } from "../utils/fetch";
import ChapterHeader from "../component/Chapter/ChapterHeader";
import { CourseMenuProps } from "../interface/Course/CourseMenuProps";
import ChapterContent from "../component/Chapter/ChapterContent";
import { useToast } from "../context/ToastProvider";
import ChapterSidebar from "../component/Chapter/ChapterSidebar";
import { VM_Template_Info } from "../interface/VM/VM_Template";
import { getOptions } from "../utils/token";
import { UserProfile } from "../interface/User/User";
import Loading from "../component/Loading";
import JoinCourseModal from "../component/modal/JoinCourseModal";
import '../style/course/Course.css';

export default function Chapter() {
    const [chapter, setChapter] = useState<ChapterPageDTO | null>(null);
    const [courseMenu, setCourseMenu] = useState<CourseMenuProps | null>(null);
    const [submitter, setSubmitter] = useState<UserProfile | null>(null);
    const [template, setTemplate] = useState<VM_Template_Info | undefined>(undefined);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [showJoinCourseModal, setShowJoinCourseModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const { chapterId } = useParams();
    const { showToast } = useToast();

    // 先取得chapter, 再取得courseMenu，再取得template
    useEffect(() => {
        // 為了處理非同步請求中斷，建立一個 AbortController
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchAllData = async () => {
            setLoading(true);

            if (!chapterId) {
                showToast("無效的章節 ID", "danger");
                setLoading(false);
                return;
            }

            // 將 options 的 signal 設為 controller 的 signal
            const options = { ...getOptions(), signal };

            try {
                // 取得 chapter 資料
                const chapterApiUrl = chapter_api.getChapterById(chapterId);
                const chapterRes = await asyncGet(chapterApiUrl, options);

                if (chapterRes.code === 200) {
                    setIsEnrolled(true);
                } else if (chapterRes.code === 403) {
                    setIsEnrolled(false);
                } else {
                    throw new Error(chapterRes.message || "載入章節資料失敗");
                }

                const chapterData = chapterRes.body;
                setChapter(chapterData);

                const courseId = chapterData?.course_id;
                if (!courseId) {
                    throw new Error(chapterData.message || "從章節資料中找不到 course_id");
                }

                // 取得 courseMenu 資料 
                const courseMenuApiUrl = course_api.getCourseMenu(courseId);
                const courseMenuRes = await asyncGet(courseMenuApiUrl, options);

                if (courseMenuRes.code !== 200) {
                    throw new Error(courseMenuRes.message || "載入課程目錄失敗");
                }

                setCourseMenu(courseMenuRes.body);

                // 取得 submitter 資料
                const courseApiUrl = course_api.getCourseById(courseId);
                const courseRes = await asyncGet(courseApiUrl, options);
                if (courseRes.code !== 200) {
                    throw new Error(courseRes.message || "載入課程資料失敗");
                }
                setSubmitter(courseRes.body.submitterInfo);

                // 取得 template 資料
                if (!chapterData.template_id) {
                    setTemplate(undefined);
                    return;
                }
                const templateApiUrl = vm_template_api.getAccessibleTemplates;
                const templateRes = await asyncGet(templateApiUrl, options);
                if (templateRes.code !== 200) {
                    throw new Error(templateRes.message || "載入範本資料失敗");
                }

                setTemplate(templateRes.body.find((t: VM_Template_Info) => t._id === chapterData.template_id) || null);

            } catch (error: any) {
                // 如果請求被中斷，不要顯示錯誤訊息
                if (error.name !== 'AbortError') {
                    console.error("載入資料時發生錯誤:", error);
                    showToast(error.message || "載入資料時發生錯誤", "danger");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchAllData();

        return () => {
            // 當元件卸載或 useEffect 重新執行前，中斷所有進行中的 fetch 請求
            controller.abort();
        };

    }, [chapterId]); // 依賴 chapterId 保持不變

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <>
            {chapter && courseMenu && (
                <>
                    <Container fluid className="course-container">
                        <Row>
                            <Col>
                                <ChapterHeader {...chapter} />
                            </Col>
                        </Row>
                        <Row className="course-main-section">
                            <Col lg={9} md={12} className="course-left-section">
                                <ChapterContent
                                    chapter={chapter}
                                    class_titles={courseMenu.class_titles || []}
                                    isEnrolled={isEnrolled}
                                    showJoinCourseModal={() => setShowJoinCourseModal(true)}
                                />
                            </Col>
                            <Col lg={3} md={12} className="course-right-section">
                                <ChapterSidebar submitter={submitter} template={template} />
                            </Col>
                        </Row>
                    </Container>
                </>
            )}

            {chapter && (
                <JoinCourseModal
                    courseId={chapter.course_id}
                    show={showJoinCourseModal}
                    setShow={() => setShowJoinCourseModal(false)}
                />
            )}
        </>
    );
}
