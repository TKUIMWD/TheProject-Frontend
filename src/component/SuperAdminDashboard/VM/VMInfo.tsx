import { useEffect, useState } from "react";
import { Table, ProgressBar, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useToast } from "../../../context/ToastProvider";
import { asyncGet } from "../../../utils/fetch";
import { pve_api, vm_api } from "../../../enum/api";
import { VMInfoProps, VMStatus, VMNetwork } from "../../../interface/VM/VM";
import { useVMDetail } from "../../../context/VMDetailContext"; // 引入自訂 Hook
import "../../../style/superAdmin/VM/VMInfo.css";
import { getProgressBarVariant } from "../../../utils/ProgressBarColor";

export default function VMInfo(props: VMInfoProps) {
    // 嘗試從 Context 獲取資料
    const contextData = useVMDetail();
    const { subscribe, unsubscribe } = contextData || {};

    useEffect(() => {
        // 只有當此分頁為作用中，且 subscribe 函式存在時，才訂閱
        if (props.isActive && subscribe) {
            subscribe();
        }
        // 清理函式會在 isActive 變為 false 或元件卸載時執行
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [props.isActive, subscribe, unsubscribe]);

    // 如果 contextData 存在，使用 Context 的資料；否則，使用 props 的資料。
    const isContextMode = !!contextData;
    const vmId = isContextMode ? contextData.vmDetail?._id : props.VM_id;
    const vmName = isContextMode ? contextData.vmDetail?.pve_name : props.VM_name;
    const vmNode = isContextMode ? contextData.vmDetail?.pve_node : props.VM_pve_node;

    // 狀態管理：只有在非 Context 模式下才需要自己管理狀態
    const [status, setStatus] = useState<VMStatus | null>(null);
    const [network, setNetwork] = useState<VMNetwork | null>(null);
    const [cpuMax, setCpuMax] = useState<number | null>(1);
    const [memoryMax, setMemoryMax] = useState<number | null>(1);
    const { showToast } = useToast();

    // 資料獲取：只有在非 Context 模式下才需要自己獲取資料
    useEffect(() => {
        // 如果是 Context 模式，或沒有 vmId，就直接返回
        if (isContextMode || !vmId) return;

        const token = localStorage.getItem("token");
        if (!token) {
            showToast("請先登入", "danger");
            return;
        }
        const headers = { Authorization: `Bearer ${token}` };

        // 獲取cpu, memory 最大用量
        asyncGet(`${pve_api.getQemuConfig}?id=${vmId}`, { headers })
            .then(data => {
                if (data.code === 200) {
                    const { cores, memory } = data.body;
                    const memoryInGB = memory / 1024;
                    setCpuMax(cores);
                    setMemoryMax(memoryInGB);
                }
            });

        const fetchStatusData = () => {
            asyncGet(`${vm_api.getVMStatus}?vm_id=${vmId}`, { headers })
                .then((data) => data.code === 200 && setStatus(data.body));
        };
        const fetchNetworkData = () => {
            asyncGet(`${vm_api.getVMNetworkInfo}?vm_id=${vmId}`, { headers })
                .then((data) => data.code === 200 && setNetwork(data.body));
        };

        fetchStatusData();
        fetchNetworkData();
        const intervalId = setInterval(fetchStatusData, 5000);
        return () => clearInterval(intervalId);
    }, [vmId, isContextMode]);

    // 決定最終要顯示的狀態資料
    const finalStatus = isContextMode ? contextData.status : status;
    const finalNetwork = isContextMode ? contextData.network : network;

    const cpuUsage = finalStatus?.resourceUsage?.cpu ?? 0;
    const cpuSize = isContextMode ? contextData.cpuMax : cpuMax ?? 1; // 預設為 1 避免除以 0
    const cpuVariant = getProgressBarVariant(cpuUsage);

    const memoryUsage = finalStatus?.resourceUsage?.memory ?? 0;
    const memorySize = (isContextMode ? contextData.memoryMax : memoryMax) ?? 1; // 預設為 1 避免除以 0
    const memoryVariant = getProgressBarVariant((memoryUsage / memorySize) * 100);

    return (
        <div className="vm-info-card">
            <Container>
                <Row>
                    <Col lg={10}>
                        <h3>虛擬機：{vmName}</h3>
                    </Col>
                    {!isContextMode && (
                        <Col lg={2} className="text-end">
                            <Link to={`/vmDetail/${vmId}`}>
                                <Button variant="outline-success">詳細資訊</Button>
                            </Link>
                        </Col>
                    )}
                </Row>
            </Container>
            <hr />
            <div className="vm-status-area">
                <div className="status-row">
                    <span>狀態</span>
                    <span>{finalStatus?.status ?? '...'}</span>
                </div>
                <div className="status-row">
                    <span>Node</span>
                    <span>{vmNode ?? '...'}</span>
                </div>
                <div className="status-row">
                    <span>CPU 狀態</span>
                    <span>{cpuUsage.toFixed(2)} % of {cpuSize} CPU</span>
                </div>
                <div className="progress-container">
                    <ProgressBar variant={cpuVariant} min={0} max={100} now={cpuUsage} />
                </div>
                <div className="status-row">
                    <span>記憶體狀態</span>
                    <span>{memoryUsage.toFixed(2)} GB of {memorySize} GB</span>
                </div>
                <div className="progress-container">
                    <ProgressBar variant={memoryVariant} min={0} max={memorySize} now={memoryUsage} />
                </div>
            </div>
            <div className="vm-network-area">
                <h5>網路資訊</h5>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>MAC Address</th>
                            <th>IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {finalNetwork?.interfaces?.map((iface, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{iface.name}</td>
                                <td>{iface.macAddress}</td>
                                <td>{iface.ipAddresses?.join(", ")}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}