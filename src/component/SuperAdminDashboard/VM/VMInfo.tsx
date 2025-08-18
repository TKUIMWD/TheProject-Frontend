import { useEffect, useState } from "react";
import { Breadcrumb, Table, ProgressBar, Button, Container, Row, Col } from "react-bootstrap";
import { useToast } from "../../../context/ToastProvider";
import { asyncGet } from "../../../utils/fetch";
import { vm_api } from "../../../enum/api";
import "../../../style/superAdmin/VM/VMInfo.css"

interface VMInfoProps {
    VM_id?: string;
    VM_name: string;
    VM_pve_node: string;
    showBreadcrumb: boolean;
}

interface VMStatus {
    status: string;
    uptime: string;
    resourceUsage: {
        cpu: number;
        memory: number;
    }
}

interface VMNetwork {
    interfaces: {
        ipAddresses: string[];
        macAddress: string;
        name: string;
    }[];
}

const progressBarColor: { min: number; max: number; variant: string }[] = [
    { min: 0, max: 59, variant: "success" },
    { min: 60, max: 79, variant: "warning" },
    { min: 80, max: 100, variant: "danger" }
];

export default function VMInfo({ VM_name, VM_id, VM_pve_node, showBreadcrumb }: VMInfoProps) {
    const SUPERADMIN_DASHBOARD_URL = "./dashboard?tab=MachineManagement"
    const [status, setStatus] = useState<VMStatus | null>(null);
    const [network, setNetwork] = useState<VMNetwork | null>(null);
    const { showToast } = useToast();

    const getProgressBarVariant = (value: number): string => {
        const found = progressBarColor.find((range) => value >= range.min && value <= range.max);
        return found ? found.variant : "success";
    };

    useEffect(() => {
        if (!VM_id) return; // 如果沒有 VM_id，就不要執行

        const token = localStorage.getItem("token");
        if (!token) {
            showToast("請先登入", "danger");
            return;
        }
        const headers = { Authorization: `Bearer ${token}` };

        const fetchStatusData = () => {
            asyncGet(`${vm_api.getVMStatus}?vm_id=${VM_id}`, { headers })
                .then((data) => {
                    if (data.code === 200) setStatus(data.body);
                    else console.error("無法獲取虛擬機狀態");
                })
                .catch((error) => console.error("Error fetching VM status:", error));
        };

        const fetchNetworkData = () => {
            asyncGet(`${vm_api.getVMNetworkInfo}?vm_id=${VM_id}`, { headers })
                .then((data) => {
                    if (data.code === 200) setNetwork(data.body);
                    else console.error("無法獲取虛擬機網路資訊");
                })
                .catch((error) => console.error("Error fetching VM network info:", error));
        };

        fetchStatusData();
        fetchNetworkData();
        const intervalId = setInterval(fetchStatusData, 5000);
        return () => clearInterval(intervalId);
    }, [VM_id, showToast]);

    const cpuUsage = status?.resourceUsage?.cpu ?? 0;
    const cpuSize = 2; //! temp 
    const cpuVariant = getProgressBarVariant(cpuUsage);

    const memoryUsage = status?.resourceUsage?.memory ?? 0;
    const memorySize = 4; //! temp
    const memoryVariant = getProgressBarVariant((memoryUsage / memorySize) * 100);

    return (
        <div className="vm-info-card">
            {showBreadcrumb && (
                <Breadcrumb>
                    <Breadcrumb.Item href={SUPERADMIN_DASHBOARD_URL}>機器總覽</Breadcrumb.Item>
                    <Breadcrumb.Item active>虛擬機資訊（{VM_name}）</Breadcrumb.Item>
                </Breadcrumb>
            )}
            <Container>
                <Row>
                    <Col lg={10}>
                        <h3>虛擬機資訊（{VM_name}）</h3>
                    </Col>
                    <Col lg={2}>
                        <Button variant="outline-success">詳細資訊</Button>
                    </Col>
                </Row>
            </Container>
            <hr />

            <div className="vm-status-area">
                <div className="status-row">
                    <span>狀態</span>
                    <span>{status?.status ?? '...'}</span>
                </div>
                <div className="status-row">
                    <span>Node</span>
                    <span>{VM_pve_node}</span>
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
                        {network?.interfaces?.map((iface, index) => (
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