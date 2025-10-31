import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { Navbar, Container, Nav, Button, NavDropdown, Image } from "react-bootstrap";
import logout from "../utils/logout";
import LoginModal from "./modal/LoginModal";
import RegisterModal from "./modal/RegisterModal";
import { NavLink } from "react-router-dom";
import { useToast } from "../context/ToastProvider";
import "../style/navbar.css";
import "../style/button/button.css";
import { getAuthStatus } from "../utils/token";

export default function NavBar() {
    const icon = "/src/assets/CSTG_icon.png";
    const role = getAuthStatus();
    const { showToast } = useToast();
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

    const handleLogout = async () => {
        await logout(showToast);
    };

    return (
        <>
            <Navbar expand="lg" className="navbar-section" collapseOnSelect sticky="top">
                <Container>
                    <Navbar.Brand className="d-flex align-items-center justify-content-center me-auto brand-text">
                        <Image
                            src={icon}
                            className="icon"
                            roundedCircle
                        />
                        <span className="brand-text-primary">CS</span>TG
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="main-navbar-nav" />
                    <Navbar.Collapse id="main-navbar-nav">
                        {role !== "superadmin" && (
                            <div className="w-100 d-flex justify-content-center">
                                <Nav className="my-2 my-lg-0">
                                    <Nav.Link href="/" className="fw-bold">平台首頁</Nav.Link>
                                    <Nav.Link href="/boxResources" className="fw-bold">Box資源</Nav.Link>
                                    <Nav.Link href="/courseResources" className="fw-bold">課程資源</Nav.Link>
                                    <Nav.Link href="/attackAndDefence" className="fw-bold">攻防演練</Nav.Link>
                                </Nav>
                            </div>
                        )}
                        <Nav className="ms-lg-auto mt-2 mt-lg-0">
                            {username ? (
                                <NavDropdown
                                    title={`Hi, ${username}`}
                                    id="nav-dropdown-user"
                                    className="user-dropdown-toggle fw-bold text-dark"
                                >
                                    <NavDropdown.Item >
                                        <NavLink className="nav-dropdown-item" to={role === "superadmin" ? "/superadmin/dashboard" : "/dashboard"} end>
                                            Dashboard
                                        </NavLink>
                                    </NavDropdown.Item>

                                    <NavDropdown.Item className="nav-dropdown-item" onClick={handleLogout}>
                                        登出
                                    </NavDropdown.Item>
                                </NavDropdown>

                            ) : (
                                <div className="custom-btn-group">
                                    <Button
                                        className="btn-custom btn-light-blue"
                                        onClick={() => setShowLogin(true)}
                                    >
                                        登入
                                    </Button>
                                    <Button
                                        className="btn-custom btn-outline-light-blue"
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
        </>
    );
}