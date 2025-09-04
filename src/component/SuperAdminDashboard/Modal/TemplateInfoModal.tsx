import { Modal, Row, Col, Badge, Card } from "react-bootstrap";
import { VM_Template_Info } from "../../../interface/VM/VM_Template";
import { formatISOString } from "../../../utils/timeFormat";
import { MBtoGB } from "../../../utils/StorageUnitsConverter";

interface TemplateInfoModalProps {
    show: boolean;
    handleClose: () => void;
    template: VM_Template_Info | null;
}

export default function TemplateInfoModal({ show, handleClose, template }: TemplateInfoModalProps) {
    // 如果沒有 template 資料，顯示空的 Modal
    if (!template) {
        return;
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            keyboard={false}
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {template.name}
                    {template.is_public ? (
                        <Badge bg="success" className="ms-2">公開</Badge>
                    ) : (
                        <Badge bg="secondary" className="ms-2">私有</Badge>
                    )}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="g-3">
                    {/* 描述卡片 */}
                    <Col md={12}>
                        <Card>
                            <Card.Header>
                                <h5 className="mb-0">描述</h5>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>{template.description || "無描述"}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* 系統規格卡片 */}
                    <Col md={6}>
                        <Card className="h-100">
                            <Card.Header>
                                <h5 className="mb-0">系統規格</h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col xs={4}>
                                        <div className="mb-3">
                                            <strong>CPU 核心</strong>
                                            <div className="fs-4 text-primary">{template.default_cpu_cores} 核</div>
                                        </div>
                                    </Col>
                                    <Col xs={4}>
                                        <div className="mb-3">
                                            <strong>記憶體</strong>
                                            <div className="fs-4 text-info">{MBtoGB(template.default_memory_size)} GB</div>
                                        </div>
                                    </Col>
                                    <Col xs={4}>
                                        <div>
                                            <strong>磁碟空間</strong>
                                            <div className="fs-4 text-warning">{template.default_disk_size} GB</div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* 提交者資訊卡片 */}
                    <Col md={6}>
                        <Card className="h-100">
                            <Card.Header>
                                <h5 className="mb-0">提交者資訊</h5>
                            </Card.Header>
                            <Card.Body>
                                {template.submitter_user_info ? (
                                    <>
                                        <div className="mb-2">
                                            <strong>使用者名稱:</strong>
                                            <div className="ms-2">{template.submitter_user_info.username}</div>
                                        </div>
                                        <div className="mb-2">
                                            <strong>Email:</strong>
                                            <div className="ms-2 text-break">{template.submitter_user_info.email}</div>
                                        </div>
                                        {template.submitted_date && (
                                            <div>
                                                <strong>提交日期:</strong>
                                                <div className="ms-2 text-muted">{formatISOString(template.submitted_date)}</div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Card.Text className="text-muted">無提交者資訊</Card.Text>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
}