import { Container, Row, Col } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import { user_api } from '../../enum/api';
import { asyncGet } from '../../utils/fetch';
import '../../style/dashboard/DashboardHeader.css';


export default function DashboardHeader() {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const cache = useRef<boolean>(false);

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
                }
            });
        }
    }, []);

    return (
        <>
            <div className="dashboard-green-area"></div>
            <Container className="dashboard-header">
                <Row>
                    <Col lg={1}>
                        <img src="src/assets/images/Dashboard/user.png" alt="user-image" width={75} />
                    </Col>
                    <Col lg={3}>
                        <h3>{username}</h3>
                        <h5>{email}</h5>
                    </Col>
                </Row>
            </Container>
        </>
    );
}