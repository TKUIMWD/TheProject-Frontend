import { useMemo, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { getAuthStatus } from "../utils/token";
import DashboardHeader from "../component/Dasboard/DashboardHeader";
import DashboardMenu from "../component/Dasboard/DashboardMenu";
import Profile from "../component/Dasboard/Profile";
import ChangePassword from "../component/Dasboard/ChangePassword";
import MyCourses from "../component/Dasboard/Course/MyCourses";
import { MenuGroup } from "../interface/Dashboard/DashboardMenu";
import AddCourse from "../component/Dasboard/Course/AddCourse";
import AdminMyCourse from "../component/Dasboard/Course/AdminMyCourse";
import SuperAdminDashboard from "./SuperAdminDashboard";
import TemplateList from "../component/Dasboard/VMTemplateManagement/TemplateList";
import CreateTemplate from "../component/Dasboard/VMTemplateManagement/CreateTemplate";
import VMList from "../component/Dasboard/VM/VMList";
import CreateVM from "../component/Dasboard/VM/CreateVM";
import ComputeResources from "../component/Dasboard/VM/ComputeResources";
import SubmitBox from "../component/Dasboard/Box/SubmitBox";

export default function Dashboard() {
    const [searchParams] = useSearchParams();
    const role = getAuthStatus();
    const menuConfig: MenuGroup[] = [
        {
            title: "帳號管理",
            items: [
                { key: "Profile", label: "個人資訊", component: <Profile />, roles: ["user", "admin", "superadmin"] },
                { key: "ChangePassword", label: "變更密碼", component: <ChangePassword />, roles: ["user", "admin", "superadmin"] },
            ]
        },
        {
            title: "課程管理",
            items: [
                { key: "MyCourses", label: "我的課程", component: role === "user" ? <MyCourses /> : <AdminMyCourse />, roles: ["user", "admin", "superadmin"] },
                { key: "AddCourses", label: "新增課程", component: <AddCourse />, roles: ["admin", "superadmin"] },
            ]
        },
        {
            title: "機器管理",
            items: [
                { key: "ComputeResources", label: "計算資源", component: <ComputeResources />, roles: ["admin", "superadmin"] },
                { key: "VMList", label: "我的機器", component: <VMList />, roles: ["user", "admin", "superadmin"] },
                { key: "CreateVM", label: "新增機器", component: <CreateVM isUpdateMode={false} />, roles: ["admin", "superadmin"] }
            ]
        },
        {
            title: "範本管理",
            items: [
                { key: "TemplateList", label: "範本列表", component: <TemplateList isSelectMode={false} />, roles: ["admin", "superadmin"] },
                { key: "AddTemplate", label: "新增範本", component: <CreateTemplate />, roles: ["admin", "superadmin"] },
            ]
        },
        {
            title: "Box 管理",
            items: [
                { key: "AddBox", label: "提交Box", component: <SubmitBox />, roles: ["admin", "superadmin"] },
            ]
        },
        {
            title: "訂閱資訊",
            items: []
        }
    ];

    if (role === 'notLogon') {
        return (
            <>
                <div className="text-center mt-5">
                    <h2>尚未登入</h2>
                    <p>請登入以訪問頁面。</p>
                </div>
            </>
        );
    }

    if (role === "superadmin") {
        return <SuperAdminDashboard />
    }

    const availableTabs = useMemo(() => {
        const tabs: { [key: string]: JSX.Element } = {};
        menuConfig.forEach(group => {
            group.items.forEach(item => {
                if (item.roles.includes(role)) {
                    tabs[item.key] = item.component;
                }
            });
        });
        return tabs;
    }, [role]);

    let initialTab = searchParams.get('tab') || 'Profile';
    const [activeKey, setActiveKey] = useState(initialTab);

    const [collapse, setColapse] = useState(false);
    const handleMenuCollapse = () => {
        setColapse(!collapse);
    };


    return (
        <Container className="dashboard-container">
            <Row>
                <Col lg={12}>
                    <DashboardHeader />
                </Col>
            </Row>
            <Row>
                <Col lg={!collapse ? 3 : 1} >
                    <DashboardMenu
                        menuConfig={menuConfig}
                        activeKey={activeKey}
                        setActiveKey={setActiveKey}
                        role={role}
                        collapse={collapse}
                        handleMenuCollapse={handleMenuCollapse}
                    />
                </Col>
                <Col lg={!collapse ? 9 : 11}>
                    {availableTabs[activeKey]}
                </Col>
            </Row>
        </Container>
    );
}