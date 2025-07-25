import { useState } from "react";
import { Button, Col, Container, Dropdown, DropdownButton, Row, Tab, Tabs } from "react-bootstrap";
import { Course } from "../../interface/Course/Course";
import Markdown from "react-markdown";
import '../../style/dashboard/AddCourse.css';

interface AddCourseFormProps {
    handleTabChange: (key: "prev" | "next") => void;
}

export default function AddCourseForm({ handleTabChange }: AddCourseFormProps) {
    const [course, setCourse] = useState<Course | null>();
    const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
    const [hours, setHours] = useState<string>("0 小時");
    const [minutes, setMinutes] = useState<string>("0 分鐘");
    const [descriptionText, setDescirptionText] = useState<string>("");

    const difficultyOptions = ["Easy", "Medium", "Hard"];
    const hoursOptions = [];
    const minutesOptions = [];
    for (let i = 0; i <= 6; i++) {
        hoursOptions.push(i === 6 ? `${i - 1} 小時以上` : `${i} 小時`);
    }

    minutesOptions.push("0 分鐘");
    for (let i = 10; i <= 50; i += 10) {
        minutesOptions.push(`${i} 分鐘`);
    }

    return (
        <>
           
            <Container className="add-course-container">
                <Row>
                    <h5>課程資訊</h5>
                </Row>
                <Row>
                    <Col lg={2}>
                        <p className="font-weight-bold">標題</p>
                    </Col>
                    <Col lg={9}>
                        <input type="text" className="form-control" placeholder="請輸入課程標題" />
                    </Col>
                </Row>
                <Row>
                    <Col lg={2}>
                        <p className="font-weight-bold">副標題</p>
                    </Col>
                    <Col lg={9}>
                        <input type="text" className="form-control" placeholder="請輸入課程副標題" />
                    </Col>
                </Row>
                <Row>
                    <Col lg={2}>
                        <p className="font-weight-bold">進行時間</p>
                    </Col>
                    <Col lg={2}>
                        <DropdownButton
                            id="hours-dropdown"
                            variant="light"
                            title={hours}
                            onSelect={(eventKey) => eventKey && setHours(eventKey)}
                        >
                            {hoursOptions.map((option, index) => (
                                <Dropdown.Item key={index} eventKey={option}>
                                    {option}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </Col>
                    <Col lg={2}>
                        <DropdownButton
                            id="minutes-dropdown"
                            variant="light"
                            title={minutes}
                            onSelect={(eventKey) => eventKey && setMinutes(eventKey)}
                        >
                            {minutesOptions.map((option, index) => (
                                <Dropdown.Item key={index} eventKey={option}>
                                    {option}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </Col>
                </Row>
                <Row>
                    <Col lg={2}>
                        <p className="font-weight-bold">難易度</p>
                    </Col>
                    <Col lg={9}>
                        <DropdownButton
                            id="difficutly-dropdown"
                            variant="light"
                            title={difficulty}
                            onSelect={(eventKey) => eventKey && setDifficulty(eventKey as "Easy" | "Medium" | "Hard")}
                        >
                            {difficultyOptions.map((option, index) => (
                                <Dropdown.Item key={index} eventKey={option}>
                                    {option}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </Col>
                </Row>
                <Row>
                    <Col lg={2}>
                        <p className="font-weight-bold">簡介</p>
                    </Col>
                    <Col lg={9}>
                        <Tabs
                            defaultActiveKey="edit"
                        >
                            <Tab eventKey="edit" title="編輯">
                                <textarea
                                    className="form-control"
                                    rows={10}
                                    placeholder="請輸入課程簡介 支援 Markdown 形式編輯"
                                    onChange={(e) => setDescirptionText(e.target.value)}
                                >
                                </textarea>
                            </Tab>
                            <Tab eventKey="preview" title="預覽">
                                <div className="form-control preview-area">
                                    <Markdown>{descriptionText ? descriptionText : "預覽畫面"}</Markdown>
                                </div>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col lg={5} className="d-flex gap-3">
                        <Button variant="success">儲存</Button>
                        <Button variant="secondary" onClick={() => handleTabChange("next")}>下頁</Button>
                    </Col>
                </Row>
            </Container>

        </>
    );
}