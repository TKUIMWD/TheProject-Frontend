import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth_api } from "../../enum/api";
import { asyncPost } from "../../utils/fetch";
import { jwtDecode } from "jwt-decode";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { useToast } from "../../context/ToastProvider";
import { getAuthStatus } from "../../utils/token";

interface LoginModalProps {
    show: boolean;
    onHide: () => void;
    handleShowRegister: () => void;
    onLoginSuccess?: (user: string) => void;
}

export default function LoginModal({ show, onHide, handleShowRegister, onLoginSuccess }: LoginModalProps) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const { showToast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await asyncPost(auth_api.login, {
            email,
            password,
        });

        if (response.code === 200) {
            localStorage.setItem('token', response.body.token);
            const role = getAuthStatus();
            let uname = "";
            try {
                const decoded: any = jwtDecode(response.body.token);
                uname = decoded.username || decoded.name || "";
            } catch {
                console.error("Token decode error");
                showToast("登入失敗", "danger");
            }
            showToast("登入成功", "success");
            setEmail('');
            setPassword('');
            setShowPassword(false);
            if (onLoginSuccess) {
                if (role === "superadmin") {
                    navigate("/superadmin/dashboard");
                } else {
                    onLoginSuccess(uname);
                }
            }

        } else {
            showToast("登入失敗", "danger");
        }
    };

    return (
        <>
            <Modal show={show} onHide={onHide} centered dialogClassName="auth-modal">
                <Modal.Header className="border-0">
                    <Modal.Title className="w-100 text-center fw-bold">
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        登入
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-5" controlId="loginEmail">
                            <i className="bi bi-envelope me-2"></i>
                            <Form.Label>電子郵件</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="請輸入電子郵件"
                                autoFocus
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-5" controlId="loginPassword">
                            <i className="bi bi-lock me-2"></i>
                            <Form.Label>密碼</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    placeholder="請輸入密碼"
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
                        <Button variant="primary" type="submit" className="w-100 py-2 fw-bold">
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            登入
                        </Button>
                        <div className="text-end mt-2">
                            <Button
                                variant="link"
                                type="button"
                                className="py-0 px-0 fw-normal text-decoration-none"
                                onClick={() => {
                                    onHide();
                                    setShowForgot(true);
                                }}
                                style={{ fontSize: "0.95rem" }}
                            >
                                <i className="bi bi-question-circle me-1"></i>
                                忘記密碼？
                            </Button>
                        </div>
                    </Form>
                    <div className="text-center mt-3">
                        <span className="text-muted">還沒有帳號？</span>
                        <Button variant="link" className="p-0 ms-1 align-baseline" onClick={handleShowRegister}>
                            <i className="bi bi-person-plus me-1"></i>
                            註冊
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
            <ForgotPasswordModal
                show={showForgot}
                onHide={() => setShowForgot(false)}
                handleShowLogin={() => {
                    setShowForgot(false);
                    show || onHide();
                }}
            />
        </>
    );
}