import { Container, Row, Col } from 'react-bootstrap';
import '../style/Footer.css';

export default function Footer() {
    return (
        <footer className="footer-section mt-5 pt-3 pb-3">
            <Container>
                <Row className="justify-content-center mt-2">
                    <Col md={6} className="text-center">
                        <span className="footer-powered">
                            TheProject is powered by{' '}
                            <a href="https://github.com/TKUIMWD" target="_blank" rel="noopener noreferrer">
                                TKUIMWD
                            </a>{' '}
                            {new Date().getFullYear()}
                        </span>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}