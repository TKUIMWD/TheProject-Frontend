import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "../../style/landingPage/PlatformInfoSection.css";

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
        <Container id="about" className="my-5 platform-info-container">
            <div className="platform-info-title-row d-flex align-items-center mb-5">
                <div className="platform-info-title-bar me-3"></div>
                <h1 className="platform-info-title mb-0">關於平台</h1>
            </div>
            {imgsData.map((img, idx) => (
                <Row className="align-items-center mb-4 platform-info-row flex-row-reverse" key={idx}>
                    {/* 右側 icon */}
                    <Col md={5} className="text-center mb-3 mb-md-0">
                        <img
                            src={img.src}
                            alt={img.title}
                            className="platform-info-img"
                        />
                    </Col>
                    {/* 左側描述區塊 */}
                    <Col md={7} className="text-md-start text-center">
                        {img.description.map((desc, i) => (
                            <p className="platform-info-block-desc" key={i}>{desc}</p>
                        ))}
                    </Col>
                </Row>
            ))}
        </Container>
    )
};
