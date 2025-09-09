import { useState } from "react";
import { Container, Card, Collapse, ListGroup } from "react-bootstrap";
import { CourseMenuProps } from "../../interface/Course/CourseMenuProps";
import { useNavigate } from "react-router-dom";
import Loading from "../../component/Loading";
import '../../style/BoxAndCourseUniversal/UniversalContent.css';
import '../../style/course/CourseMenu.css';

export default function CourseMenu({ showJoinCourseModal, class_titles, isEnrolled }: CourseMenuProps) {
    const navigate = useNavigate();
    const [expandedClasses, setExpandedClasses] = useState<Set<number>>(new Set([1])); // 預設第一個展開

    // 切換 class 的展開/收合狀態
    const toggleClass = (classOrder: number) => {
        const newExpanded = new Set(expandedClasses);
        if (newExpanded.has(classOrder)) {
            newExpanded.delete(classOrder);
        } else {
            newExpanded.add(classOrder);
        }
        setExpandedClasses(newExpanded);
    };

    const handleChapterClick = async (chapterId: string) => {
        if (isEnrolled) {
            navigate(`/chapters/${chapterId}`);
        } else {
            showJoinCourseModal();
        }
    };

    return (
        <>
            {!class_titles || class_titles.length === 0 && (
                <Container className="course-menu">
                    <div className="course-menu-header">
                        <h4 className="mb-3">目錄</h4>
                    </div>
                    <Loading />
                </Container>
            )}

            <div>
                {class_titles.map((classItem) => (
                    <Card key={classItem.class_order} className="mb-3 class-card">
                        <Card.Header
                            className="class-header"
                            onClick={() => toggleClass(classItem.class_order)}
                        >
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="class-title">
                                    <span>
                                        class {classItem.class_order}. {classItem.class_name}
                                    </span>
                                </div>
                                <div className="expand-icon">
                                    <i className={`bi ${expandedClasses.has(classItem.class_order) ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                </div>
                            </div>
                        </Card.Header>

                        <Collapse in={expandedClasses.has(classItem.class_order)}>
                            <div>
                                <ListGroup variant="flush">
                                    {classItem.chapter_titles.map((chapterItem) => (
                                        <ListGroup.Item
                                            key={chapterItem.chapter_order}
                                            action
                                            className="chapter-item d-flex justify-content-between align-items-center"
                                            onClick={() => {
                                                handleChapterClick(chapterItem.chapter_id);
                                            }}
                                        >
                                            <div className="chapter-content">
                                                <span className="chapter-number me-2 text-muted">
                                                    chapter {chapterItem.chapter_order}.
                                                </span>
                                                <span className="chapter-name">
                                                    {chapterItem.chapter_name}
                                                </span>
                                            </div>
                                            <div className="chapter-status">
                                                <i className="bi bi-play-circle text-primary"></i>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </div>
                        </Collapse>
                    </Card>
                ))}
            </div>
        </>
    );
}
