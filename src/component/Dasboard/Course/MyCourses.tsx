import { useState, useMemo, useEffect } from "react";
import { Col, Container, Dropdown, DropdownButton, Form, InputGroup, Pagination, Row, Table } from "react-bootstrap";
import { asyncGet } from "../../../utils/fetch";
import { user_api } from "../../../enum/api";
import { CourseInfo } from "../../../interface/Course/Course";
import { useNavigate } from "react-router-dom";
import '../../../style/dashboard/MyCourses.css';
import Loading from "../../Loading";

export default function MyCourses() {
    const navigate = useNavigate();
    const COURSE_IMAGE_URL = "src/assets/images/Dashboard/course_image.jpg";
    const [dropdownTitle, setDropdownTitle] = useState("更新時間（由新到舊）");
    const [searchQuery, setSearchQuery] = useState("");
    const [courses, setCourses] = useState<CourseInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                console.log("開始載入課程資料...");

                const response = await asyncGet(user_api.getUserCourses, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                console.log("API 回應:", response);

                if (response && response.code === 200) {
                    setCourses(response.body);
                    console.log("課程資料載入成功:", response.body);
                } else {
                    console.error("載入課程失敗:", response.message);
                    setCourses([]);
                }
            } catch (error) {
                console.error("載入課程時發生錯誤:", error);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const minute_to_hour = (minutes: number) => {
        const hours = minutes / 60;
        return `${hours.toFixed(1)} hr`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredAndSortedCourses = useMemo(() => {
        let filtered = courses.filter(course =>
            course.course_name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        switch (dropdownTitle) {
            case "更新時間（由舊到新）":
                filtered.sort((a, b) => new Date(a.update_date).getTime() - new Date(b.update_date).getTime());
                break;
            case "評價（由高到低）":
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case "評價（由低到高）":
                filtered.sort((a, b) => a.rating - b.rating);
                break;
            case "更新時間（由新到舊）":
            default:
                filtered.sort((a, b) => new Date(b.update_date).getTime() - new Date(a.update_date).getTime());
                break;
        }
        return filtered;
    }, [courses, searchQuery, dropdownTitle]);

    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredAndSortedCourses.length / itemsPerPage);
    const startIndex = (activePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredAndSortedCourses.slice(startIndex, endIndex);

    const items = [];
    for (let number = 1; number <= totalPages; number++) {
        items.push(
            <Pagination.Item
                key={number}
                active={number === activePage}
                onClick={() => setActivePage(number)}
            >
                {number}
            </Pagination.Item>,
        );
    }

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <Container className="my-courses-container">
            <Row>
                <h3>我的課程</h3>
                <hr />
            </Row>

            <Row>
                <Col lg={9}>
                    <InputGroup className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="搜尋課程"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col lg={3}>
                    <DropdownButton
                        variant="outline-secondary"
                        title={dropdownTitle}
                        id="input-group-dropdown-2"
                        onSelect={(eventKey) => setDropdownTitle(eventKey || "更新時間（由新到舊）")}
                    >
                        <Dropdown.Item eventKey="更新時間（由新到舊）">更新時間（由新到舊）</Dropdown.Item>
                        <Dropdown.Item eventKey="更新時間（由舊到新）">更新時間（由舊到新）</Dropdown.Item>
                        <Dropdown.Item eventKey="評價（由高到低）">評價（由高到低）</Dropdown.Item>
                        <Dropdown.Item eventKey="評價（由低到高）">評價（由低到高）</Dropdown.Item>
                    </DropdownButton>
                </Col>
            </Row>

            <Table hover>
                <thead>
                    <tr>
                        <th>課程</th>
                        <th>評價</th>
                        <th>更新時間</th>
                        <th>教師</th>
                    </tr>
                </thead>
                <tbody >
                    {currentItems.map((course) => (
                        <tr
                            className="align-middle course-row"
                            onClick={() => { navigate(`../courses/${course._id}`) }}
                        >
                            <td>
                                <Container className="course-info">
                                    <Row>
                                        <Col lg={3}>
                                            <img src={COURSE_IMAGE_URL} alt="course-image" className="course-image" />
                                        </Col>
                                        <Col lg={9}>
                                            <h5>{course.course_name}</h5>
                                            <p className="text-muted mb-0">
                                                <span className="me-3">
                                                    <i className="bi bi-clock"></i> {minute_to_hour(course.duration_in_minutes)}
                                                </span>
                                                <i className="bi bi-bar-chart-fill"></i> {course.difficulty}
                                            </p>
                                        </Col>
                                    </Row>
                                </Container>
                            </td>
                            <td>{course.rating.toFixed(1)} <i className="bi bi-star-fill text-warning"></i></td>
                            <td>{formatDate(course.update_date)}</td>
                            <td>{course.teacher_name}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {currentItems.length === 0 && (
                <div className="text-center p-5">
                    <h4>沒有找到課程資料</h4>
                </div>
            )}

            <div className="pagination-container">
                <Pagination>
                    {items}
                </Pagination>
            </div>
        </Container>
    );
}