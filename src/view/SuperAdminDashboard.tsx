import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import logout from "../utils/logout";
import { useToast } from "../context/ToastProvider";
import { MenuGroup } from "../interface/Dashboard/DashboardMenu";
import AllMechine from "../component/SuperAdminDashboard/VM/AllVM";
import SuperAdminNav from "../component/SuperAdminDashboard/SuperAdminNav";
import "../style/superAdmin/SuperAdminDashboard.css";
import AllUsers from "../component/SuperAdminDashboard/Account/AllUsers";
import AllAdmins from "../component/SuperAdminDashboard/Account/AllAdmins";
import AllTemplates from "../component/SuperAdminDashboard/Template/AllTemplate";
import TemplateAudit from "../component/SuperAdminDashboard/Template/TemplateAudit";
import BoxAudit from "../component/SuperAdminDashboard/Box/BoxAudit";
import AllCourse from "../component/SuperAdminDashboard/Course/AllCourse";
import AuditCourse from "../component/SuperAdminDashboard/Course/AuditCourse";

const menuConfig: MenuGroup[] = [
    {
        title: "帳號管理",
        items: [
            { key: "UserManagement", label: "用戶總覽", component: <AllUsers />, roles: ["superadmin"] },
            { key: "AdminManagement", label: "教師總覽", component: <AllAdmins />, roles: ["superadmin"] },
        ]
    },
    {
        title: "課程管理",
        items: [
            { key: "CourseManagement", label: "課程總覽", component: <AllCourse />, roles: ["superadmin"] },
            { key: "AuditCourse", label: "課程審核", component: <AuditCourse />, roles: ["superadmin"] },
        ]
    },
    {
        title: "機器管理",
        items: [
            { key: "MachineManagement", label: "機器總覽", component: <AllMechine />, roles: ["superadmin"] }
        ]
    },
    {
        title: "範本管理",
        items: [
            { key: "TemplateManagement", label: "範本總覽", component: <AllTemplates />, roles: ["superadmin"] },
            { key: "TemplateReview", label: "範本審核", component: <TemplateAudit />, roles: ["superadmin"] }
        ]
    },
    {
        title: "Box 管理",
        items: [
            { key: "AuditBox", label: "Box 審核", component: <BoxAudit />, roles: ["superadmin"] },
        ]
    },
];

export default function SuperAdminDashboard() {
    const [searchParams, setSearchParams] = useSearchParams();
    let initialTab = searchParams.get('tab') || 'Profile';
    const [activeKey, setActiveKey] = useState<string>(initialTab);
    const [navCollapsed, setNavCollapsed] = useState<boolean>(true);

    const getUsername = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                return decoded.username || decoded.name || null;
            } catch {
                return null;
            }
        }
        return null;
    };
    const username = getUsername();

    const { showToast } = useToast();

    const handleLogout = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        await logout(showToast);
    };

    const handleNavCollapsed = () => {
        setNavCollapsed(!navCollapsed);
    }

    const handleSelect = (key: string) => {
        setActiveKey(key);
        setSearchParams({ tab: key });
    };

    // 根據 activeKey 找到要顯示的元件
    const activeComponent = menuConfig
        .flatMap(group => group.items)
        .find(item => item.key === activeKey)?.component || <div>請從左側選單選擇一個項目</div>;

    return (
        <>
            <Container className="super-admin-dashboard" fluid>
                <Row>
                    {navCollapsed && (
                        <Col lg={2}>
                            <SuperAdminNav
                                menuConfig={menuConfig}
                                activeKey={activeKey}
                                onSelect={handleSelect}
                                navCollapsed={navCollapsed}
                            />
                        </Col>
                    )}
                    <Col lg={navCollapsed ? 10 : 12}>
                        <Container fluid>
                            <Row>
                                <Col className="d-flex justify-content-between align-items-center">
                                    <Button
                                        variant="none"
                                        className="ms-2 menu-collapse-button"
                                        onClick={() => handleNavCollapsed()}
                                        style={{ backgroundColor: 'transparent', border: 'none' }}
                                    >
                                        <h2>
                                            <i className="bi bi-list" />
                                        </h2>
                                    </Button>

                                    <Dropdown>
                                        <Dropdown.Toggle
                                            variant="outline-light"
                                            size="lg"
                                            className="user-dropdown-toggle"
                                        >
                                            <i className="bi bi-person-circle" style={{ fontSize: '2rem' }}></i>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu align="end">
                                            <Dropdown.Header>Hi, {username}</Dropdown.Header>
                                            <Dropdown.Item onClick={handleLogout}><span style={{ color: 'red' }}>登出</span></Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {activeComponent}
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </>
    );
}