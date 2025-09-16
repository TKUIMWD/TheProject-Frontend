import { Button, Card, Image, ListGroup } from "react-bootstrap";
import { User } from "../../../interface/User/User";
import { processAvatarPath } from "../../../utils/processAvatar";
import { useToast } from "../../../context/ToastProvider";
import { asyncGet } from "../../../utils/fetch";
import { user_api } from "../../../enum/api";
import { useEffect, useState } from "react";
import { getOptions } from "../../../utils/token";

interface UserCardProps {
    user: User;
    handleSwitchRole: (user_id: string) => void;
    handleSwitchPlan: () => void;
}

export default function UserCard({ user, handleSwitchRole, handleSwitchPlan }: UserCardProps) {
    const { showToast } = useToast();
    const [userCRP, setUserCRP] = useState<string | null>(null);
    const isAdmin = user.role === "admin";

    useEffect(() => {
        try {
            const options = getOptions();
            asyncGet(user_api.getUserCRP, options)
                .then((res) => {
                    if (res.code === 200) {
                        setUserCRP(res.body.name);
                    } else {
                        throw new Error(res.message || "無法取得用戶方案");
                    }
                })
                .catch((error) => {
                    throw error;
                });
        } catch (error:any) {
            showToast(`無法獲取用戶方案：${error.message}`, "danger");
            console.error(error);
        }
    }, []);

    return (
        <Card key={user._id} style={{ cursor:"default", width: '20rem' }} className="mb-3">
            <div className="text-center p-3">
                <Image
                    src={processAvatarPath(user.avatar_path)}
                    roundedCircle
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
            </div>
            <Card.Body>
                <Card.Title>{user.username}</Card.Title>
                <Card.Text>
                    <ListGroup>
                        <ListGroup.Item>角色: {user.role}</ListGroup.Item>
                        <ListGroup.Item>課程: {user.course_ids.length}</ListGroup.Item>
                        <ListGroup.Item>VM: {user.owned_vms.length}</ListGroup.Item>
                        {isAdmin && <ListGroup.Item>樣板：{user.owned_templates.length}</ListGroup.Item>}
                        <ListGroup.Item>方案: {userCRP ? userCRP : "none"}</ListGroup.Item>
                    </ListGroup>
                </Card.Text>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-center ">
                <Button onClick={() => handleSwitchRole(user._id ? user._id : "")} variant="btn-custom btn-outline-light-blue w-50" className="me-2">切換{isAdmin ? "為用戶" : "為教師"}</Button>
                <Button onClick={handleSwitchPlan} variant="btn-custom btn-outline-gray w-50">切換方案</Button>
            </Card.Footer>
        </Card>
    );
}