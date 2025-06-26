import { ReactNode, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row, Toast, ToastContainer } from "react-bootstrap";
import { asyncPut } from "../../utils/fetch";
import { user_api } from "../../enum/api";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastBg, setToastBg] = useState<"success" | "danger" | "secondary">("secondary");

    async function handleUpdatePassword(e: React.FormEvent) {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            handleToast("請先登入", "danger");
            return;
        }

        if (newPassword !== confirmPassword) {
            handleToast("新密碼與確認密碼不一致", "danger");
            return;
        }

        try {
            const response = await asyncPut(
                user_api.changePassword,
                {
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.code === 400) {
                if (response.message === "invalid token") {
                    handleToast("登入已過期，請重新登入", "danger");
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
                    handleToast(message, "danger");
                    return;
                } else if (response.message === "newPassword and confirmPassword do not match") {
                    handleToast("新密碼與確認密碼不一致，請重新輸入", "danger");
                    return;
                } else if (response.message === "oldPassword is incorrect") {
                    handleToast("現在的密碼不正確，請重新輸入", "danger");
                    return;
                } else if (response.message.startsWith("password does not meet the requirements:")) {
                    let message = "新密碼須符合要求："
                    response.message.split(":")[1].split(",").forEach((item: string) => {
                        message += ` ${item.trim()}.`;
                    });
                    handleToast(message, "danger");
                    return;
                }
            } else if (response.code === 403) {
                handleToast("帳號尚未驗證，請先透過驗證信取得驗證", "danger");
                return;
            } else if (response.code === 500) {
                handleToast("伺服器錯誤，請稍後再試", "danger");
                return;
            } else if (response.code === 200) {
                handleToast("密碼更新成功", "success");
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                return;
            }
        } catch (error) {
            console.error("更新密碼時發生錯誤:", error);
            handleToast("更新密碼時發生錯誤，請稍後再試", "danger");
            return;
        }

    }

    function handleToast(message: string, bg: "success" | "danger" | "secondary") {
        setShowToast(true);
        setToastMessage(message);
        setToastBg(bg);
        setTimeout(() => {
            setShowToast(false);
        }, 5000);
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
                    <Form.Label column sm="3">
                        <h5>{field.title}</h5>
                    </Form.Label>
                    <Col sm="10">
                        <InputGroup>
                            <Form.Control
                                type={showPassword[field.name] ? "text" : "password"}
                                value={field.value}
                                onChange={e => field.setter(e.target.value)}
                                required
                            />
                            <Button
                                variant="outline-secondary"
                                type="button"
                                onClick={() => setShowPassword(prev => ({ ...prev, [field.name]: !prev[field.name] }))
                                }
                                tabIndex={-1}
                            >
                                <i className={showPassword[field.name] ? "bi bi-eye" : "bi bi-eye-slash"}></i>
                            </Button>
                        </InputGroup>
                    </Col>
                </Form.Group>
            )
        });

    return (
        <>
            <Container>
                <Row>
                    <h3>變更密碼</h3>
                    <hr />
                </Row>
                <Row>
                    <Form onSubmit={handleUpdatePassword}>
                        {content}
                        <Button variant="success" type="submit">
                            更新
                        </Button>
                    </Form>
                </Row>
            </Container>
            <ToastContainer position="top-center" className="p-3" style={{ zIndex: 1050, top: '60px' }}>
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={2000} autohide bg={toastBg}>
                    <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}