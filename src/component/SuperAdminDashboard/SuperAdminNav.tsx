import { Collapse, ListGroup } from "react-bootstrap";
import { MenuGroup } from "../../interface/Dashboard/DashboardMenu";
import { useState } from "react";

interface SuperAdminDashboardProps {
    menuConfig: MenuGroup[];
    activeKey: string;
    onSelect: (key: string) => void;
    navCollapsed: boolean;
}

interface NavGroupProps {
    group: MenuGroup;
    activeKey: string;
    onSelect: (key: string) => void;
}

function NavGroup({ group, activeKey, onSelect }: NavGroupProps) {
    const isGroupActive = group.items.some(item => item.key === activeKey);
    const [open, setOpen] = useState(isGroupActive);
    const visibleItems = group.items.filter(item => item.roles.includes("superadmin"));

    if (visibleItems.length === 0) {
        return null;
    }

    return (
        <div className="menu-group mb-2">
            <div
                onClick={() => setOpen(!open)}
                aria-controls={`collapse-${group.title}`}
                aria-expanded={open}
                className="menu-group-toggle"
            >
                <span>{group.title}</span>
                <span className={`arrow ${open ? 'open' : ''}`}>▼</span>
            </div>
            <Collapse in={open}>
                <div id={`collapse-${group.title}`}>
                    <ListGroup variant="flush" >
                        {visibleItems.map((item) => (
                            <ListGroup.Item
                                action
                                key={item.key}
                                className="menu-item"
                                onClick={() => onSelect(item.key)}
                            >
                                {item.label}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            </Collapse>
        </div>
    );
}


export default function SuperAdminNav({ menuConfig, activeKey, onSelect, navCollapsed }: SuperAdminDashboardProps) {
    return (
        <Collapse in={navCollapsed}>
            <div className="super-admin-nav">
                <h4 className="me-auto brand-text"><span className="brand-text-primary">The</span> Project</h4>
                {menuConfig.map((group) => (
                    <NavGroup
                        key={group.title}
                        group={group}
                        activeKey={activeKey}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        </Collapse>
    );
}