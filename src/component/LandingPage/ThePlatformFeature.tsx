import { Card, Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import "../../style/landingPage/ThePlatformFeature.css";

interface ThePlatformFeatureImage {
    src: string;
    title: string;
    description: string;
}

export default function ThePlatformFeature() {
    const [imgsData, setImgsData] = useState<ThePlatformFeatureImage[]>([]);
    const imgsDatajsonPath = "/assets/json/ThePlatformFeature.json";

    useEffect(() => {
        fetch(imgsDatajsonPath)
            .then(res => res.json())
            .then(data => setImgsData(data))
            .catch(() => setImgsData([]));
    }, []);

    return (
        <>
            <Container id="features" className="my-5 platform-info-container">
                <div className="platform-info-title-row d-flex align-items-center mb-5">
                    <div className="platform-info-title-bar me-3"></div>
                    <h1 className="platform-info-title mb-0">平台特色</h1>
                </div>
            </Container>
            <div className="platform-feature-grid">
                {imgsData.map((img, index) => (
                    <Card key={index} className="platform-feature-card">
                        <Card.Img variant="top" src={img.src} className="platform-feature-img" />
                        <Card.Body>
                            <Card.Title className="platform-feature-title">{img.title}</Card.Title>
                            <Card.Text className="platform-feature-description">
                                {img.description}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </>
    )
}