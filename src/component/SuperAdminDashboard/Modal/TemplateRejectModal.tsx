import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

interface TemplateRejectModalProps {
    show: boolean;
    handleClose: () => void;
    template_id: string;
    handleReject: (template_id: string, reason: string) => void;
}

export default function TemplateRejectModal({ show, handleClose, template_id, handleReject }: TemplateRejectModalProps) {
    if (template_id === "") return null;

    const [rejectReason, setRejectReason] = useState<string>("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        handleReject(template_id, rejectReason);
        handleClose();
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>審核拒絕</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Label htmlFor="inputRejectReason">拒絕原因</Form.Label>
                        <Form.Control
                            as="textarea"
                            id="inputRejectReason"
                            placeholder="請輸入拒絕原因"
                            rows={4}
                            onChange={(e) => setRejectReason(e.target.value)}
                            required // HTML5 的基本驗證
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" variant="success">
                            提交
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}