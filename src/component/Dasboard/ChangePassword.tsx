import { ReactNode, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { asyncPut } from "../../utils/fetch";
import { user_api } from "../../enum/api";
import { getOptions } from "../../utils/token";
import { useToast } from "../../context/ToastProvider";
import '../../style/dashboard/ChangePassword.css'

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
    const { showToast } = useToast();

    async function handleUpdatePassword(e: React.FormEvent) {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            showToast("新密碼與確認密碼不一致", "danger");
            return;
        }

        try {
            const options = getOptions();
            const body = {
                oldPassword,
                newPassword,
                confirmPassword
            }
            const response = await asyncPut(user_api.changePassword, body, options);

            if (response.code === 400) {
                if (response.message === "invalid token") {
                    showToast("登入已過期，請重新登入", "danger");
                    return;
                } else if (response.message.startsWith("missing required fields:")) {
                    // missing fields
                    let message = "請輸入"
                    if (response.message.includes("oldPassword")) {
                        message += "現在的密碼";
                    }
                    if (response.message.includes("newPassword")) {
                        if (message !== "請輸入") message += "、";
                        message += "新密碼";
                    }
                    if (response.message.includes("confirmPassword")) {
                        if (message !== "請輸入") message += "、";
                        message += "確認新密碼";
                    }
                    showToast(message, "danger");
                    return;
                } else if (response.message === "newPassword and confirmPassword do not match") {
                    showToast("新密碼與確認密碼不一致，請重新輸入", "danger");
                    return;
                } else if (response.message === "oldPassword is incorrect") {
                    showToast("現在的密碼不正確，請重新輸入", "danger");
                    return;
                } else if (response.message.startsWith("password does not meet the requirements:")) {
                    let message = "新密碼須符合要求："
                    response.message.split(":")[1].split(",").forEach((item: string) => {
                        message += ` ${item.trim()}.`;
                    });
                    showToast(message, "danger");
                    return;
                }
            } else if (response.code === 403) {
                showToast("帳號尚未驗證，請先透過驗證信取得驗證", "danger");
                return;
            } else if (response.code === 500) {
                showToast("伺服器錯誤，請稍後再試", "danger");
                return;
            } else if (response.code === 200) {
                showToast("密碼更新成功", "success");
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                return;
            }
        } catch (error) {
            console.error("更新密碼時發生錯誤:", error);
            showToast("更新密碼時發生錯誤，請稍後再試", "danger");
            return;
        }

    }

    const passwordFields = [
        { name: "oldPassword", title: "現在的密碼", value: oldPassword, setter: setOldPassword },
        { name: "newPassword", title: "新密碼", value: newPassword, setter: setNewPassword },
        { name: "confirmPassword", title: "確認新密碼", value: confirmPassword, setter: setConfirmPassword }
    ];

    const content: ReactNode[] =
        passwordFields.map((field) => {
            return (
                <Form.Group as={Row} className="mb-4" key={field.name}>
                    <Form.Label column sm="3" className="form-label">
                        {field.title}
                    </Form.Label>
                    <Col sm="9">
                        <InputGroup>
                            <Form.Control
                                type={showPassword[field.name] ? "text" : "password"}
                                value={field.value}
                                onChange={e => field.setter(e.target.value)}
                                required
                                className="form-input"
                            />
                            <Button
                                variant="outline-secondary"
                                type="button"
                                onClick={() => setShowPassword(prev => ({ ...prev, [field.name]: !prev[field.name] }))}
                                tabIndex={-1}
                                className="password-toggle-btn"
                            >
                                <i className={showPassword[field.name] ? "bi bi-eye" : "bi bi-eye-slash"}></i>
                            </Button>
                        </InputGroup>
                    </Col>
                </Form.Group>
            )
        });

    return (
        <Container className="change-password-container">
            <Row>
                <Col>
                    <h3>變更密碼</h3>
                    <hr />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form onSubmit={handleUpdatePassword} className="change-password-form">
                        {content}
                        <div className="text-center mt-4">
                            <Button type="submit" className="update-password-btn">
                                更新密碼
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}