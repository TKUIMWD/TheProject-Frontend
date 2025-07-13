import { Col, Container, Row } from 'react-bootstrap';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChapterPageDTO } from '../../interface/Chpater/ChapterPageDTO';
import '../../style/course/CourseContent.css';


export default function ChapterContent(chapter: ChapterPageDTO) {
    const content = chapter.chapter_content || "";
    return (
        <Container className="course-content">
            <Row>
                <Col lg={10}>
                    <h2>課程內容</h2>
                    <hr />
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