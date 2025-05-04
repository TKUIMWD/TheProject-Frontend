import { Container, Row, Col, Button, Nav, Navbar, Dropdown, Toast, ToastContainer } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import LoginModal from '../component/modal/LoginModal';
import RegisterModal from '../component/modal/RegisterModal';
import { jwtDecode } from "jwt-decode";
import "../style/navbar.css";
import logout from '../utils/logout';
import '../style/button/login-register-btn.css';

function LandingNavBar() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [username, setUsername] = useState<string | null>(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                return decoded.username || decoded.name || null;
            } catch {
                return null;
            }
        }
        return null;
    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastBg, setToastBg] = useState<"success" | "danger" | "secondary">("secondary");

    const handleLogout = async () => {
        await logout({
            setToastMessage,
            setShowToast,
        });
        setUsername(null);
        setToastBg("success");
    };

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand>The Project</Navbar.Brand>
                    <Nav className="ms-auto">
                        {username ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle
                                    variant="link"
                                    id="dropdown-user"
                                    className="p-0 fw-bold text-dark border-0 shadow-none"
                                    style={{ boxShadow: "none", fontSize: "1rem" }}
                                >
                                    Hi, {username}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={handleLogout}>登出</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <Button
                                className="login-register-btn"
                                onClick={() => setShowLogin(true)}
                            >
                                登入 | 註冊
                            </Button>
                        )}
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
                onLoginSuccess={uname => {
                    setUsername(uname);
                    setShowLogin(false);
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
            <ToastContainer position="top-center" className="p-3">
                <Toast bg={toastBg} show={showToast} onClose={() => setShowToast(false)} delay={2000} autohide>
                    <Toast.Body className="text-center text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
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