import { Container, Row, Col, Button, Form, ToastContainer, Toast } from "react-bootstrap";
import "../../style/dashboard/Profile.css";
import { user_api } from "../../enum/api";
import { asyncPut } from "../../utils/fetch";
import { useState } from "react";


export default function Profile() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastBg, setToastBg] = useState<"success" | "danger" | "secondary">("secondary");

    async function handleUpdateProfile(e: React.FormEvent) {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            handleToast("請先登入", "danger");
            return;
        }

        try {
            const response = await asyncPut(
                user_api.updateProfile,
                {
                    username: username,
                    email: email,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log("更新回應:", response);

            if (response.code === 400) {
                if (response.message === "invalid token") {
                    // token expired or invalid, redirect to login
                    handleToast("登入已過期，請重新登入", "danger");
                    return;
                } else if (response.message.startsWith("missing required fields:")) {
                    // missing fields
                    let message = "請輸入"
                    if (response.message.includes("username")) {
                        message += "用戶名稱";
                    }
                    if (response.message.includes("email")) {
                        if (message !== "請輸入") message += "、";
                        message += "電子郵件";
                    }
                    handleToast(message, "danger");
                    return;
                } else if (/^please wait \d+ minute\(s\) before resending the verification email/.test(response.message)) {
                    const waitTime = response.message.match(/\d+/)?.[0];
                    handleToast(`請查收驗證信，或等${waitTime}分鐘後重試`, "danger");
                    return;
                }
            } else if (response.code === 500) {
                // server error
                handleToast("伺服器錯誤，請稍後再試", "danger");

                return;
            } else if (response.code === 200) {
                // update success
                handleToast("個人資訊更新成功", "success");
                return;
            }
        } catch (error) {
            console.error("更新失敗:", error);
            handleToast("更新失敗，請檢查網路或聯繫管理員", "danger");
        }
    };

    function handleToast(message: string, bg: "success" | "danger" | "secondary") {
        setShowToast(true);
        setToastMessage(message);
        setToastBg(bg);
        setTimeout(() => {
            setShowToast(false);
        }, 2000);
    }

    return (
        <>
            <Container className="profile">
                <Row>
                    <h3>個人資訊</h3>
                    <hr />
                </Row>
                <Row>
                    <Col lg={1}>
                        <img src="src/assets/images/Dashboard/user.png" alt="user-image" width={75} />
                    </Col>
                    <Col lg={4}>
                        <h3>大頭貼</h3>
                        <p>格式： PNG, JPG、檔案大小不超過 1MB</p>
                    </Col>
                    <Col lg={2}>
                        <input type="file" accept="image/*" />
                    </Col>
                    <Col className="profile-buttons" lg={{ span: 2, offset: 1 }}>
                        <Button variant="outline-success">更新</Button>
                        <Button variant="outline-danger">刪除</Button>
                    </Col>
                    <hr />
                </Row>
                <Row>
                    <Form onSubmit={handleUpdateProfile}>
                        <Form.Group as={Row} className="mb-4">
                            <Form.Label column sm="2">
                                <h5>用戶名稱</h5>
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    type="text"
                                    defaultValue={username}
                                    onChange={e => setUsername(e.target.value)} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-4">
                            <Form.Label column sm="2">
                                <h5>電子郵件</h5>
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    type="email"
                                    defaultValue={email}
                                    onChange={e => setEmail(e.target.value)} />
                            </Col>
                        </Form.Group>
                        <Button variant="success" type="submit">
                            更新
                        </Button>
                    </Form>
                </Row>
            </Container>
            <ToastContainer position="top-center" className="p-3 profile-toast">
                <Toast bg={toastBg} show={showToast} onClose={() => setShowToast(false)} delay={2000} autohide>
                    <Toast.Body className="text-center text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}