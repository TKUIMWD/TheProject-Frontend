import { Card, Image, ListGroup } from "react-bootstrap";
import { User } from "../../../interface/User/User";
import { processAvatarPath } from "../../../utils/processAvatar";
import defaultAvatarImg from "../../../assets/images/Dashboard/default-avatar.jpg";
import { useToast } from "../../../context/ToastProvider";
import { asyncGet } from "../../../utils/fetch";
import { superadmin_crp_api } from "../../../enum/api";

interface UserCardProps {
    user: User;
}

export default function UserCard({ user }: UserCardProps) {
    const { showToast } = useToast();
    const token = localStorage.getItem('token');
    const isAdmin = user.role === "admin";

    if (!token) {
        showToast("請先登入", "danger")
        return;
    }

    const options = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    function getUserCRP(): string | null {
        asyncGet(superadmin_crp_api.getById(user.compute_resource_plan_id), options)
            .then((res) => {
                if (res.code === 200) {
                    return res.body.name;
                } else {
                    throw new Error(res.message || "無法取得用戶方案");
                }
            })
            .catch((error) => {
                showToast(error.message, "danger");
                return null;
            });
        return null;
    }

    return (
        <Card key={user._id} style={{ width: '18rem' }} className="mb-3">
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
                        <ListGroup.Item>方案: {getUserCRP() ? getUserCRP() : "none"}</ListGroup.Item>
                    </ListGroup>
                </Card.Text>
            </Card.Body>
        </Card>
    );
}