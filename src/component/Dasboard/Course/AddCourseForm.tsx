import { MouseEvent } from "react";
import { Container, Row, Col, Button, DropdownButton, Tabs, Tab, Dropdown, Form } from "react-bootstrap";
import { Course } from "../../../interface/Course/Course";
import Markdown from "react-markdown";
import "../../../style/dashboard/AddCourse.css";

interface AddCourseFormProps {
    courseData?: Course;
    onCourseChange: (courseData: Course) => void;
    handleTabChange: ( key: "prev" | "next") => void;
    onTemporarySave: () => void;
}

export default function AddCourseForm({ courseData, handleTabChange, onTemporarySave, onCourseChange }: AddCourseFormProps) {
    const difficultyOptions = ["Easy", "Medium", "Hard"];
    const daysOptions: number[] = [0, 1, 2, 3, 4, 5, 10, 20];
    const hoursOptions: number[] = [0, 1, 2, 3, 4, 5, 10, 20];
    const minutesOptions: number[] = [0, 10, 20, 30, 40, 50];

    function totalTimeInMinutes(d: number, h: number, m: number): number {
        return d * 24 * 60 + h * 60 + m;
    }

    function handleSave(e: MouseEvent<HTMLButtonElement>): Promise<void> {
        e.preventDefault();
        onTemporarySave();
        return Promise.resolve();
    }

    const handleFieldChange = (field: keyof Course, value: any) => {
        const currentData = courseData || { course_name: '', course_subtitle: '', course_description: '', duration_in_minutes: 0, difficulty: 'Easy', class_ids: [] };
        onCourseChange({
            ...currentData,
            [field]: value,
        });
    };

    const handleTimeChange = (type: 'days' | 'hours' | 'minutes', value: number) => {
        const d = type === 'days' ? value : Math.floor((courseData?.duration_in_minutes || 0) / 1440);
        const h = type === 'hours' ? value : Math.floor(((courseData?.duration_in_minutes || 0) % 1440) / 60);
        const m = type === 'minutes' ? value : (courseData?.duration_in_minutes || 0) % 60;
        handleFieldChange('duration_in_minutes', totalTimeInMinutes(d, h, m));
    };

    const currentDays = Math.floor((courseData?.duration_in_minutes || 0) / 1440);
    const currentHours = Math.floor(((courseData?.duration_in_minutes || 0) % 1440) / 60);
    const currentMinutes = (courseData?.duration_in_minutes || 0) % 60;

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
                        <input type="text"
                            className="form-control"
                            placeholder="請輸入課程標題"
                            value={courseData?.course_name || ''}
                            onChange={(e) => handleFieldChange('course_name', e.target.value)}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col lg={2}>
                        <p className="font-weight-bold">副標題</p>
                    </Col>
                    <Col lg={9}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="請輸入課程副標題"
                            value={courseData?.course_subtitle || ''}
                            onChange={(e) => handleFieldChange('course_subtitle', e.target.value)}
                        />
                    </Col>
                </Row>
                <Row className="mb-3 align-items-center">
                    <Col lg={2}>
                        <p className="font-weight-bold mb-0">進行時間</p>
                    </Col>
                    <Col lg={10}>
                        <Row className="align-items-center">
                            <Col md={1}>
                                <DropdownButton
                                    id="days-dropdown"
                                    variant="outline-secondary"
                                    title={currentDays}
                                    onSelect={(key) => handleTimeChange('days', Number(key))}
                                >
                                    {daysOptions.map((option) => <Dropdown.Item key={option} eventKey={option}>{option}</Dropdown.Item>)}
                                </DropdownButton>
                            </Col>
                            <Col md={1} className="text-center p-0">天</Col>
                            <Col md={1}>
                                <DropdownButton
                                    id="hours-dropdown"
                                    variant="outline-secondary"
                                    title={currentHours}
                                    onSelect={(key) => handleTimeChange('hours', Number(key))}
                                >
                                    {hoursOptions.map((option) => <Dropdown.Item key={option} eventKey={option}>{option}</Dropdown.Item>)}
                                </DropdownButton>
                            </Col>
                            <Col md={1} className="text-center p-0">小時</Col>
                            <Col md={1}>
                                <DropdownButton
                                    id="minutes-dropdown"
                                    variant="outline-secondary"
                                    title={currentMinutes}
                                    onSelect={(key) => handleTimeChange('minutes', Number(key))}
                                >
                                    {minutesOptions.map((option) => <Dropdown.Item key={option} eventKey={option}>{option}</Dropdown.Item>)}
                                </DropdownButton>
                            </Col>
                            <Col md={1} className="text-center p-0">分鐘</Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col lg={2}>
                        <p className="font-weight-bold">難易度</p>
                    </Col>
                    <Col lg={9}>
                        <DropdownButton
                            id="difficulty-dropdown"
                            variant="light"
                            title={courseData?.difficulty || 'Easy'}
                            onSelect={(key) => handleFieldChange('difficulty', key)}
                        >
                            {difficultyOptions.map((option) => <Dropdown.Item key={option} eventKey={option}>{option}</Dropdown.Item>)}
                        </DropdownButton>
                    </Col>
                </Row>
                <Row>
                    <Col lg={2}>
                        <p className="font-weight-bold">簡介</p>
                    </Col>
                    <Col lg={9}>
                        <Tabs defaultActiveKey="edit">
                            <Tab eventKey="edit" title="編輯">
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    placeholder="請輸入課程簡介"
                                    value={courseData?.course_description || ''}
                                    onChange={(e) => handleFieldChange('course_description', e.target.value)}
                                />
                            </Tab>
                            <Tab eventKey="preview" title="預覽">
                                <Markdown>
                                    {courseData?.course_description || ''}
                                </Markdown>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col lg={5} className="d-flex gap-3">
                        <Button variant="success" onClick={handleSave}>儲存課程資訊</Button>
                        <Button variant="secondary" onClick={() => handleTabChange("next")}>下一步</Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}