import { ListGroup } from 'react-bootstrap';
import { Dispatch, SetStateAction } from 'react';
import '../../style/dashboard/DashboardMenu.css';
import { useNavigate } from 'react-router-dom';
import { MenuGroup } from '../../interface/Dashboard/DashboardMenu';

interface DashboardMenuProps {
    menuConfig: MenuGroup[];
    activeKey: string;
    setActiveKey: Dispatch<SetStateAction<string>>;
    role: "user" | "admin" | "superadmin";
}

export default function DashboardMenu({ menuConfig, activeKey, setActiveKey, role }: DashboardMenuProps) {
    const navigate = useNavigate();

    const handleItemClick = (key: string) => {
        setActiveKey(key);
        navigate(`?tab=${key}`);
    };

    return (
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
                        <div key={group.title} className="menu-group">
                            <h5 className="menu-group-title">{group.title}</h5>
                            {visibleItems.map((item) => (
                                <ListGroup.Item
                                    key={item.key}
                                    className="dashboard-menu-item"
                                    action
                                    active={activeKey === item.key}
                                    onClick={() => handleItemClick(item.key)}
                                >
                                    {item.label}
                                </ListGroup.Item>
                            ))}
                        </div>
                    );
                })}
            </ListGroup>
        </div>
    );
}