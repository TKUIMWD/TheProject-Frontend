import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { Navbar, Container, Nav, Button, ToastContainer, Toast, NavDropdown } from "react-bootstrap";
import logout from "../utils/logout";
import LoginModal from "./modal/LoginModal";
import RegisterModal from "./modal/RegisterModal";
import "../style/navbar.css";
import { NavLink } from "react-router-dom";

export default function NavBar() {
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
            <Navbar bg="light" expand="lg" className="navbar-section" collapseOnSelect sticky="top">
                <Container>
                    <Navbar.Brand className="me-auto brand-text"><span className="brand-text-primary">The</span> Project</Navbar.Brand>
                    <Navbar.Toggle aria-controls="main-navbar-nav" />
                    <Navbar.Collapse id="main-navbar-nav">
                        <div className="w-100 d-flex justify-content-center">
                            <Nav className="my-2 my-lg-0">
                                <Nav.Link href="/" className="fw-bold">平台首頁</Nav.Link>
                                <Nav.Link href="/" className="fw-bold">機器範本</Nav.Link>
                                <Nav.Link href="/" className="fw-bold">課程資源</Nav.Link>
                            </Nav>
                        </div>
                        <Nav className="ms-lg-auto mt-2 mt-lg-0">
                            {username ? (
                                <NavDropdown
                                    title={`Hi, ${username}`}
                                    id="nav-dropdown-user"
                                    align="end"
                                    className="user-dropdown-toggle fw-bold text-dark"
                                >
                                    <NavDropdown.Item >
                                        <NavLink className="nav-dropdown-item" to="/dashboard" end>
                                            Dashboard
                                        </NavLink>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={handleLogout}>登出</NavDropdown.Item>
                                </NavDropdown>

                            ) : (
                                <div className="login-register-btn-group">
                                    <Button
                                        className="login-register-btn me-2"
                                        onClick={() => setShowLogin(true)}
                                    >
                                        登入
                                    </Button>
                                    <Button
                                        className="login-register-btn register"
                                        onClick={() => setShowRegister(true)}
                                    >
                                        註冊
                                    </Button>
                                </div>
                            )}
                        </Nav>
                    </Navbar.Collapse>
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