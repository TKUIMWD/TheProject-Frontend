import { Button, Col, Form, Row } from "react-bootstrap";
import { useToast } from "../../../context/ToastProvider";
import { useEffect, useState } from "react";
import { pve_api, user_api, vm_manage_api, vm_template_api } from "../../../enum/api";
import { asyncGet, asyncPost } from "../../../utils/fetch";
import { PVE_node } from "../../../interface/PVE/PVE";
import { ComputeResourcePlan } from "../../../interface/CRP/CRP";
import { GBtoMB, MBtoGB } from "../../../utils/StorageUnitsConverter";
import { VM_Template_Info } from "../../../interface/VM/VM_Template";
import VMTemplateList from "../VMTemplateManagement/TemplateList";
import { getOptions } from "../../../utils/token";

interface fromDataProps {
    template_id?: string;
    name: string;
    target: string;
    cpuCores: number;
    memorySize: number; // GB
    diskSize: number;
};

interface CreateVMFormProps {
    isUpdateMode: boolean;
    vmToUpdateId?: string;
}

const initialFormData: fromDataProps = {
    template_id: "",
    name: "",
    target: "",
    cpuCores: 0,
    memorySize: 0,
    diskSize: 0,
};

// 共用新增、更新 VM 的元件
export default function CreateVM({ isUpdateMode, vmToUpdateId }: CreateVMFormProps) {
    const [formData, setFormData] = useState<fromDataProps>(initialFormData);
    const [userCRP, setUserCRP] = useState<ComputeResourcePlan | null>(null);
    const [templates, setTemplates] = useState<VM_Template_Info[]>([]);
    const [nodeOptions, setNodeOptions] = useState<string[]>([]);
    const { showToast } = useToast();

    // fetch node list
    useEffect(() => {
        try {
            const options = getOptions();
            asyncGet(pve_api.getNodes, options)
                .then((res) => {
                    if (res.code === 200) {
                        setNodeOptions(res.body.map((node: { node: PVE_node }) => node.node));
                    } else {
                        throw new Error(res.message || "無法取得節點列表");
                    }
                })
                .catch((err) => {
                    showToast(err.message || "無法取得節點列表", "danger");
                    console.error("Error fetching nodes:", err);
                });
        } catch (error: any) {
            showToast(`無法獲取節點列表：${error.message}`, "danger");
            console.error("獲取節點列表時發生錯誤：", error);
        }
    }, []);

    // get compute resource plan
    useEffect(() => {
        try {
            const options = getOptions();
            asyncGet(user_api.getUserCRP, options)
                .then((res) => {
                    if (res.code === 200) {
                        setUserCRP(res.body);
                    } else {
                        throw new Error(res.message || "無法取得計算資源計畫");
                    }
                })
                .catch((err) => {
                    showToast(err.message || "無法取得計算資源計畫", "danger");
                    console.error("Error fetching compute resource plan:", err);
                });
        } catch (error: any) {
            showToast(`無法獲取計算資源計畫：${error.message}`, "danger");
            console.error("獲取計算資源計畫時發生錯誤：", error);
        }
    }, []);

    // get user's templates
    useEffect(() => {
        try {
            const options = getOptions();
            asyncGet(vm_template_api.getAccessibleTemplates, options)
                .then((res) => {
                    if (res.code === 200) {
                        setTemplates(res.body);
                    } else {
                        throw new Error(res.message || "無法取得使用者範本");
                    }
                })
                .catch((err) => {
                    showToast(err.message || "無法取得使用者範本", "danger");
                    console.error("Error fetching user templates:", err);
                });
        } catch (error: any) {
            showToast(`無法獲取使用者範本：${error.message}`, "danger");
            console.error("獲取使用者範本時發生錯誤：", error);
        }
    }, []);

    // 當是更新模式時，用傳入的資料填充表單
    useEffect(() => {
        try {
            const options = getOptions();
            if (isUpdateMode && vmToUpdateId) {
                asyncGet(`${pve_api.getQemuConfig}?id=${vmToUpdateId}`, options)
                    .then((res) => {
                        if (res.code === 200) {
                            setFormData({
                                name: res.body.name || "",
                                target: res.body.node || "",
                                cpuCores: res.body.cores || 0,
                                memorySize: MBtoGB(Number(res.body.memory)) || 0,
                                diskSize: res.body.disk_size || 0,
                            });
                        } else {
                            throw new Error(res.message || "無法取得虛擬機資訊");
                        }
                    })
                    .catch((err) => {
                        showToast(err.message || "無法取得虛擬機資訊", "danger");
                        console.error("Error fetching VM info:", err);
                    });
            }
        } catch (error: any) {
            showToast(`無法獲取 token：${error.message}`, "danger");
            console.error("獲取 token 時發生錯誤：", error);
        }
    }, [isUpdateMode, vmToUpdateId]);

    // 接收從子元件傳來的 template_id
    const handleTemplateSelect = (templateId: string) => {
        const selectedTemplate = templates.find(t => t._id === templateId);

        setFormData(prevFormData => ({
            ...prevFormData,
            template_id: templateId,
            cpuCores: selectedTemplate?.default_cpu_cores || prevFormData.cpuCores,
            memorySize: selectedTemplate ? MBtoGB(selectedTemplate.default_memory_size) : prevFormData.memorySize,
            diskSize: selectedTemplate?.default_disk_size || prevFormData.diskSize,
        }));
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        // 檢查欄位是否應為數字
        const isNumericField = ['CPU', 'memory', 'disk'].includes(name);

        // 如果是數字欄位，將值轉換為整數；否則保持為字串。
        const processedValue = isNumericField ? (parseInt(value, 10) || 0) : value;

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: processedValue
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (isUpdateMode) {
            handleUpdateVM();
        } else {
            handleCreateVM();
        }
    }

    const handleCreateVM = () => {
        try {
            const options = getOptions();
            const memoryInMB = GBtoMB(formData.memorySize);
            showToast("新增機器可能需要一些時間，請稍後", "info");
            asyncPost(vm_manage_api.createFromTemplate, {
                ...formData,
                memorySize: memoryInMB
            }, options)
                .then((res) => {
                    if (res.code === 200) {
                        showToast("成功新增機器\nVM_Id: " + res.body.vmid, "success");
                    } else {
                        throw new Error(res.message || "無法新增機器");
                    }
                })
                .catch((err) => {
                    showToast("無法新增機器：" + err.message, "danger");
                    console.error("Error creating VM:", err);
                });
        } catch (error: any) {
            showToast(`無法獲取 token：${error.message}`, "danger");
            console.error("獲取 token 時發生錯誤：", error);
        }
    };

    const handleUpdateVM = () => {
        try {
            const options = getOptions();
            const memoryInMB = GBtoMB(formData.memorySize);
            showToast("更新機器可能需要一些時間，請稍後", "info");
            const { template_id, ...payload } = formData;
            asyncPost(vm_manage_api.updateVMConfig, {
                vm_id: vmToUpdateId,
                ...payload,
                memorySize: memoryInMB
            }, options)
                .then((res) => {
                    if (res.code === 200) {
                        showToast("成功更新機器\nVM_id: " + res.body.pve_vmid, "success");
                    } else {
                        throw new Error(res.message || "無法更新機器");
                    }
                })
                .catch((err) => {
                    showToast("無法更新機器：" + err.message, "danger");
                    console.error("Error updating VM:", err);
                });
        } catch (error: any) {
            showToast(`無法獲取 token：${error.message}`, "danger");
            console.error("獲取 token 時發生錯誤：", error);
        }
    };

    return (
        <div className="mb-3">
            {!isUpdateMode && (
                <>
                    <h3>新增機器</h3>
                    <hr />
                </>
            )}
            <Form className="d-flex flex-column gap-3 bg-light p-4 rounded" onSubmit={handleSubmit}>
                {!isUpdateMode && (
                    <>
                        <Form.Label>選擇範本</Form.Label>
                        <div style={{
                            height: '300px',
                            overflowY: 'auto',
                            border: '1px solid #dee2e6',
                            borderRadius: '0.375rem',
                        }}>
                            <VMTemplateList isSelectMode={true} handleSelect={handleTemplateSelect} />
                        </div>
                    </>
                )}
                <Form.Group controlId="VMName">
                    <Form.Label>機器名稱</Form.Label>
                    <Form.Control
                        name="name"
                        value={formData?.name || ""}
                        onChange={handleChange}
                        type="text"
                        placeholder="請輸入機器名稱"
                    />
                </Form.Group>
                <Form.Group controlId="VMNode">
                    <Form.Label>節點</Form.Label>
                    <Form.Select
                        name="target"
                        value={formData?.target || ""}
                        onChange={handleChange}
                    >
                        <option value="" disabled>請選擇節點</option>
                        {nodeOptions.map((node) => (
                            <option key={node} value={node}>{node}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="CPU">
                        <Form.Label>CPU(核)</Form.Label>
                        <Form.Control
                            name="cpuCores"
                            value={formData?.cpuCores || 0}
                            onChange={handleChange}
                            as='input'
                            min={0}
                            max={userCRP?.max_cpu_cores_per_vm || 2} // standard max 2 cores
                            type="number"
                            placeholder="請輸入CPU大小"
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="Memory">
                        <Form.Label>記憶體(GB)</Form.Label>
                        <Form.Control
                            name="memorySize"
                            value={formData?.memorySize || 0}
                            onChange={handleChange}
                            as="input"
                            min={0}
                            max={MBtoGB(userCRP?.max_memory_per_vm) || 8} // standard max 8 GB
                            type="number"
                            placeholder="請輸入記憶體大小"
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="Disk">
                        <Form.Label>磁碟(GB)</Form.Label>
                        <Form.Control
                            name="diskSize"
                            value={formData?.diskSize || 0}
                            onChange={handleChange}
                            as="input"
                            min={0}
                            max={userCRP?.max_storage_per_vm || 60} // standard max 100 GB
                            type="number"
                            placeholder="請輸入磁碟大小"
                        />
                    </Form.Group>
                </Row>
                <Button className="align-self-start" variant="success" type="submit">
                    {isUpdateMode ? "更新機器" : "新增機器"}
                </Button>
            </Form>
        </div>
    )
}