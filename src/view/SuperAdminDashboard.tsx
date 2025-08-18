import { Container, Row, Col, Button } from "react-bootstrap";
import SuperAdminNav from "../component/SuperAdminDashboard/SuperAdminNav";
import { MenuGroup } from "../interface/Dashboard/DashboardMenu";
import "../style/superAdmin/SuperAdminDashboard.css"; // 引入樣式
import AllMechine from "../component/SuperAdminDashboard/VM/AllVM";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import VMInfo from "../component/SuperAdminDashboard/VM/VMInfo";

const menuConfig: MenuGroup[] = [
    {
        title: "帳號管理",
        items: [
            { key: "UserManagement", label: "用戶總覽", component: <div>用戶管理內容</div>, roles: ["superadmin"] },
            { key: "AdminManagement", label: "管理員總覽", component: <div>管理員管理內容</div>, roles: ["superadmin"] },
        ]
    },
    {
        title: "課程管理",
        items: [
            { key: "CourseManagement", label: "課程總覽", component: <div>課程管理內容</div>, roles: ["superadmin"] },
        ]
    },
    {
        title: "機器管理",
        items: [
            { key: "MachineManagement", label: "機器總覽", component: <AllMechine />, roles: ["superadmin"] }
        ]
    },
    {
        title: "範本審核",
        items: [
            { key: "TemplateReview", label: "範本審核", component: <div>範本審核內容</div>, roles: ["superadmin"] }
        ]
    }
];

export default function SuperAdminDashboard() {
    const [searchParams, setSearchParams] = useSearchParams();
    let initialTab = searchParams.get('tab') || 'Profile';
    const [activeKey, setActiveKey] = useState<string>(initialTab);
    const [navCollapsed, setNavCollapsed] = useState<boolean>(true);

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
                                <Button
                                    variant="none"
                                    size="lg"
                                    onClick={() => { }}
                                    style={{ backgroundColor: 'transparent', border: 'none' }}
                                >
                                    <h1>
                                        <i className="bi bi-person-circle"></i>
                                    </h1>

                                </Button>
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
    );
}