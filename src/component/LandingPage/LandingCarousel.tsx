import { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import "../../style/landingPage/LandingCarousel.css";

interface CarouselImage {
    src: string;
    title: string;
    description: string[];
    captionPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
}

export default function LandingCarousel() {
    const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);

    const imgsDatajsonPath = "/assets/json/LandingPageCarousel_Images.json";

    useEffect(() => {
        fetch(imgsDatajsonPath)
            .then(res => res.json())
            .then(data => setCarouselImages(data))
            .catch(() => setCarouselImages([]));
    }, []);

    return (
        <Carousel interval={10000} fade className="landing-carousel">
            {carouselImages.map((img, idx) => (
                <Carousel.Item key={idx}>
                    <div className="carousel-img-wrapper">
                        <img
                            className="carousel-img"
                            src={img.src}
                            alt={img.title || `輪播圖片${idx + 1}`}
                        />
                        {(img.title || img.description) && (
                            <div className={`custom-carousel-caption ${img.captionPosition || "bottom-left"}`}>
                                {img.title && <h1>{img.title}</h1>}
                                {img.description && img.description.map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}