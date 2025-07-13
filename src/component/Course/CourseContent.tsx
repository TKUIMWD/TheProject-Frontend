import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import { CoursePageDTO } from "../../interface/Course/CoursePageDTO";
import { CourseContentProps } from "../../interface/Course/CourseContentProps";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import '../../style/course/CourseContent.css';

export default function CourseContent(courseData: CoursePageDTO) {

    const CourseContentProps: CourseContentProps = {
        description: courseData.course_description,
        review: courseData.course_reviews
    }

    return (
        <>
            <Container className="course-content">
                <Tabs
                    defaultActiveKey={"course-description"}
                >
                    <Tab eventKey="course-description" title="課程概述">
                        <Container className="course-description-content">
                            <Row>
                                <h2>課程概述</h2>
                                <hr />
                                <Col lg={10}>
                                    <p>{CourseContentProps && CourseContentProps.description.length > 0 ? (
                                        <Markdown remarkPlugins={[remarkGfm]}>{CourseContentProps.description}</Markdown>
                                    ) : (
                                        "這個課程目前沒有描述。"
                                    )}</p>
                                </Col>
                            </Row>
                        </Container>
                    </Tab>
                    <Tab eventKey="course-review" title="評論">
                        <Container className="course-review-content">
                            <Row>
                                <h2>評論</h2>
                                <hr />
                                <Col lg={10}>
                                    {CourseContentProps && CourseContentProps.review.length > 0 ? (
                                        <ul className="course-review-list">
                                            {CourseContentProps.review.map((review, index) => (
                                                <li key={index} className="course-review-item">
                                                    <p>{review}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>目前沒有評論。</p>
                                    )}
                                </Col>
                            </Row>
                        </Container>
                    </Tab>
                </Tabs>
            </Container>
        </>
    );
}
