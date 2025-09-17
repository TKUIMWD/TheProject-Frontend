import { Button, Card, Dropdown, Image, ListGroup } from "react-bootstrap";
import { User } from "../../../interface/User/User";
import { processAvatarPath } from "../../../utils/processAvatar";
import { ComputeResourcePlan } from "../../../interface/CRP/CRP";

interface UserCardProps {
    user: User;
    allCRP: ComputeResourcePlan[];
    handleSwitchRole: (user_id: string) => void;
    handleSwitchPlan: (user_id: string, plan_id: string) => void;
}

export default function UserCard({ user, allCRP, handleSwitchRole, handleSwitchPlan }: UserCardProps) {
    const isAdmin = user.role === "admin";
    const planName = allCRP.find(plan => plan._id === user.compute_resource_plan_id)?.name || "none";

    return (
        <Card key={user._id} style={{ cursor: "default", width: '20rem' }} className="mb-3">
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
                        <ListGroup.Item>方案: {planName}</ListGroup.Item>
                    </ListGroup>
                </Card.Text>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-center ">
                <Button onClick={() => handleSwitchRole(user._id ? user._id : "")} variant="btn-custom btn-outline-light-blue w-50" className="me-2">切換{isAdmin ? "為用戶" : "為教師"}</Button>
                <Dropdown>
                    <Dropdown.Toggle variant="btn-custom btn-outline-gray">
                        切換方案
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {allCRP.map((plan) => (
                            <Dropdown.Item key={plan._id} onClick={() => handleSwitchPlan(user._id ? user._id : "", plan._id ? plan._id : "")}>
                                {/* 建議顯示 plan.name 讓管理者更容易辨識 */}
                                {plan.name}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Card.Footer>
        </Card>
    );
}