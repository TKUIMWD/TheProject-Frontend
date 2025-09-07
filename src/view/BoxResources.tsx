import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { VM_Box_Info } from "../interface/VM/VM_Box";
import { getOptions } from "../utils/token";
import { asyncGet } from "../utils/fetch";
import { box_api } from "../enum/api";
import { useToast } from "../context/ToastProvider";
import AllBox from "../component/BoxResource/AllBox";
import { useNavigate } from "react-router-dom";
import Loading from "../component/Loading";

export default function BoxResources() {
    const [boxes, setBoxes] = useState<VM_Box_Info[]>()
    const { showToast } = useToast();
    const navigate = useNavigate();

    // get public box
    useEffect(() => {
        try {
            const options = getOptions();
            asyncGet(box_api.getPublicBoxes, options)
                .then((res) => {
                    if (res.code === 200) {
                        setBoxes(res.body);
                    } else {
                        throw new Error(res.message || "無法取得 Box 資源");
                    }
                })
                .catch((err) => {
                    showToast(`無法取得 Box 資源: ${err.message}`, "danger");
                    console.error(`無法取得 Box 資源: ${err.message}`);
                });
        } catch (error: any) {
            showToast(`無法取得 Box 資源: ${error.message}`, "danger");
            console.error(`無法取得 Box 資源: ${error.message}`);
        }
    }, [])

    // 導航到詳細頁面，並透過 state 傳遞整個 box 物件
    const handleBoxClick = (box: VM_Box_Info): void => {
        navigate(`/box/${box._id}`, { state: { box: box } });
    };

    return (
        <Container>
            <Row>
                <Col className="container mx-auto my-5">
                    <h1 className="text-4xl font-bold mb-4">Box資源</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div>
                        {boxes ?
                            <AllBox boxes={boxes} handleRowClick={handleBoxClick} /> :
                            <Loading />
                        }
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
