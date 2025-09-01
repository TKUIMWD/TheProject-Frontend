import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastProvider";
import { asyncGet } from "../../../utils/fetch";
import { superadmin_api } from "../../../enum/api";
import { User } from "../../../interface/User/User";
import { Col, Row } from "react-bootstrap";
import UserCard from "../Card/UserCard";

export default function AllAdmins() {
    const [admins, setAdmins] = useState<User[]>([]);
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

        asyncGet(superadmin_api.getAllAdminUsers, options)
            .then((res) => {
                if (res.code === 200 && res.body) {
                    setAdmins(res.body);
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

    if (loading) {
        return <p>Loading users...</p>;
    }

    return (
        <div>
            <h3>All Users</h3>
            <hr />
            <Row>
                {admins.map((admin) => (
                    <Col key={admin._id} md={4} lg={3} className="d-flex align-items-stretch">
                        <UserCard user={admin} />
                    </Col>
                ))}
            </Row>
        </div>
    );
}
