import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastProvider";
import { asyncGet, asyncPut } from "../../../utils/fetch";
import { superadmin_api } from "../../../enum/api";
import { User } from "../../../interface/User/User";
import { Col, Row } from "react-bootstrap";
import UserCard from "../Card/UserCard";
import { getOptions } from "../../../utils/token";
import Loading from "../../Loading";

export default function AllUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { showToast } = useToast();

    useEffect(() => {
        try {
            const options = getOptions();
            asyncGet(superadmin_api.getAllUsers, options)
                .then((res) => {
                    if (res.code === 200 && res.body) {
                        setUsers(res.body);
                    } else {
                        throw new Error(res.message || "無法取得用戶資料");
                    }
                })
                .catch((error) => {
                    throw error;
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (error: any) {
            showToast(`無法獲取用戶資料：${error.message}`, "danger");
            setLoading(false);
        }
    }, []);

    // switch to admin
    function handleSwitchRole(user_id: string) {
        try {
            if (!user_id) {
                showToast("用戶ID無效", "danger");
                return;
            }

            const options = getOptions();
            const body = {
                userId: user_id,
                newRole: "admin"
            };
            asyncPut(superadmin_api.changeUserRole, body, options)
                .then((res) => {
                    if (res.code === 200) {
                        showToast("用戶身分切換成功", "success");
                        // 更新本地用戶列表
                        setUsers((prevUsers) =>
                            prevUsers.filter((user) => user._id !== user_id)
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
        // todo
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <h3>用戶總覽</h3>
            <hr />
            <Row>
                {users.map((user) => (
                    <Col key={user._id} md={4} lg={3} className="d-flex align-items-stretch">
                        <UserCard user={user} handleSwitchRole={handleSwitchRole} handleSwitchPlan={handleSwitchPlan} />
                    </Col>
                ))}
            </Row>
        </div>
    );
}
