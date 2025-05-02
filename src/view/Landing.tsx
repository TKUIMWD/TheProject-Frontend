import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

function LandingNavBar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">The Project</a>
                <button className="btn btn-outline-dark" onClick={() => window.location.href = '/login'}>
                    登入/註冊
                </button>
            </div>
        </nav>
    );
}

export default function Landing() {
    const [showModal, setShowModal] = useState(false);
    return (
        <Container fluid className="vh-100 bg-light text-dark">
            <Row>
                <Col>
                    <LandingNavBar />
                </Col>
            </Row>
        </Container>
    );
}