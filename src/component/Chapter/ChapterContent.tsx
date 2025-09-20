import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CourseMenu from '../Course/CourseMenu';
import { ClassMap } from '../../interface/Course/Maps';
import { ChapterPageDTO } from '../../interface/Chapter/ChapterPageDTO';
import { getAuthStatus } from '../../utils/token';
import { useEffect, useState } from 'react';
import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import '../../style/course/CourseContent.css';
import '../../style/BoxAndCourseUniversal/UniversalContent.css';

interface ChapterContentProps {
    chapter: ChapterPageDTO;
    class_titles: ClassMap[];
    isEnrolled: boolean;
    showJoinCourseModal: () => void;
}

function Content( { chapter }: { chapter: ChapterPageDTO }) {
    const role = getAuthStatus();
    const [content, setContent] = useState<string>("");
    
    // !暫時方案 依照role決定顯示內容
    useEffect(() => {
        if (!chapter) {
            setContent("這個課程目前沒有內容。");
            return;
        }

        if (role == "user") {
            setContent(chapter.has_approved_content);
        } else {
            setContent(chapter.waiting_for_approve_content);
        }
    }, [chapter]);

    return (
        <Container className="tab-pane-content">
            <Row>
                <h3><b>課程內容</b></h3>
                <hr />
                <Col className="chapter-content-container" lg={12}>
                    <p>{chapter && content ? (
                        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
                    ) : (
                        "這個課程目前沒有內容。"
                    )}</p>
                </Col>
            </Row>
        </Container>
    );
}

export default function ChapterContent({ chapter, class_titles, isEnrolled, showJoinCourseModal }: ChapterContentProps) {
    return (
        <Container className="content">
            <Tabs
                defaultActiveKey={"course-content"}
                fill
            >
                <Tab eventKey="course-content" title="課程內容">
                    <Content chapter={chapter} />
                </Tab>
                <Tab eventKey="course-menu" title="目錄">
                    <CourseMenu
                        class_titles={class_titles}
                        isEnrolled={isEnrolled}
                        showJoinCourseModal={showJoinCourseModal}
                    />
                </Tab>
            </Tabs>
        </Container>
    );
}
