import { Col, Container, Row } from 'react-bootstrap';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChapterPageDTO } from '../../interface/Chapter/ChapterPageDTO';
import '../../style/course/CourseContent.css';


export default function ChapterContent(chapter: ChapterPageDTO) {
    const content = chapter.chapter_content || "";
    return (
        <Container className="course-content">
            <Row>
                <h2>課程內容</h2>
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