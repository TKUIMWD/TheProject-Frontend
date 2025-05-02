import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

interface RegisterModalProps {
    show: boolean;
    onHide: () => void;
    handleShowLogin: () => void;
}

export default function RegisterModal({ show, onHide, handleShowLogin }: RegisterModalProps) {
    return (
        <Modal show={show} onHide={onHide} centered dialogClassName="auth-modal">
            <Modal.Header className="border-0">
                <Modal.Title className="w-100 text-center fw-bold">註冊</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-2" controlId="registerEmail">
                        <i className="bi bi-envelope me-2"></i>
                        <Form.Label>電子郵件</Form.Label>
                        <Form.Control type="email" placeholder="請輸入電子郵件" autoFocus />
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="registerUsername">
                        <i className="bi bi-person me-2"></i>
                        <Form.Label>用戶名稱</Form.Label>
                        <Form.Control type="text" placeholder="請輸入用戶名稱" />
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="registerPassword">
                        <i className="bi bi-lock me-2"></i>
                        <Form.Label>密碼</Form.Label>
                        <Form.Control type="password" placeholder="請輸入密碼" />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 py-2 fw-bold">
                        註冊
                    </Button>
                </Form>
                <div className="text-center mt-3">
                    <span className="text-muted">已經有帳號？</span>
                    <Button variant="link" className="p-0 ms-1" onClick={handleShowLogin}>
                        登入
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}