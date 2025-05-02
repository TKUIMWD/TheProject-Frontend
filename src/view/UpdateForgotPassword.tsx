import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Toast, ToastContainer, InputGroup } from "react-bootstrap";
import { asyncPut } from "../utils/fetch";
import { auth_api } from "../enum/api";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function UpdateForgotPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastBg, setToastBg] = useState<"success" | "danger">("success");
    const [showToast, setShowToast] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!password || !password2) {
            setError("請輸入新密碼並再次確認");
            return;
        }
        if (password !== password2) {
            setError("兩次輸入的密碼不一致");
            return;
        }
        if (!token) {
            setError("驗證連結無效或缺少 token。");
            return;
        }
        setLoading(true);
        const res = await asyncPut(
            auth_api.forgotPassword,
            { password },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        setLoading(false);
        if (res.code === 200) {
            setToastMessage("密碼重設成功，請重新登入");
            setToastBg("success");
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                navigate("/");
            }, 1500);
        } else {
            setToastMessage(res.message || "密碼重設失敗，請稍後再試");
            setToastBg("danger");
            setShowToast(true);
        }
    };

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
            <Card style={{ maxWidth: 400, width: "100%" }} className="shadow-sm p-4 border-1">
                <Card.Body className="text-center">
                    <Card.Title className="mb-4 fw-bold fs-3">
                        <i className="bi bi-key me-2"></i>
                        重設密碼
                    </Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4 text-start" controlId="resetPassword">
                            <Form.Label>
                                <i className="bi bi-lock me-2"></i>
                                新密碼
                            </Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    placeholder="請輸入新密碼"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                                <Button
                                    variant="outline-secondary"
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    tabIndex={-1}
                                >
                                    <i className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"}></i>
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-4 text-start" controlId="resetPassword2">
                            <Form.Label>
                                <i className="bi bi-lock-fill me-2"></i>
                                再次輸入新密碼
                            </Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword2 ? "text" : "password"}
                                    placeholder="請再次輸入新密碼"
                                    value={password2}
                                    onChange={e => setPassword2(e.target.value)}
                                    required
                                />
                                <Button
                                    variant="outline-secondary"
                                    type="button"
                                    onClick={() => setShowPassword2(v => !v)}
                                    tabIndex={-1}
                                >
                                    <i className={showPassword2 ? "bi bi-eye" : "bi bi-eye-slash"}></i>
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        {error && <Alert variant="danger" className="py-2">{error}</Alert>}
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 py-2 fw-bold"
                            disabled={loading}
                        >
                            <i className="bi bi-arrow-repeat me-2"></i>
                            更新密碼
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <ToastContainer position="top-center" className="p-3">
                <Toast bg={toastBg} show={showToast} onClose={() => setShowToast(false)} delay={2000} autohide>
                    <Toast.Body className="text-center text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
}