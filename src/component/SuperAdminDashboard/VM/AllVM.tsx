import { Button, ButtonGroup, Carousel, Col, Container, Row, Table } from "react-bootstrap";
import { VMDetailWithBasicConfig } from "../../../interface/VM/VM";
import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastProvider";
import { asyncGet } from "../../../utils/fetch";
import { vm_api } from "../../../enum/api";
import "../../../style/superAdmin/VM/AllVM.css";
import VMInfo from "./VMInfo";

export default function AllMechine() {
    const [VMs, setVMs] = useState<VMDetailWithBasicConfig[] | null>(null);
    const [showCarousels, setShowCarousels] = useState<boolean>(true);
    const { showToast } = useToast();
    const [activeIndex, setActiveIndex] = useState(0); // 新增 state 來控制輪播索引

    // 輪播切換時更新索引的函式
    const handleSelect = (selectedIndex: number) => {
        setActiveIndex(selectedIndex);
    };

    const colorMap: { [key: string]: string } = {
        "running": "green",
        "stopped": "red"
    }

    const getStatusColor = (status: string) => {
        return colorMap[status];
    }

    useEffect(() => {
        const fetchData = () => {

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    showToast("請重新登入", "danger");
                }

                asyncGet(vm_api.getAllMachines, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then((res) => {
                    if (res.code === 200) {
                        setVMs(res.body);
                    } else {
                        showToast("取得VM資訊失敗", "danger");
                    }
                })
            } catch (error) {
                console.error("Error fetching VM data:", error);
                showToast("取得 VM 資訊失敗", "danger");
            }
        };
        fetchData();
        const intervalId = setInterval(fetchData, 5000);
        return () => {
            clearInterval(intervalId);
        };

    }, [showToast])

    const uptimeFormat = (time: number | undefined): { hour: number, min: number, sec: number } => {
        if ((time && time < 0) || time === undefined) {
            return { hour: 0, min: 0, sec: 0 };
        }
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return { hour: hours, min: minutes, sec: seconds };
    }

    // 輔助函式：渲染網格/輪播視圖
    const renderCarouselView = () => {
        // 1. 過濾出狀態為 'running' 的機器
        const runningVMs = VMs?.filter(vm => vm.status?.current_status === 'running');

        // 2. 如果沒有正在運行的機器，顯示提示訊息
        if (!runningVMs || runningVMs.length === 0) {
            return <p className="text-center">目前沒有正在運行的機器。</p>;
        }

        // 3. 映射陣列，為每台運行的機器渲染一個 VMInfo 元件
        return (
            <Carousel
                activeIndex={activeIndex}
                onSelect={handleSelect}
                interval={5000}
                indicators={false}
                variant="dark"
            >
                {runningVMs.map((vm) => (
                    <Carousel.Item key={vm._id}>
                        <Row className="justify-content-center">
                            <Col lg={8} md={10}>
                                <VMInfo
                                    VM_id={vm._id}
                                    VM_name={vm.pve_vmid.toString()}
                                    VM_pve_node={vm.pve_node}
                                    showBreadcrumb={false}
                                />
                            </Col>
                        </Row>
                    </Carousel.Item>
                ))}
            </Carousel>
        );
    };

    return (
        <Container fluid className="all-vm-container">
            <Row>
                <Col style={{ padding: '1rem' }}>
                    <h3>機器總覽</h3>
                    <ButtonGroup>
                        <Button
                            variant={showCarousels ? "secondary" : "outline-secondary"}
                            onClick={() => setShowCarousels(true)}
                        >
                            <i className="bi bi-grid"></i>
                        </Button>
                        <Button
                            variant={!showCarousels ? "secondary" : "outline-secondary"}
                            onClick={() => setShowCarousels(false)}
                        >
                            <i className="bi bi-list-ul"></i>
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
            <hr />
            {showCarousels ?
                renderCarouselView()
                :
                <Table hover>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>pve_vmid</th>
                            <th>pve_node</th>
                            <th>owner</th>
                            <th>status</th>
                            <th>uptime</th>
                        </tr>
                    </thead>
                    <tbody>
                        {VMs?.map((mechine) => {
                            const time = uptimeFormat(mechine.status?.uptime);
                            return (
                                <tr key={mechine._id}>
                                    <td>{mechine._id}</td>
                                    <td>{mechine.pve_vmid}</td>
                                    <td>{mechine.pve_node}</td>
                                    <td>{mechine.owner}</td>
                                    <td><i className="bi bi-record-fill" style={{ color: getStatusColor(mechine.status?.current_status ?? "") }}></i>{mechine.status?.current_status}</td>
                                    <td>{time.hour}:{time.min}:{time.sec}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            }
        </Container >
    );
}