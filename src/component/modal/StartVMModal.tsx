import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

interface StartVMModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: (username: string, password: string) => void;
}

export default function StartVMModal({ show, onHide, onConfirm }: StartVMModalProps) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");


    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onConfirm(username, password);
        onHide();
    }


    return (
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial' }}
        >
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>VM 登入</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                placeholder="Enter Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                        </Form.Group>
                        <Button variant="success" type="submit">
                            提交
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}