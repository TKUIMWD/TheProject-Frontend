import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/navbar.css";
import '../style/button/login-register-btn.css';
import NavBar from '../component/NavBar';
import LandingCarousel from '../component/LandingPage/LandingCarousel';
import AboutThePlatform from '../component/LandingPage/AboutThePlatform';
import ThePlatformFeature from '../component/LandingPage/ThePlatformFeature';
import Footer from '../component/Footer';

export enum LandingSectionId {
    About = "about",
    Features = "features",
    CoursesIntro = "courses-intro"
}

export default function Landing() {
    return (
        <Container fluid className="bg-light text-dark d-flex flex-column min-vh-100">
            <Row className="flex-grow-1">
                <Col>
                    <NavBar />
                    <LandingCarousel />
                    <div id={LandingSectionId.About}>
                        <AboutThePlatform />
                    </div>
                    <div id={LandingSectionId.Features}>
                        <ThePlatformFeature/>
                    </div>
                </Col>
            </Row>
            <Footer />
        </Container>
    );
}