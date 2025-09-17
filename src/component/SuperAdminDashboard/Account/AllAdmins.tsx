import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastProvider";
import { asyncGet, asyncPut } from "../../../utils/fetch";
import { superadmin_api, superadmin_crp_api } from "../../../enum/api";
import { User } from "../../../interface/User/User";
import { Col, Row } from "react-bootstrap";
import UserCard from "../Card/UserCard";
import { getOptions } from "../../../utils/token";
import { ComputeResourcePlan } from "../../../interface/CRP/CRP";

export default function AllAdmins() {
    const [admins, setAdmins] = useState<User[]>([]);
    const [allCRP, setAllCRP] = useState<ComputeResourcePlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { showToast } = useToast();

    // get all admin users
    useEffect(() => {
        try {
            const options = getOptions();
            asyncGet(superadmin_api.getAllAdminUsers, options)
                .then((res) => {
                    if (res.code === 200 && res.body) {
                        setAdmins(res.body);
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
            console.error("獲取用戶資料時發生錯誤：", error);
            setLoading(false);
        }
    }, []);

    // get all CRP data
    useEffect(() => {
        try {
            const options = getOptions();
            asyncGet(superadmin_crp_api.getAll, options)
                .then((res) => {
                    if (res.code === 200 && res.body) {
                        setAllCRP(res.body);
                    } else {
                        throw new Error(res.message || "無法取得方案資料");
                    }
                })
                .catch((error) => {
                    throw error;
                });
        } catch (error: any) {
            showToast(`無法獲取方案資料：${error.message}`, "danger");
            console.error("獲取方案資料時發生錯誤：", error);
        }
    }, []);

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

        } catch (error: any) {
            showToast(`用戶身分切換失敗：${error.message}`, "danger");
            console.error("用戶身分切換時發生錯誤：", error);
        }
    }

    function handleSwitchPlan(user_id: string, plan_id: string) {
        if (!user_id || !plan_id) {
            showToast("用戶ID或方案ID無效", "danger");
            return;
        }
        try {
            const options = getOptions();
            const body = {
                userId: user_id,
                planId: plan_id
            };
            asyncPut(superadmin_api.assignCRPToUser, body, options)
                .then((res) => {
                    if (res.code === 200) {
                        showToast("切換方案成功", "success");
                        setAdmins((prevUsers) =>
                            prevUsers.map((user) =>
                                user._id === user_id ? {
                                    ...user,
                                    compute_resource_plan_id: plan_id
                                } : user
                            )
                        );
                    } else {
                        throw new Error(res.message || "切換方案失敗");
                    }
                })
                .catch((error) => {
                    throw error;
                });

        } catch (error: any) {
            showToast(`切換方案失敗：${error.message}`, "danger");
            console.error("切換方案時發生錯誤：", error);
        }
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
                        <UserCard user={admin} allCRP={allCRP} handleSwitchRole={handleSwitchRole} handleSwitchPlan={handleSwitchPlan} />
                    </Col>
                ))}
            </Row>
        </div>
    );
}

