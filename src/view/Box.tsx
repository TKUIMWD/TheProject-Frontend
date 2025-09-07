import { Container, Row, Col } from "react-bootstrap";
import BoxHeader from "../component/Box/BoxHeader";
import { VM_Box_Info } from "../interface/VM/VM_Box";
import Loading from "../component/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import BoxContent from "../component/Box/BoxContent";
import BoxSidebar from "../component/Box/BoxSidebar";

export default function Box() {
    const location = useLocation();
    const navigate = useNavigate();

    // 從 location.state 中嘗試讀取 box 物件
    const box: VM_Box_Info | undefined = location.state?.box;

    // 處理邊界情況：如果沒有 box 資料，跳轉回列表頁
    useEffect(() => {
        if (!box) {
            console.error("沒有 Box 資料，將跳轉回列表頁。");
            // 使用 replace: true，這樣使用者的瀏覽紀錄中不會留下這個無效的頁面
            navigate('/boxResources', { replace: true });
        }
    }, [box, navigate]);

    if (!box) {
        return <Loading />;
    }

    return (
        <>
            <BoxHeader box={box} />
            <Container className="mt-5">
                <Row>
                    <Col lg={9}>
                        <BoxContent box={box} />
                    </Col>
                    <Col lg={3}>
                        <BoxSidebar box={box} />
                    </Col>
                </Row>
            </Container>
        </>
    );
}