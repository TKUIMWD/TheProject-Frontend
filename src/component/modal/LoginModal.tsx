import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

interface LoginModalProps {
    show: boolean;
    onHide: () => void;
    handleShowRegister: () => void;
}

export default function LoginModal({ show, onHide, handleShowRegister }: LoginModalProps) {
    return (
        <Modal show={show} onHide={onHide} centered dialogClassName="auth-modal">
            <Modal.Header className="border-0">
                <Modal.Title className="w-100 text-center fw-bold">登入</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-5" controlId="loginEmail">
                        <i className="bi bi-person me-2"></i>
                        <Form.Label>用戶名稱</Form.Label>
                        <Form.Control type="email" placeholder="請輸入用戶名稱" autoFocus />
                    </Form.Group>
                    <Form.Group className="mb-5" controlId="loginPassword">
                        <i className="bi bi-lock me-2"></i>
                        <Form.Label>密碼</Form.Label>
                        <Form.Control type="password" placeholder="請輸入密碼" />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 py-2 fw-bold">
                        登入
                    </Button>
                </Form>
                <div className="text-center mt-3">
                    <span className="text-muted">還沒有帳號？</span>
                    <Button variant="link" className="p-0 ms-1" onClick={handleShowRegister}>
                        註冊
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}