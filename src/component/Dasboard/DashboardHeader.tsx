import { Container, Row, Col } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import { user_api } from '../../enum/api';
import { asyncGet } from '../../utils/fetch';
import '../../style/dashboard/DashboardHeader.css';
import defaultAvatarImg from '../../assets/images/Dashboard/default-avatar.jpg';


export default function DashboardHeader() {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [avatarPath, setAvatarPath] = useState<string>(defaultAvatarImg);
    const cache = useRef<boolean>(false);

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

    useEffect(() => {
        if (!cache.current) {
            cache.current = true;
            const token = localStorage.getItem('token');
            asyncGet(user_api.getProfile, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((res) => {
                if (res.code === 200){
                    setUsername(res.body.username || '');
                    setEmail(res.body.email || '');
                    setAvatarPath(processAvatarPath(res.body.avatar_path));
                }
            });
        }
    }, []);

    return (
        <>
            <div className="dashboard-green-area"></div>
            <Container className="dashboard-header">
                <Row>
                    <Col lg={1} className="d-flex align-items-center justify-content-center">
                        <img 
                            src={avatarPath} 
                            alt="user-avatar" 
                            width={75} 
                            height={75}
                            style={{ objectFit: 'cover' }}
                            className="rounded-circle"
                            onError={(e) => {
                                // 如果頭像載入失敗，使用預設頭像
                                const target = e.target as HTMLImageElement;
                                target.src = defaultAvatarImg;
                            }}
                        />
                    </Col>
                    <Col lg={2}>
                        <h3>{username}</h3>
                        <h5>{email}</h5>
                    </Col>
                </Row>
            </Container>
        </>
    );
}