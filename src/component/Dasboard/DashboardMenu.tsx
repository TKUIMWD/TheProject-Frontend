import { ListGroup } from 'react-bootstrap';
import { Dispatch, SetStateAction } from 'react';
import '../../style/dashboard/DashboardMenu.css';
import { useNavigate } from 'react-router-dom';

interface DashboardMenuProps {
    activeKey: string;
    setActiveKey: Dispatch<SetStateAction<string>>;
}

export default function DashboardMenu({ activeKey, setActiveKey }: DashboardMenuProps) {
    const navigate = useNavigate();
    return (
        <div className="dashboard-menu">
            <ListGroup>
                <h5>帳號管理</h5>
                <ListGroup.Item
                    className="dashboard-menu-item"
                    action
                    active={activeKey === "Profile"}
                    onClick={() => {
                        setActiveKey("Profile");
                        navigate("?tab=Profile");
                    }}
                >
                    個人資訊
                </ListGroup.Item>
                <ListGroup.Item
                    className="dashboard-menu-item"
                    action
                    active={activeKey === "ChangePassword"}
                    onClick={() => {
                        setActiveKey("ChangePassword");
                        navigate("?tab=ChangePassword");
                    }}
                >
                    變更密碼
                </ListGroup.Item>
                <h5>課程管理</h5>
                <ListGroup.Item
                    className="dashboard-menu-item"
                    action
                    active={activeKey === "MyCourses"}
                    onClick={() => {
                        setActiveKey("MyCourses");
                        navigate("?tab=MyCourses");
                    }}
                >
                    我的課程
                </ListGroup.Item>
                <h5>機器管理</h5>
                <ListGroup.Item
                    className="dashboard-menu-item"
                    action
                    active={activeKey === "MyMachines"}
                    onClick={() => {
                        setActiveKey("MyMachines");
                        navigate("?tab=MyMachines");
                    }}
                >
                    我的機器
                </ListGroup.Item>
                <h5>訂閱資訊</h5>
                <ListGroup.Item
                    className="dashboard-menu-item"
                    action
                    active={activeKey === "MySubscriptions"}
                    onClick={() => {
                        setActiveKey("MySubscriptions");
                        navigate("?tab=MySubscriptions");
                    }}
                >
                    訂閱資訊
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}