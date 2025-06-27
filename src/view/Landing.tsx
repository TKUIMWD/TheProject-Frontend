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
        <Container fluid className="bg-light text-dark px-0">
            <Row>
                <Col>
                    <NavBar />
                    <LandingCarousel />
                    <div id={LandingSectionId.About} style={{ scrollMarginTop: 70 }}>
                        <AboutThePlatform />
                    </div>
                    <div id={LandingSectionId.Features} style={{ scrollMarginTop: 70 }}>
                        <ThePlatformFeature/>
                    </div>
                    <Footer />
                </Col>
            </Row>
        </Container>
    );
}