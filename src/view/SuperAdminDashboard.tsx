import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import logout from "../utils/logout";
import { useToast } from "../context/ToastProvider";
import { MenuGroup } from "../interface/Dashboard/DashboardMenu";
import AllMechine from "../component/SuperAdminDashboard/VM/AllVM";
import SuperAdminNav from "../component/SuperAdminDashboard/SuperAdminNav";
import DraggableAIContainer from "../component/AIAssistant/DraggableAIContainer";
import "../style/superAdmin/SuperAdminDashboard.css";
import AllUsers from "../component/SuperAdminDashboard/Account/AllUsers";
import AllAdmins from "../component/SuperAdminDashboard/Account/AllAdmins";
import AllTemplates from "../component/SuperAdminDashboard/Template/AllTemplate";
import TemplateAudit from "../component/SuperAdminDashboard/Template/TemplateAudit";
import BoxAudit from "../component/SuperAdminDashboard/Box/BoxAudit";
import AllCourse from "../component/SuperAdminDashboard/Course/AllCourse";
import AuditCourse from "../component/SuperAdminDashboard/Course/AuditCourse";
import 'sakana-widget/lib/index.css';
import SakanaWidget from 'sakana-widget';
import AIAssistantImage from '../assets/AI_assitant.png';

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

    // 追蹤 widget 與容器，確保正確清理
    const sakanaElRef = useRef<HTMLDivElement | null>(null);
    const sakanaWidgetRef = useRef<any>(null);

    // 清理既有 widget 與容器的函數
    const cleanupSakanaWidget = () => {
        try {
            const w = sakanaWidgetRef.current;
            if (w?.unmount) w.unmount();
            if (w?.destroy) w.destroy();
        } catch {}
        const containerId = 'sakana-widget-superadmin';
        const existed = document.getElementById(containerId);
        if (existed && existed.parentNode) {
            existed.parentNode.removeChild(existed);
        }
        sakanaElRef.current = null;
        sakanaWidgetRef.current = null;
    };

    // 載入圖片的輔助函數
    const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

    // 創建容器的函數
    const createWidgetContainer = (): HTMLDivElement => {
        const containerId = 'sakana-widget-superadmin';
        
        // 先移除殘留容器
        const existed = document.getElementById(containerId);
        if (existed && existed.parentNode) {
            existed.parentNode.removeChild(existed);
        }

        // 建立不受 React 管理的容器，避免卸載時 DOM 衝突
        const el = document.createElement('div');
        el.id = containerId;
        el.style.position = 'fixed';
        // el.style.right = '-80px';
        // el.style.bottom = '-60px';
        el.style.zIndex = '1050';
        el.style.width = '360px';
        el.style.height = '360px';
        document.body.appendChild(el);
        sakanaElRef.current = el;
        
        return el;
    };

    // 掛載 Sakana Widget 的函數
    const mountSakanaWidget = async (container: HTMLDivElement) => {
        let widget: any;
        try {
            if ((SakanaWidget as any)?.getCharacter && (SakanaWidget as any)?.registerCharacter) {
                const img = await loadImage(AIAssistantImage);
                // 以容器的最小邊作為正方形尺寸，設定合理上下限
                const minSide = Math.max(120, Math.min(800, Math.min(container.clientWidth || 200, container.clientHeight || 200)));
                const canvas = document.createElement('canvas');
                canvas.width = minSide;
                canvas.height = minSide;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, minSide, minSide);
                    ctx.imageSmoothingQuality = 'high';
                    const scale = Math.min(minSide / img.width, minSide / img.height, 1);
                    const dw = img.width * scale;
                    const dh = img.height * scale;
                    const dx = (minSide - dw) / 2;
                    const dy = (minSide - dh) / 2;
                    ctx.drawImage(img, dx, dy, dw, dh);
                }
                const dataUrl = canvas.toDataURL('image/png');

                const base = (SakanaWidget).getCharacter('takina');
                const custom = { 
                    ...base, 
                    image: dataUrl,
                    initialState: {
                        ...(base?.initialState || {}),
                        d: 1, // 衰减
                        i: 0.0001, // 惯性
                        r: 0, // 角度
                        // s: 0.001, // 粘性
                        // t: -10, // 垂直速度
                        // w: -10, // 水平速度
                        y: 10 // 高度
                    }
                };
                (SakanaWidget as any).registerCharacter('custom', custom);
                widget = new (SakanaWidget)({ character: 'custom', size: minSide, controls: false, rod: false, draggable: true, autoFit: false });
            } else {
                widget = new (SakanaWidget)();
            }
        } catch {
            widget = new (SakanaWidget as any)();
        }

        sakanaWidgetRef.current = widget;
        if (typeof widget.mount === 'function') {
            widget.mount(container);
        } else if (typeof widget === 'function') {
            // 不同版本保底處理
            widget(container);
        }
    };

    // 初始化 Sakana Widget 的主要函數
    const initializeSakanaWidget = async () => {
        // 若沒自訂圖片，清理並跳出
        if (!AIAssistantImage) {
            cleanupSakanaWidget();
            return;
        }

        const container = createWidgetContainer();
        await mountSakanaWidget(container);
    };

    useEffect(() => {
        // 非同步初始化
        initializeSakanaWidget();

        // 清理函式
        return cleanupSakanaWidget;
    }, [AIAssistantImage]);

    return (
        <>
            <DraggableAIContainer />
            
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