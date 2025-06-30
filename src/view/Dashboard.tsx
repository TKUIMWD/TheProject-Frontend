import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import NavBar from "../component/NavBar";
import DashboardHeader from "../component/Dasboard/DashboardHeader";
import DashboardMenu from "../component/Dasboard/DashboardMenu";
import Profile from "../component/Dasboard/Profile";
import ChangePassword from "../component/Dasboard/ChangePassword";
import Footer from "../component/Footer";
import MyCourses from "../component/Dasboard/MyCourses";

export default function Dashboard() {
    const [activeKey, setActiveKey] = useState("Profile");

    return (
        <>
            <NavBar />
            <Container className="dashboard-container">
                <Row>
                    <Col lg={12}>
                        <DashboardHeader />
                    </Col>
                </Row>
                <Row>
                    <Col lg={3} >
                        <DashboardMenu activeKey={activeKey} setActiveKey={setActiveKey} />
                    </Col>
                    <Col lg={9}>
                        {activeKey === "Profile" && <Profile />}
                        {activeKey === "ChangePassword" && <ChangePassword />}
                        {activeKey === "MyCourses" && <MyCourses />}
                        {/*{activeKey === "MyMachines" && <MyMachines />}
                        {activeKey === "MySubscriptions" && <MySubscriptions />} */}
                    </Col>
                </Row>
            </Container>
            <Footer />
q         </>
    );
}