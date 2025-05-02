import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Card, Spinner, Alert, Button } from "react-bootstrap";
import { asyncPost } from "../utils/fetch";
import { auth_api } from "../enum/api";
import "../style/email-verify.css";

export default function EmailVerify() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<"pending" | "success" | "fail">("pending");
    const [message, setMessage] = useState("驗證中，請稍候...");
    const [countdown, setCountdown] = useState(3);
    const token = searchParams.get("token");

    const verify = async () => {
        if (!token) {
            setStatus("fail");
            setMessage("驗證連結無效或缺少 token。");
            return;
        }
        try {
            const res = await asyncPost(
                auth_api.verify,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (res.code === 200) {
                setStatus("success");
                setMessage("信箱驗證成功，將自動返回首頁。");
            } else {
                setStatus("fail");
                setMessage(res.message || "驗證失敗，請稍後再試。");
            }
        } catch {
            setStatus("fail");
            setMessage("驗證過程發生錯誤，請稍後再試。");
        }
    };

    useEffect(() => {
        verify();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (status === "success") {
            const timer = setInterval(() => {
                setCountdown((c) => c - 1);
            }, 1000);
            const redirect = setTimeout(() => {
                navigate("/");
            }, 3000);
            return () => {
                clearInterval(timer);
                clearTimeout(redirect);
            };
        }
    }, [status, navigate]);

    return (
        <Container className="email-verify-container">
            <Card className="email-verify-card">
                <Card.Body className="text-center">
                    <Card.Title className="mb-4 fw-bold fs-3">信箱驗證</Card.Title>
                    {status === "pending" && (
                        <>
                            <Spinner animation="border" className="mb-3" />
                            <div className="fs-5">{message}</div>
                        </>
                    )}
                    {status === "success" && (
                        <>
                            <Alert variant="success" className="mb-3 fs-5">{message}</Alert>
                            <div className="text-muted mb-2">即將於 {countdown} 秒後返回首頁…</div>
                        </>
                    )}
                    {status === "fail" && (
                        <Alert variant="danger" className="mb-3 fs-5">{message}</Alert>
                    )}
                    <Button
                        variant="primary"
                        className="mt-3 w-100"
                        href="/"
                        disabled={status === "pending"}
                    >
                        回首頁
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
}