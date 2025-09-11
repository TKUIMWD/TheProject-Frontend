import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastProvider";
import { asyncGet, asyncPut } from "../../../utils/fetch";
import { superadmin_api } from "../../../enum/api";
import { User } from "../../../interface/User/User";
import { Col, Row } from "react-bootstrap";
import UserCard from "../Card/UserCard";

export default function AllUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { showToast } = useToast();

    const token = localStorage.getItem('token');
    useEffect(() => {
        if (!token) {
            showToast("請先登入", "danger");
            setLoading(false);
            return;
        }

        const options = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        asyncGet(superadmin_api.getAllUsers, options)
            .then((res) => {
                if (res.code === 200 && res.body) {
                    setUsers(res.body);
                } else {
                    throw new Error(res.message || "無法取得用戶資料");
                }
            })
            .catch((error) => {
                showToast(`無法獲取用戶資料：${error.message}`, "danger");
            })
            .finally(() => {
                setLoading(false);
            });

    }, [token]);

    const handlePromoteUser = async (userId: string) => {
        if (!token) return;
        if (!window.confirm(`確定要將此用戶提升為 Admin 嗎？`)) return;

        try {
            const options = { headers: { Authorization: `Bearer ${token}` } };
            const requestBody = {
                userId: userId,
                newRole: 'admin'
            };
            
            // 使用 asyncPut 和我們在 enum 中定義好的路徑
            const res = await asyncPut(superadmin_api.changeUserRole, requestBody, options);

            if (res.code === 200) {
                showToast("用戶權限已提升", "success");
                setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
            } else {
                throw new Error(res.message || "操作失敗");
            }
        } catch (error: any) {
            showToast(`操作失敗：${error.message}`, "danger");
        }
    };

    if (loading) {
        return <p>Loading users...</p>;
    }

    return (
        <div>
            <h3>用戶總覽</h3>
            <hr />
            <Row>
                {users.map((user) => (
                    <Col key={user._id} md={4} lg={3} className="d-flex align-items-stretch">
                        <UserCard 
                            user={user} 
                            onPromote={handlePromoteUser}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
}
