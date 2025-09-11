import { Container, Row, Col } from 'react-bootstrap';
import LandingCarousel from '../component/LandingPage/LandingCarousel';
import AboutThePlatform from '../component/LandingPage/AboutThePlatform';
import ThePlatformFeature from '../component/LandingPage/ThePlatformFeature';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getAuthStatus } from '../utils/token';
import 'bootstrap/dist/css/bootstrap.min.css';

export enum LandingSectionId {
    About = "about",
    Features = "features",
    CoursesIntro = "courses-intro"
}

export default function Landing() {
    const navigate = useNavigate();

    useEffect(() => {
        // 獲取當前使用者的角色
        const role = getAuthStatus();

        // 判斷：如果角色存在，就進行重導向
        if (role && role === 'superadmin') {
            // 如果是 superadmin，導向 superadmin 的儀表板
            navigate('/dashboard', { replace: true });
        }
        // 如果 role 不存在 (未登入)，則不執行任何操作，繼續顯示 Landing 頁面
    }, [navigate]);

    return (
        <Container fluid className="bg-light text-dark d-flex flex-column min-vh-100">
            <Row className="flex-grow-1">
                <Col>
                    <LandingCarousel />
                    <div id={LandingSectionId.About}>
                        <AboutThePlatform />
                    </div>
                    <div id={LandingSectionId.Features}>
                        <ThePlatformFeature />
                    </div>
                </Col>
            </Row>
        </Container>
    );
}