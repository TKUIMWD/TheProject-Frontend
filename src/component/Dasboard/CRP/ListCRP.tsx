import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastProvider";
import { getOptions } from "../../../utils/token";
import { superadmin_crp_api, user_api } from "../../../enum/api";
import { asyncGet } from "../../../utils/fetch";
import { ComputeResourcePlan } from "../../../interface/CRP/CRP";
import { Button, Card, CardGroup, ListGroup } from "react-bootstrap";
import { MBtoGB } from "../../../utils/StorageUnitsConverter";

export default function ListCRP() {
    const ImagePathBase = "/src/assets/images/CRP/crp_";
    const [crpData, setCRPData] = useState<ComputeResourcePlan[]>([]);
    const [userCRPData, setUserCRPData] = useState<ComputeResourcePlan | null>(null);
    const { showToast } = useToast();

    // get CRP data
    useEffect(() => {
        try {
            const options = getOptions();
            asyncGet(superadmin_crp_api.getAll, options)
                .then((response) => {
                    if (response && response.body) {
                        if (response.code === 200) {
                            setCRPData(response.body);
                        } else {
                            throw new Error(response.message || "取得 CRP 資料失敗");
                        }
                    }
                })
                .catch((error) => {
                    throw error;
                });
        } catch (error) {
            showToast("取得 CRP 資料失敗", "danger");
            console.error("取得 CRP 資料時發生錯誤：", error);
        }
    }, []);

    // get user CRP data
    useEffect(() => {
        try {
            const options = getOptions();
            asyncGet(user_api.getUserCRP, options)
                .then((res) => {
                    if (res === null || res.body === null) {
                        throw new Error("取得使用者 CRP 資料失敗");
                    }

                    if (res.code === 200) {
                        setUserCRPData(res.body);
                    } else {
                        throw new Error(res.message || "取得使用者 CRP 資料失敗");
                    }
                })
                .catch((error) => {
                    throw error;
                });
        } catch (error) {
            showToast("取得使用者 CRP 資料失敗", "danger");
            console.error("取得使用者 CRP 資料時發生錯誤：", error);
        }
    }, []);

    return (
        <div>
            <h3>訂閱資訊</h3>
            <hr />
            <div className="d-flex flex-column gap-3">
                <Card>
                    <Card.Body>
                        <Card.Title>CRP 訂閱方案</Card.Title>
                        <Card.Text>
                            您目前的 CRP 訂閱方案是：{userCRPData ? userCRPData.name : "無訂閱方案"}
                        </Card.Text>
                    </Card.Body>
                </Card>
                <CardGroup className="d-flex flex-wrap justify-content-center gap-4">
                    {crpData.length > 0 && crpData.map((item, index) => (
                        <Card className="" style={{ width: '17rem' }} key={index}>
                            <Card.Img variant="top" src={`${ImagePathBase}${index}.png`} />
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <hr />
                                <Card.Text>
                                    總計算用量限制：
                                    <ListGroup>
                                        <ListGroup.Item>CPU: {item.max_cpu_cores_sum} cores</ListGroup.Item>
                                        <ListGroup.Item>RAM: {MBtoGB(item.max_memory_sum)} GB</ListGroup.Item>
                                        <ListGroup.Item>Storage: {item.max_storage_sum} GB</ListGroup.Item>
                                    </ListGroup>
                                </Card.Text>
                                <Card.Text>
                                    單一 VM 用量限制：
                                    <ListGroup>
                                        <ListGroup.Item>CPU: {item.max_cpu_cores_per_vm} cores</ListGroup.Item>
                                        <ListGroup.Item>RAM: {MBtoGB(item.max_memory_per_vm)} GB</ListGroup.Item>
                                        <ListGroup.Item>Storage: {item.max_storage_per_vm} GB</ListGroup.Item>
                                    </ListGroup>
                                </Card.Text>
                                <Button className="w-100 btn-custom btn-light-blue">取得方案</Button>
                            </Card.Body>
                        </Card>
                    ))}
                </CardGroup>
            </div>
        </div>
    );
}
