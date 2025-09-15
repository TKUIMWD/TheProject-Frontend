import { useState, useMemo, useEffect, MouseEvent } from "react";
import { Button, Col, Container, Dropdown, DropdownButton, Form, InputGroup, ListGroup, Modal, Pagination, Row, Tab, Table, Tabs } from "react-bootstrap";
import { asyncDelete, asyncGet, asyncPost } from "../../../utils/fetch";
import { course_api, user_api } from "../../../enum/api";
import { CourseInfo } from "../../../interface/Course/Course";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastProvider";
import { getOptions } from "../../../utils/token";
import '../../../style/dashboard/MyCourses.css';
import '../../../style/dashboard/AdminMyCourse.css';

const COURSE_IMAGE_URL = "/src/assets/images/Dashboard/course_image.jpg";

const STATUS_CONFIG: Record<string, { color: string }> = {
    "公開": { color: "#28A745" },
    "未公開": { color: "#6C757D" },
    "編輯中": { color: "#FF9500" },
    "審核中": { color: "#0772FFFF" },
    "審核未通過": { color: "#D21D1D" },
};

const TABS_CONFIG = [
    { eventKey: "all", title: "所有課程", status: null },
    { eventKey: "public", title: "公開", status: "公開" },
    { eventKey: "unpublished", title: "未公開", status: "未公開" },
    { eventKey: "edit", title: "編輯中", status: "編輯中" },
    { eventKey: "audit", title: "審核中", status: "審核中" },
    { eventKey: "failed", title: "審核未通過", status: "審核未通過" },
];

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

