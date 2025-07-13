import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import { CoursePageDTO } from "../../interface/Course/CoursePageDTO";
import { CourseContentProps } from "../../interface/Course/CourseContentProps";
import '../../style/course/CourseContent.css';

export default function CourseContent(courseData: CoursePageDTO) {

    const CourseContentPorps: CourseContentProps = {
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
                                <Col lg={10}>
                                    <h2>課程概述</h2>
                                    <p>{CourseContentPorps && CourseContentPorps.description.length > 0? (
                                        CourseContentPorps.description
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
                                <Col lg={10}>
                                    <h2>評論</h2>
                                    {CourseContentPorps && CourseContentPorps.review.length > 0 ? (
                                        <ul className="course-review-list">
                                            {CourseContentPorps.review.map((review, index) => (
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
