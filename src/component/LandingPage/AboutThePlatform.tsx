import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "../../style/landingPage/AboutThePlatform.css";

interface AboutThePlatformImage {
    src: string;
    title: string;
    description: string[];
}

export default function AboutThePlatform() {
    const [imgsData, setImgsData] = useState<AboutThePlatformImage[]>([]);
    const imgsDatajsonPath = "/assets/json/AboutThePlatform.json";

    useEffect(() => {
        fetch(imgsDatajsonPath)
            .then(res => res.json())
            .then(data => setImgsData(data))
            .catch(() => setImgsData([]));
    }, []);

    return (
        <Container className="my-5 about-platform-container">
            <div className="about-platform-title-row d-flex align-items-center mb-5">
                <div className="about-platform-title-bar me-3"></div>
                <h1 className="about-platform-title mb-0">關於平台</h1>
            </div>
            {imgsData.map((img, idx) => (
                <Row className="align-items-center mb-4 about-platform-row flex-row-reverse" key={idx}>
                    {/* 右側 icon */}
                    <Col md={5} className="text-center mb-3 mb-md-0">
                        <img
                            src={img.src}
                            alt={img.title}
                            className="about-platform-img img-fluid"
                        />
                    </Col>
                    {/* 左側描述區塊 */}
                    <Col md={7} className="text-md-start text-center">
                        <div className="d-flex align-items-center mb-2">
                            <div className="about-platform-block-bar me-2"></div>
                            <h2 className="about-platform-block-title mb-0">{img.title}</h2>
                        </div>
                        {img.description.map((desc, i) => (
                            <p className="about-platform-block-desc" key={i}>{desc}</p>
                        ))}
                    </Col>
                </Row>
            ))}
        </Container>
    )
};
