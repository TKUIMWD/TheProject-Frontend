import { Container, Row, Col, Button, Nav, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import LoginModal from '../component/modal/LoginModal';
import RegisterModal from '../component/modal/RegisterModal';

function LandingNavBar() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand>The Project</Navbar.Brand>
                    <Nav className="ms-auto">
                        <Button
                            variant="outline-dark"
                            onClick={() => setShowLogin(true)}
                        >
                            登入/註冊
                        </Button>
                    </Nav>
                </Container>
            </Navbar>
            <LoginModal
                show={showLogin}
                onHide={() => setShowLogin(false)}
                handleShowRegister={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                }}
            />
            <RegisterModal
                show={showRegister}
                onHide={() => setShowRegister(false)}
                handleShowLogin={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                }}
            />
        </>
    );
}

export default function Landing() {
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