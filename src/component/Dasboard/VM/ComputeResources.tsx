import { Card, Container, Row, Col, ProgressBar } from "react-bootstrap";
import { getProgressBarVariant } from "../../../utils/ProgressBarColor";
import { useEffect, useState } from "react";
import { asyncGet } from "../../../utils/fetch";
import { useToast } from "../../../context/ToastProvider";
import { pve_api, user_api, vm_api } from "../../../enum/api";
import { ComputeResourcePlan } from "../../../interface/CRP/CRP";
import { VMDetailedConfig, VMDetailWithBasicConfig } from "../../../interface/VM/VM";
import { MBtoGB } from "../../../utils/StorageUnitsConverter";
import { getOptions } from "../../../utils/token";

interface ResourceCardProps {
    icon: string;
    title: string;
    unit?: string;
    currentUsage: number;
    maxUsage: number;
}

interface ResourceUsage {
    cpu: number;
    memory: number;
    disk: number;
    vm_count: number;
}

function ResourceCard({ icon, title, unit, currentUsage, maxUsage }: ResourceCardProps) {
    const usagePercentage = (currentUsage / maxUsage) * 100;

    return (
        <Card style={{ width: '100%' }}>
            <Card.Body>
                <Card.Title>
                    <span><i className={icon} /> {title} {unit && `(${unit})`}</span>
                </Card.Title>
                <Card.Text>
                    <p>
                        {`當前使用量: ${currentUsage} ${unit ? unit : ''}`}
                    </p>
                    <p>
                        {`最大使用量: ${maxUsage} ${unit ? unit : ''}`}
                    </p>
                    <ProgressBar
                        variant={getProgressBarVariant(usagePercentage)}
                        now={usagePercentage}
                    />
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default function ComputeResources() {
    const [userCRP, setUserCRP] = useState<ComputeResourcePlan>(
        { name: "", max_cpu_cores_per_vm: 0, max_memory_per_vm: 0, max_storage_per_vm: 0, max_cpu_cores_sum: 0, max_memory_sum: 0, max_storage_sum: 0, max_vms: 0 }
    );
    const [userVMIds, setUserVMIds] = useState<string[]>([]);
    const [ResourceCurrentUsage, setResourceCurrentUsage] = useState<ResourceUsage>(
        { cpu: 0, memory: 0, disk: 0, vm_count: 0 }
    );
    const { showToast } = useToast();

    // GET user CRP
    useEffect(() => {
        try {
            const options = getOptions();
            asyncGet(user_api.getUserCRP, options)
                .then((res) => {
                    if (res.code === 200) {
                        const crpData = res.body;
                        setUserCRP({
                            ...crpData,
                            max_memory_sum: MBtoGB(Number(crpData.max_memory_sum)),
                        });
                    } else {
                        throw new Error(res.message || "無法取得使用者計算資源方案");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user CRP:", error);
                    showToast(error.message, "danger");
                });
        } catch (error) {
            showToast(`無法取得使用者計算資源方案：${error}`, "danger");
            console.error("Error fetching user CRP:", error);
            return;
        }
    }, []);

    // get user vm ids
    useEffect(() => {
        try {
            const options = getOptions();
            asyncGet(vm_api.getUsersOwnedVMs, options)
                .then((res) => {
                    if (res.code === 200) {
                        setUserVMIds(res.body.map((vm: VMDetailWithBasicConfig) => vm._id));
                    } else {
                        throw new Error(res.message || "無法取得使用者虛擬機");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user VM:", error);
                    showToast(error.message, "danger");
                });
        } catch (error) {
            showToast(`無法取得使用者虛擬機：${error}`, "danger");
            console.error("Error fetching user VM:", error);
            return;
        }
    }, [])

    // get all vm usage, and calculate current resource usage
    useEffect(() => {
        if (userVMIds.length === 0) {
            setResourceCurrentUsage({ cpu: 0, memory: 0, disk: 0, vm_count: 0 });
            return;
        }

        const fetchAllVmUsage = async () => {
            try {
                const options = getOptions();
                const promises = userVMIds.map(vmId =>
                    asyncGet(`${pve_api.getQemuConfig}?id=${vmId}`, { ...options })
                );
                const results = await Promise.all(promises);

                const totalUsage = results.reduce((acc, res) => {
                    if (res.code === 200) {
                        const usage: VMDetailedConfig = res.body;
                        acc.cpu += usage.cores ?? 0;
                        acc.memory += MBtoGB(Number(usage.memory));
                        acc.disk += usage.disk_size ?? 0;
                    } else {
                        console.error(`Error fetching VM usage: ${res.message}`);
                    }
                    return acc;
                }, { cpu: 0, memory: 0, disk: 0, vm_count: userVMIds.length });

                setResourceCurrentUsage(totalUsage);
            } catch (error: any) {
                console.error("Error fetching VM usage:", error);
                showToast(error.message || "無法取得虛擬機使用情況", "danger");
            }
        };

        fetchAllVmUsage();
    }, [userVMIds]);

    const ResourceList: ResourceCardProps[] = [
        {
            icon: "bi bi-cpu",
            title: "CPU",
            unit: "核",
            currentUsage: ResourceCurrentUsage.cpu,
            maxUsage: userCRP.max_cpu_cores_sum,
        },
        {
            icon: "bi bi-memory",
            title: "Memory",
            unit: "GB",
            currentUsage: ResourceCurrentUsage.memory,
            maxUsage: userCRP.max_memory_sum,
        },
        {
            icon: "bi bi-floppy",
            title: "Disk",
            unit: "GB",
            currentUsage: ResourceCurrentUsage.disk,
            maxUsage: userCRP.max_storage_sum,
        },
        {
            icon: "bi bi-laptop",
            title: "VM",
            unit: "台",
            currentUsage: ResourceCurrentUsage.vm_count,
            maxUsage: userCRP.max_vms,
        },
    ];

    return (
        <>
            <h3>計算資源</h3>
            <hr />
            <Container>
                <Row xs={1} md={2} className="g-4">
                    {ResourceList.map((card: ResourceCardProps, index: number) => (
                        <Col key={index}>
                            <ResourceCard
                                icon={card.icon}
                                title={card.title}
                                unit={card.unit}
                                currentUsage={card.currentUsage}
                                maxUsage={card.maxUsage}
                            />
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
}
