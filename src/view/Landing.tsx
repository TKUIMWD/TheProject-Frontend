import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/navbar.css";
import '../style/button/login-register-btn.css';
import LandingNavBar from '../component/LandingPage/LandingNavBar';
import LandingCarousel from '../component/LandingPage/LandingCarousel';


export default function Landing() {
    return (
        <Container fluid className="vh-100 bg-light text-dark">
            <Row>
                <Col>
                    <LandingNavBar />
                    <LandingCarousel />
                </Col>
            </Row>
        </Container>
    );
}