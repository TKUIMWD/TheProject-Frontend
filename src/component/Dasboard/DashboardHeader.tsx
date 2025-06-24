import { Container, Row, Col } from 'react-bootstrap';
import '../../style/dashboard/DashboardHeader.css';

export default function DashboardHeader() {
    return (
        <>
        <Container className="dashboard-container">
                <Row>
                    <Col lg={12}>
                        <div className="dashboard-green-area"></div>
                        <Container className="dashboard-header">
                            <Row className="dashboard-header-img">
                                <Col lg={1}>
                                    <img src="src/assets/images/Dashboard/user.png" alt="user-image" width={80}/>
                                </Col>
                                <Col lg={3}>
                                    <h2>zzy</h2>
                                    <h4>zzy@example.com</h4>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </>
    );
}