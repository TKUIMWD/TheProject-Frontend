import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/navbar.css";
import '../style/button/login-register-btn.css';
import LandingNavBar from '../component/LandingPage/LandingNavBar';
import LandingCarousel from '../component/LandingPage/LandingCarousel';
import AboutThePlatform from '../component/LandingPage/AboutThePlatform';
import ThePlatformFeature from '../component/LandingPage/ThePlatformFeature';
import Footer from '../component/Footer';

export default function Landing() {
    return (
        <Container fluid className="bg-light text-dark">
            <Row>
                <Col>
                    <LandingNavBar />
                    <LandingCarousel />
                    <div id="about">
                        <AboutThePlatform />
                    </div>
                    <div id="features">
                        <ThePlatformFeature/>
                    </div>
                    <Footer />
                </Col>
            </Row>
        </Container>
    );
}