import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { Navbar, Container, Nav, Dropdown, Button, ToastContainer, Toast } from "react-bootstrap";
import logout from "../../utils/logout";
import LoginModal from "../modal/LoginModal";
import RegisterModal from "../modal/RegisterModal";

export default function LandingNavBar() {
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