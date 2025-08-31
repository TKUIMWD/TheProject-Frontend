import { useEffect, useState } from "react";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { vm_api, vm_template_api } from "../../../enum/api";
import { useToast } from "../../../context/ToastProvider";
import { asyncGet, asyncPost } from "../../../utils/fetch";
import { VMDetailWithBasicConfig } from "../../../interface/VM/VM";
import { VMTable } from "../VM/VMTable";

interface formDataInterface {
    vm_id: string;
    name: string;
    ciuser: string;
    cipassword: string;
    description: string;
}

export default function CreateTemplate() {
    const { showToast } = useToast();
    const [VMs, setVMs] = useState<VMDetailWithBasicConfig[]>([]);
    const [formData, setFormData] = useState<formDataInterface>({
        vm_id: "",
        name: "",
        ciuser: "",
        cipassword: "",
        description: ""
    });

    const token = localStorage.getItem('token');
    if (!token) {
        showToast("請先登入", "danger");
        return;
    }
    const options = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }

    useEffect(() => {
        // get user own mechine (not running)
        asyncGet(vm_api.getUsersOwnedVMs, options)
            .then((res) => {
                if (res.code === 200) {
                    setVMs(res.body.filter((vm: VMDetailWithBasicConfig) => vm.status?.current_status === "stopped"));
                } else {
                    throw new Error(res.message || "無法取得機器列表");
                }
            })
            .catch((err) => {
                showToast("無法取得機器列表：" + err.message, "danger");
                console.error("Error fetching machines:", err);
            });
    }, []);

    const handleVMSelect = (id: string) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            vm_id: id // 將收到的 id 更新到 formData 的 vm_id 欄位
        }));
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleConvert = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // 檢查 from 值是否為空
        if (!formData.vm_id || !formData.name || !formData.ciuser || !formData.cipassword || !formData.description) {
            showToast("請填寫所有欄位", "danger");
            return;
        }
        asyncPost(vm_template_api.convertVMtoTemplate, formData, options)
            .then((res) => {
                if (res.code === 200) {
                    showToast("成功將機器轉換成範本", "success");
                    window.location.reload();
                } else {
                    throw new Error(res.message || "無法新增範本");
                }
            })
            .catch((err) => {
                showToast("無法新增範本：" + err.message, "danger");
                console.error("Error creating template:", err);
            });
    };

    const renderTooltip = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
            另存範本機器必須為關機狀態
        </Tooltip>
    );

    return (
        <div>
            <h3>新增範本</h3>
            <hr />
            <Form className="bg-light p-4 rounded" onSubmit={handleConvert}>
                <Form.Group className="mb-3">
                    <div className="d-flex align-items-center gap-1">
                        <Form.Label className="mb-0">選擇機器</Form.Label>
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}
                        >
                            <Button variant="none"><i className="bi bi-question-circle" /></Button>
                        </OverlayTrigger>
                    </div>
                    <div style={{
                        height: '200px',
                        overflowY: 'auto',
                        border: '1px solid #dee2e6',
                        borderRadius: '0.375rem',
                    }}>
                        <VMTable isSelectMode={true} VMs={VMs} handleSelectedVM={handleVMSelect} />
                    </div>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>範本名稱</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="範本名稱"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>預設帳號</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="預設帳號"
                        name="ciuser"
                        value={formData.ciuser}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>預設密碼</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="預設密碼"
                        name="cipassword"
                        value={formData.cipassword}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>範本描述</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="範本描述"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Button variant="success" type="submit">提交</Button>
            </Form>
        </div>
    );
}
