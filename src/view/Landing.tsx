import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Landing() {
    return (
        <Container fluid className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white">
            <Row className="text-center">
                <Col>
                    <h1 className="display-3 fw-bold mb-4">Welcome to Our Platform</h1>
                    <p className="fs-5 mb-5">Experience a modern and sleek design with seamless navigation.</p>
                    <Button href="/login" variant="outline-light" size="lg" className="px-4 py-2">
                        Get Started
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}