import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastProvider";
import { asyncGet, asyncPut } from "../../../utils/fetch";
import { superadmin_api } from "../../../enum/api";
import { User } from "../../../interface/User/User";
import { Col, Row } from "react-bootstrap";
import UserCard from "../Card/UserCard";
import { getOptions } from "../../../utils/token";

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

    // switch to user
    function handleSwitchRole(user_id: string) {
        try {
            if (!user_id) {
                showToast("用戶ID無效", "danger");
                return;
            }

            const options = getOptions();
            const body = {
                userId: user_id,
                newRole: "user"
            };
            asyncPut(superadmin_api.changeUserRole, body, options)
                .then((res) => {
                    if (res.code === 200) {
                        showToast("用戶身分切換成功", "success");
                        // 更新本地用戶列表
                        setAdmins((prevUsers) =>
                            prevUsers.filter((user: User) => user._id !== user_id)
                        );
                    } else {
                        throw new Error(res.message || "用戶身分切換失敗");
                    }
                })
                .catch((error) => {
                    throw error;
                });

        } catch (error:any) {
            showToast(`用戶身分切換失敗：${error.message}`, "danger");
            console.error("用戶身分切換時發生錯誤：", error);
        }
    }

    function handleSwitchPlan() {
        showToast("切換方案功能尚未實作", "info");
    }

    if (loading) {
        return <p>Loading users...</p>;
    }

    return (
        <div>
            <h3>管理員總覽</h3>
            <hr />
            <Row>
                {admins.map((admin) => (
                    <Col key={admin._id} md={4} lg={3} className="d-flex align-items-stretch">
                        <UserCard user={admin} handleSwitchRole={handleSwitchRole} handleSwitchPlan={handleSwitchPlan} />
                    </Col>
                ))}
            </Row>
        </div>
    );
}

