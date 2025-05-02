import { useState } from "react";
import { Modal, Button, Form, Toast, ToastContainer } from "react-bootstrap";
import { asyncPost } from "../../utils/fetch";
import { auth_api } from "../../enum/api";
import "bootstrap-icons/font/bootstrap-icons.css";

interface ForgotPasswordModalProps {
    show: boolean;
    onHide: () => void;
    handleShowLogin: () => void;
}

export default function ForgotPasswordModal({ show, onHide, handleShowLogin }: ForgotPasswordModalProps) {
    const [email, setEmail] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastBg, setToastBg] = useState<"success" | "danger" | "secondary">("secondary");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await asyncPost(auth_api.forgotPassword, { email });
        setLoading(false);
        if (res.code === 200) {
            setToastMessage("重設密碼信件已寄出，請檢查信箱");
            setToastBg("success");
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                setEmail('');
                onHide();
            }, 1500);
        } else {
            setToastMessage(res.message || "發送失敗，請稍後再試");
            setToastBg("danger");
            setShowToast(true);
        }
    };

    return (
        <>
            <Modal show={show} onHide={onHide} centered dialogClassName="auth-modal">
                <Modal.Header className="border-0">
                    <Modal.Title className="w-100 text-center fw-bold">
                        <i className="bi bi-question-circle me-2"></i>
                        忘記密碼
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-5" controlId="forgotPasswordEmail">
                            <i className="bi bi-envelope me-2"></i>
                            <Form.Label>電子郵件</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="請輸入註冊信箱"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 py-2 fw-bold"
                            disabled={loading}
                        >
                            <i className="bi bi-send me-2"></i>
                            送出
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <span className="text-muted">想起密碼了？</span>
                        <Button variant="link" className="p-0 ms-1 align-baseline" onClick={onHide}>
                            <i className="bi bi-x-circle me-1"></i>
                            取消
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