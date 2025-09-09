import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import { CoursePageDTO } from "../../interface/Course/CoursePageDTO";
import { CourseContentProps } from "../../interface/Course/CourseContentProps";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import '../../style/course/CourseContent.css';
import CourseMenu from "./CourseMenu";
import { ClassMap } from "../../interface/Course/Maps";


function CourseOverview( { CourseContentProps }: { CourseContentProps: CourseContentProps }) {
    
    const { description, duration, difficulty, rating } = CourseContentProps;

    const formatDuration = (duration: number): string => {
        const hours: number = Math.floor(duration / 60);
        const days: number = Math.floor(hours / 24);
        if (days === 0) {
            return `${hours} hr`;
        }else {
            return `${days}d ${hours % 24} hr`
        }
    };

    const formatRating = (rating: number): string => {
        return rating.toFixed(1);
    };

    return (
        <Container className="tab-pane-content">
            <Row>
                <Col>
                    <div className="d-flex align-items-center gap-3">
                        <span className="course-meta"><i className="bi bi-clock" /> {formatDuration(duration)}</span>
                        <span className="course-meta"><i className="bi bi-bar-chart-fill" /> {difficulty}</span>
                        <span className="course-meta"><i className="bi bi-star-fill" style={{ color: '#77AAAD' }} /> {formatRating(rating)}</span>
                    </div>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <h5><b>課程概述</b></h5>
                    <p className="text-muted">{description && description.length > 0 ? (
                        <Markdown remarkPlugins={[remarkGfm]}>{description}</Markdown>
                    ) : (
                        "這個課程目前沒有描述。"
                    )}</p>
                </Col>
            </Row>
        </Container>
    );
}

function CourseReview({ CourseContentProps }: { CourseContentProps: CourseContentProps }) {
    return (
        <Container className="tab-pane-content">
            <Row>
                <Col lg={10}>
                    <h5><b>評論</b></h5>
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
    );
}

export default function CourseContent({ courseData, class_titles, isEnrolled, showJoinCourseModal }: { courseData: CoursePageDTO, class_titles: ClassMap[], isEnrolled: boolean, showJoinCourseModal: () => void }) {

    const CourseContentProps = {
        duration: courseData.course_duration_in_minutes,
        difficulty: courseData.course_difficulty,
        rating: courseData.course_rating,
        description: courseData.course_description,
        review: courseData.course_reviews
    }

    return (
        <>
            <Container className="content">
                <Tabs
                    defaultActiveKey={"course-description"}
                    fill
                >
                    <Tab eventKey="course-description" title="課程概述">
                        <CourseOverview CourseContentProps={CourseContentProps} />
                    </Tab>
                    <Tab eventKey="course-menu" title="目錄">
                        <CourseMenu
                            class_titles={class_titles}
                            isEnrolled={isEnrolled}
                            showJoinCourseModal={showJoinCourseModal}
                        />
                    </Tab>
                    <Tab eventKey="course-review" title="評論">
                        <CourseReview CourseContentProps={CourseContentProps} />
                    </Tab>
                </Tabs>
            </Container>
        </>
    );
}
