import { Card, Col, Container, Row } from "react-bootstrap";
import { VM_Box_Info } from "../../interface/VM/VM_Box";
import { MBtoGB } from "../../utils/StorageUnitsConverter";
import Markdown from "react-markdown";
import "../../style/BoxAndCourseUniversal/UniversalContent.css";

function SystemRequireCard({ box }: { box: VM_Box_Info }) {
    return (
        <Card>
            <Card.Body>
                <Row className="text-center">
                    <Col xs={4}>
                        <div className="mb-2"><strong>CPU</strong></div>
                        <div className="fs-4 text-primary">{box.default_cpu_cores} 核</div>
                    </Col>
                    <Col xs={4}>
                        <div className="mb-2"><strong>記憶體</strong></div>
                        <div className="fs-4 text-info">{MBtoGB(box.default_memory_size)} GB</div>
                    </Col>
                    <Col xs={4}>
                        <div className="mb-2"><strong>磁碟</strong></div>
                        <div className="fs-4 text-warning">{box.default_disk_size} GB</div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default function BoxOverview({box}: {box: VM_Box_Info}) {
    return (
        <Container className="tab-pane-content">
            <Row>
                <Col>
                    <div className="mb-4">
                        <h5><b>範本描述</b></h5>
                        <Markdown>{box.description}</Markdown>
                    </div>
                    <div className="mb-4">
                        <h5><b>Box資訊與設定說明</b></h5>
                        <Markdown>{box.box_setup_description}</Markdown>
                    </div>
                    <div className="mb-4">
                        <h5><b>系統規格</b></h5>
                        <Row>
                            <Col md={{ span: 9, offset: 1 }} lg={{ span: 6, offset: 0 }}>
                                <SystemRequireCard box={box} />
                            </Col>
                        </Row>
                    </div>
                    <div className="mb-4">
                        <h5><b>更新時間</b></h5>
                        <p className="text-muted">{new Date(box.updated_date).toLocaleString()}</p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}