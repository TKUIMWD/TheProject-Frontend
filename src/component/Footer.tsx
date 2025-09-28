import { Container, Row, Col } from 'react-bootstrap';
import '../style/Footer.css';

export default function Footer() {
    return (
        <footer className="footer-section mt-5 pt-3 pb-3">
            <Container>
                <Row className="justify-content-center mt-2">
                    <Col md={6} className="text-center">
                        <span className="footer-powered">
                            <span className='footer-highlight footer-light-blue'>
                                CS
                            </span>
                            <span className='footer-highlight footer-light-gray'>
                                TG{' '}    
                            </span> 
                            is powered by{' '}
                            <span className='footer-highlight footer-light-blue'>
                                WD Team
                            </span>{' '}
                            {new Date().getFullYear()}
                        </span>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}