export default function AdminMyCourses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<CourseInfo[]>([]);
    const [loading, setLoading] = useState(false);

    const [dropdownTitle, setDropdownTitle] = useState("更新時間（由新到舊）");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState('all');
    const [activePage, setActivePage] = useState(1);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [currentEmail, setCurrentEmail] = useState(""); // 用於當前輸入框
    const [emailList, setEmailList] = useState<string[]>([]); // 用於儲存待邀請列表
    const [isInviting, setIsInviting] = useState(false); // 控制邀請按鈕狀態
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

    const { showToast } = useToast();

    useEffect(() => {
        const fetchUserCourses = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');;

            if (!token) {
                showToast("請先登入", "danger");
                setLoading(false);
                return;
            }

            try {
                const headers = { "Authorization": `Bearer ${token}` };
                const response = await asyncGet(user_api.getUserCourses, { headers });

                if (response.code === 200 && response.body) {
                    setCourses(response.body);
                    console.log("收到的課程物件:", response.body);
                } else {
                    showToast(response.message || "無法獲取課程資料", "danger");
                    throw new Error(response.message || "無法獲取課程資料");
                }
            } catch (error: any) {
                console.error("AdminMyCourse: 獲取課程時發生錯誤", error);
                showToast(error.message || "獲取課程失敗", "danger");
            } finally {
                setLoading(false);
            }
        };

        fetchUserCourses();
    }, []);

    // 處理篩選條件變更時，重置回第一頁
    useEffect(() => {
        setActivePage(1);
    }, [activeTab, searchQuery, dropdownTitle]);

    // 處理搜尋和排序邏輯
    const filteredAndSortedCourses = useMemo(() => {
        const courseStatus = TABS_CONFIG.find(tab => tab.eventKey === activeTab)?.status;
        let filtered = courses;

        if (courseStatus) {
            filtered = filtered.filter(course => course.status === courseStatus);
        }

        if (searchQuery) {
            filtered = filtered.filter(course =>
                course.course_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

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
    }, [courses, activeTab, searchQuery, dropdownTitle]);

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
            <Container className="my-courses-container">
                <div className="text-center p-5">
                    <h4>載入中...</h4>
                </div>
            </Container>
        );
    }

    function handlePublicCourse(e: MouseEvent<HTMLElement>): void {
        e.stopPropagation();
        const row = (e.currentTarget as HTMLElement).closest('tr');
        const courseId = row?.getAttribute('id');
        if (!courseId) return;

        const course = courses.find(c => c._id === courseId);
        if (!course) return;

        // Toggle public status
        const newStatus = course.status === "公開" ? "未公開" : "公開";
        setCourses(prevCourses =>
            prevCourses.map(c => c._id === courseId ? { ...c, status: newStatus } : c)
        );

        // todo
    };

    function handleDeleteCourse(e: MouseEvent<HTMLElement>): void {
        e.stopPropagation();
        const comfirmDelete = confirm("確定要刪除這個課程嗎？");
        if (!comfirmDelete) return;

        try {
            const row = (e.currentTarget as HTMLElement).closest('tr');
            const courseId = row?.getAttribute('id');
            if (!courseId) return;

            const options = getOptions();
            const body = {};
            asyncDelete(course_api.deleteCourseById(courseId), body, options)
                .then((res) => {
                    if (res.code === 200) {
                        showToast("課程刪除成功", "success");
                        setCourses(prevCourses => prevCourses.filter(c => c._id !== courseId));
                    } else {
                        throw new Error(res.message || "刪除課程失敗");
                    }
                })
                .catch((error) => {
                    showToast(error.message || "刪除課程失敗", "danger");
                    console.error("刪除課程失敗:", error);
                });

        } catch (error: any) {
            showToast(error.message || "刪除課程失敗", "danger");
            return;
        }
    }

    function handleAuditCourse(e: MouseEvent<HTMLElement>): void {
        e.stopPropagation();
        // todo
    }

    function handleShowInviteModal(e: MouseEvent<HTMLElement>, courseId:string): void {
        e.stopPropagation();
        setSelectedCourseId(courseId);
        setShowInviteModal(true);
    }

    function handleCloseInviteModal(): void {
        setCurrentEmail("");
        setEmailList([]);
        setShowInviteModal(false);
        setSelectedCourseId(null);
    }

    function handleAddEmail() {
        const trimmedEmail = currentEmail.trim();
        if (!trimmedEmail) {
            showToast("請輸入 Email", "warning");
            return;
        }
        // 簡單的 email 格式驗證
        if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
            showToast("Email 格式不正確", "danger");
            return;
        }
        if (emailList.includes(trimmedEmail)) {
            showToast("此 Email 已在列表中", "info");
            return;
        }
        // 將 email push 到 string array
        setEmailList([...emailList, trimmedEmail]);
        setCurrentEmail(""); // 清空輸入框
    }

    function handleRemoveEmail(indexToRemove: number) {
        setEmailList(emailList.filter((_, index) => index !== indexToRemove));
    }

    function handleInvite(): void {
        if (emailList.length === 0) {
            showToast("邀請列表是空的，請先新增 Email", "warning");
            return;
        }

        if (!selectedCourseId) {
            showToast("未選擇課程", "danger");
            return;
        }

        setIsInviting(true);

        try {
            const options = getOptions();
            const body = {
                course_id: selectedCourseId,
                emails: emailList
            };
            console.log("邀請使用者到課程 ID:", selectedCourseId);
            asyncPost(course_api.InviteToJoinCourse, body, options)
                .then((res) => {
                    if (res.code === 200) {
                        showToast("邀請已發送", "success");
                    } else {
                        throw new Error(res.message || "邀請失敗");
                    }
                })
                .catch((error) => {
                    showToast(error.message || "邀請失敗", "danger");
                    console.error("邀請失敗:", error);
                });
        } catch (error: any) {
            showToast(error.message || "邀請失敗", "danger");
            console.error("邀請失敗:", error);
            return;
        } finally {
            setIsInviting(false);
            handleCloseInviteModal();
        }
    }

    return (
        <>
            <h3>我的課程</h3>
            <hr />
            <Container className="my-courses-container">
                <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k || 'all')}
                    id="course-status-tabs"
                    className="mb-3"
                    fill
                >
                    {TABS_CONFIG.map(tab => (
                        <Tab key={tab.eventKey} eventKey={tab.eventKey} title={tab.title} />
                    ))}
                </Tabs>

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
                            <th>狀態</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((course) => (
                            <tr key={course._id} id={course._id} className="align-middle course-row" onClick={() => navigate(`../courses/${course._id}`)}>
                                <td>
                                    <Container className="course-info">
                                        <Row>
                                            <Col lg={4}>
                                                <img src={COURSE_IMAGE_URL} alt={course.course_name} className="course-image" />
                                            </Col>
                                            <Col lg={8}>
                                                <h5>{course.course_name}</h5>
                                                <p className="text-muted mb-0">
                                                    <span className="me-3"><i className="bi bi-clock"></i> {minute_to_hour(course.duration_in_minutes)}</span>
                                                    <i className="bi bi-bar-chart-fill"></i> {course.difficulty}
                                                </p>
                                            </Col>
                                        </Row>
                                    </Container>
                                </td>
                                <td>{course.rating.toFixed(1)} <i className="bi bi-star-fill text-warning"></i></td>
                                <td>{formatDate(course.update_date)}</td>
                                <td><span><i className="bi bi-record-fill" style={{ color: STATUS_CONFIG[course.status as "公開" | "未公開" | "編輯中" | "審核中" | "審核未通過"]?.color }}></i> </span>{course.status}</td>
                                <td>
                                    <Dropdown
                                        onClick={(e) => e.stopPropagation()}
                                        show={openDropdownId === course._id}
                                        onToggle={(isOpen) => {
                                            setOpenDropdownId(isOpen ? course._id : null);
                                            console.log(course._id);
                                        }}
                                    >
                                        <Dropdown.Toggle variant="none" className="course-dropdown">
                                            <i className="bi bi-three-dots-vertical"></i>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => { }}>編輯</Dropdown.Item>
                                            {course.status === "公開" || course.status === "未公開" ?
                                                <Dropdown.Item onClick={(e) => handlePublicCourse(e)}>{course.status === "公開" ? "不公開" : "公開"}</Dropdown.Item>
                                                : null}
                                            {course.status === "編輯中" ?
                                                <Dropdown.Item onClick={(e) => handleAuditCourse(e)}>送出審核</Dropdown.Item>
                                                : null}
                                            <Dropdown.Item onClick={(e) => handleDeleteCourse(e)}>刪除</Dropdown.Item>
                                            {course.status === "公開" && (
                                                <Dropdown.Item onClick={(e) => handleShowInviteModal(e, course._id)}>邀請</Dropdown.Item>
                                            )}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>


                {currentItems.length === 0 && (
                    <div className="text-center p-5">
                        <h4>沒有找到課程資料</h4>
                    </div>
                )}

                <Modal centered show={showInviteModal} onHide={handleCloseInviteModal} backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>邀請使用者</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={(e) => { e.preventDefault(); handleAddEmail(); }}>
                            <Form.Group className="mb-3" controlId="inviteEmail">
                                <Form.Label>輸入要邀請的使用者 Email</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="email"
                                        placeholder="example@email.com"
                                        value={currentEmail}
                                        onChange={e => setCurrentEmail(e.target.value)}
                                        disabled={isInviting}
                                    />
                                    <Button variant="outline-secondary" onClick={handleAddEmail} disabled={isInviting}>
                                        新增
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                        </Form>

                        {emailList.length > 0 && (
                            <>
                                <hr />
                                <p className="text-muted">待邀請列表 ({emailList.length})</p>
                                <ListGroup variant="flush" style={{ maxHeight: '200px', overflowY: 'auto' }} as="ol" numbered>
                                    {emailList.map((email, index) => (
                                        <ListGroup.Item
                                            key={index}
                                            className="d-flex justify-content-between align-items-center"
                                        >
                                            {email}
                                            <Button
                                                variant="link"
                                                className="text-danger p-0"
                                                onClick={() => handleRemoveEmail(index)}
                                                disabled={isInviting}
                                                title="移除"
                                            >
                                                <i className="bi bi-x-circle"></i>
                                            </Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseInviteModal} disabled={isInviting}>
                            取消
                        </Button>
                        <Button
                            className="btn-custom btn-light-blue"
                            onClick={() => handleInvite()}
                            disabled={isInviting || emailList.length === 0}
                        >
                            {isInviting ? '發送中...' : `發送 ${emailList.length} 封邀請`}
                        </Button>
                    </Modal.Footer>
                </Modal>

                <div className="pagination-container">
                    <Pagination>
                        {items}
                    </Pagination>
                </div>

            </Container>
        </>
    );
}