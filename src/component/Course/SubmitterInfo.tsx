import { Col, Container, Row, Spinner } from "react-bootstrap";
import defaultAvatarImg from '../../assets/images/Dashboard/default-avatar.jpg';
import '../../style/course/SubmitterInfo.css';
import { CoursePageDTO } from "../../interface/Course/CoursePageDTO";
import { useEffect, useState } from "react";

export default function SubmitterInfo(courseData: CoursePageDTO) {

    const [avatarUrl, setAvatarUrl] = useState<string>(defaultAvatarImg);
    const [loading, setLoading] = useState(true);

    // 處理頭像路徑的輔助函數
    function processAvatarPath(avatarPath: string | null | undefined): string {
        if (!avatarPath || avatarPath === "/uploads/avatars/default-avatar.jpg") {
            return defaultAvatarImg;
        }

        // 如果已經是完整URL，直接返回
        if (avatarPath.startsWith('http')) {
            return avatarPath;
        }

        // 否則組合後端基礎URL
        return `${import.meta.env.VITE_BACKEND_BASE_URL}${avatarPath}`;
    }

    const submitterInfoProps = {
        username: courseData.submitterInfo.username,
        email: courseData.submitterInfo.email,
        avatarPath: courseData.submitterInfo.avatar_path
    };

    useEffect(() => {
        setAvatarUrl(processAvatarPath(submitterInfoProps.avatarPath));
        setLoading(false);
    }, [])

    return (
        <>
            <Container className="submitter-info">
                <Row>
                    <Col lg={3} className="d-flex align-items-center justify-content-center">
                        <div>
                            {loading ? (
                                <div className="avatar-loading">
                                    <Spinner animation="border" size="sm" />
                                </div>
                            ) : (
                                <img
                                    src={avatarUrl}
                                    alt="user-avatar"
                                    className="rounded-circle"
                                    width={70}
                                    height={70}
                                    style={{ objectFit: 'cover' }}
                                    onError={(e) => {
                                        // 如果頭像載入失敗，使用預設頭像
                                        const target = e.target as HTMLImageElement;
                                        target.src = defaultAvatarImg;
                                    }}
                                />
                            )}
                        </div>
                    </Col>
                    <Col lg={9}>
                        <h5>{submitterInfoProps.username}</h5>
                        <p>{submitterInfoProps.email}</p>
                    </Col>
                </Row>
            </Container>
        </>
    );
}