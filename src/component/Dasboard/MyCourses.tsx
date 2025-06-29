import { useState } from "react";
import { Col, Container, Dropdown, DropdownButton, Form, InputGroup, Row, Table } from "react-bootstrap";
import '../../style/dashboard/MyCourses.css';

export default function MyCourses() {
    const [dropdownTitle, setDropdownTitle] = useState("更新時間（由新到舊");
    const [searchQuery, setSearchQuery] = useState("");

    function handleSearch(event: React.FormEvent) {
        
    }

    const course = {
        id: 1,
        title: "資訊安全基礎課程",
        imageUrl: "src/assets/images/Dashboard/course_image.jpg",
        time: "1.5 hr",
        rank: "Easy",
        rating: 4.6,
        updateTime: "2025/07/01",
        teacher: "張博士"
    }

    const courseInfo =
        <Container>
            <Row>
                <Col lg={4}>
                    <img src={course.imageUrl} alt="course-image" className="course-image" />
                </Col>
                <Col lg={8}>
                    <h5>{course.title}</h5>
                    <p>
                        <span className="me-3">
                            <i className="bi bi-clock"></i> {course.time}
                        </span>
                        <i className="bi bi-bar-chart-fill"></i> {course.rank}
                    </p>
                </Col>
            </Row>
        </Container>

    return (
        <Container className="my-courses-container">
            <Row>
                <h3>我的課程</h3>
                <hr />
            </Row>
            <Row>
                <Col lg={7}>
                    <InputGroup className="mb-3" onChange={e => handleSearch(e)}>
                        <Form.Control aria-label="Text input with dropdown button" />
                    </InputGroup>
                </Col>
                <Col lg={5}>
                    <DropdownButton
                        variant="outline-secondary"
                        title={dropdownTitle}
                        id="input-group-dropdown-2"
                    >
                        <Dropdown.Item href="#" onClick={() => setDropdownTitle("更新時間（由新到舊")}>更新時間（由新到舊）</Dropdown.Item>
                        <Dropdown.Item href="#" onClick={() => setDropdownTitle("更新時間（由舊到新")}>更新時間（由舊到新）</Dropdown.Item>
                        <Dropdown.Item href="#" onClick={() => setDropdownTitle("評價（由高到低")}>評價（由高到低）</Dropdown.Item>
                        <Dropdown.Item href="#" onClick={() => setDropdownTitle("評價（由低到高")}>評價（由低到高）</Dropdown.Item>
                    </DropdownButton>
                </Col>
            </Row>
            <Table hover >
                <thead>
                    <tr>
                        <th>課程</th>
                        <th>評價</th>
                        <th>更新時間</th>
                        <th>教師</th>
                    </tr>
                </thead>
                <tbody className="align-middle">
                    <tr>
                        <td>{courseInfo}</td>
                        <td>{course.rating} <i className="bi bi-star-fill"></i></td>
                        <td>{course.updateTime}</td>
                        <td>{course.teacher}</td>
                    </tr>
                </tbody>
            </Table>

        </Container>
    );
}