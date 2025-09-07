import { Col, Container, Row } from "react-bootstrap";
import { VM_Box_Info } from "../../interface/VM/VM_Box";
import "../../style/BoxResource/BoxResource.css";

interface AllBoxProps {
    boxes: VM_Box_Info[];
    handleRowClick: (box_id: VM_Box_Info) => void;
}

interface BoxItemProps {
    box: VM_Box_Info;
    handleRowClick: (box_id: VM_Box_Info) => void;
}

function BoxItem({ box, handleRowClick }: BoxItemProps) {
    const imageUrl = "/src/assets/images/BoxResource/box.jpg";

    return (
        <Container fluid className="border rounded shadow-sm p-3 mb-3 bg-white">
            <Row className="box-row align-items-center" onClick={() => handleRowClick(box)}>
                <Col lg={2}>
                    <img
                        src={imageUrl}
                        alt={box.name}
                        className="box-item-img"
                    />
                </Col>
                <Col lg={10}>
                    <h5 className="mb-1">{box.name}</h5>
                    <p className="text-muted mb-0">{box.description}</p>
                </Col>
            </Row>
        </Container>
    )
}

export default function AllBox({ boxes, handleRowClick }: AllBoxProps) {
    return (
        <div>
            {boxes.map((box) => (
                <BoxItem key={box._id} box={box} handleRowClick={handleRowClick} />
            ))}
        </div>
    )
}