import { Modal, Button, Form, Toast, ToastContainer, InputGroup } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { auth_api } from "../../enum/api";
import { asyncPost } from "../../utils/fetch";

interface RegisterModalProps {
    show: boolean;
    onHide: () => void;
    handleShowLogin: () => void;
}

export default function RegisterModal({ show, onHide, handleShowLogin }: RegisterModalProps) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastBg, setToastBg] = useState<"success" | "danger" | "secondary">("secondary");
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await asyncPost(auth_api.register, {
            email,
            username,
            password,
        });

        if (response.code === 200) {
            setToastMessage('註冊成功，請登入');
            setToastBg('success');
            setShowToast(true);
            setEmail('');
            setUsername('');
            setPassword('');
            setTimeout(() => {
                setShowToast(false);
                onHide();
                handleShowLogin();
            }, 1200);
        } else {
            setToastMessage(response.message || '註冊失敗');
            setToastBg('danger');
            setShowToast(true);
        }
    };

    return (
        <>
            <Modal show={show} onHide={onHide} centered dialogClassName="auth-modal">
                <Modal.Header className="border-0">
                    <Modal.Title className="w-100 text-center fw-bold">
                        <i className="bi bi-person-plus me-2"></i>
                        註冊
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleRegister}>
                        <Form.Group className="mb-5" controlId="registerEmail">
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
                        <Form.Group className="mb-5" controlId="registerUsername">
                            <i className="bi bi-person me-2"></i>
                            <Form.Label>用戶名稱</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="請輸入用戶名稱"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-5" controlId="registerPassword">
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
                            <i className="bi bi-person-plus me-2"></i>
                            註冊
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <span className="text-muted">已經有帳號？</span>
                        <Button variant="link" className="p-0 ms-1" onClick={handleShowLogin}>
                        <i className="bi bi-box-arrow-in-right me-1"></i>
                            登入
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
            <ToastContainer position="top-center" className="p-3">
                <Toast bg={toastBg} show={showToast} onClose={() => setShowToast(false)} delay={2000} autohide>
                    <Toast.Body className="text-center text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}