import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { Dispatch, SetStateAction, useState } from 'react';
import '../../style/dashboard/DashboardMenu.css';
import { useNavigate } from 'react-router-dom';
import { MenuGroup } from '../../interface/Dashboard/DashboardMenu';

interface DashboardMenuProps {
    menuConfig: MenuGroup[];
    activeKey: string;
    setActiveKey: Dispatch<SetStateAction<string>>;
    role: "user" | "admin" | "superadmin";
    collapse: boolean;
    handleMenuCollapse: () => void;
}

export default function DashboardMenu({ menuConfig, activeKey, setActiveKey, role, collapse, handleMenuCollapse }: DashboardMenuProps) {
    const navigate = useNavigate();
    
    const handleItemClick = (key: string) => {
        setActiveKey(key);
        navigate(`?tab=${key}`);
    };
    
    

    return (
        <>
            {!collapse ? (
            <div className="dashboard-menu">
                <ListGroup>
                    {/* 4. 使用巢狀迴圈來動態產生整個選單 */}
                    {menuConfig.map((group) => {
                        // 過濾出該用戶角色可見的項目
                        const visibleItems = group.items.filter(item =>
                            item.roles.includes(role)
                        );

                        // 如果過濾後該群組沒有任何項目，則不渲染該群組
                        if (visibleItems.length === 0) {
                            return null;
                        }

                        return (
                            <Container key={group.title} className="menu-group mb-3">
                                <Row className='align-items-center menu-group-header'>
                                    <Col lg={10}>
                                        <h5 className="menu-group-title">{group.title}</h5>
                                    </Col>
                                    {menuConfig[0].title === group.title && (
                                        <Col lg={2}>
                                            <Button variant="outline-secondary" onClick={handleMenuCollapse}>
                                                <i className="bi bi-list"></i>
                                            </Button>
                                        </Col>
                                    )}
                                </Row>
                                {
                                    visibleItems.map((item) => (
                                        <ListGroup.Item
                                            key={item.key}
                                            className="dashboard-menu-item"
                                            action
                                            active={activeKey === item.key}
                                            onClick={() => handleItemClick(item.key)}
                                        >
                                            {item.label}
                                        </ListGroup.Item>
                                    ))
                                }
                            </Container>
                        );
                    })}
                </ListGroup>
            </div>
        ):(
            <div className="dashboard-menu-collapsed">
                <Button variant="outline-secondary" onClick={() => handleMenuCollapse()}>
                    <i className="bi bi-list"></i>
                </Button>
            </div>
        )}
        </>
    );
}