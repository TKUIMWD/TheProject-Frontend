import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useToast } from "../../../context/ToastProvider";
import { asyncPost } from "../../../utils/fetch";
import { vm_template_manage_api } from "../../../enum/api";

interface UpdateTemplateProps {
    show: boolean;
    handleClose: () => void;
    templateId: string;
}

interface FormData {
    description: string;
    template_name: string;
    ciuser: string;
    cipassword: string;
}

export default function UpdateTemplate({ show, handleClose, templateId }: UpdateTemplateProps) {
    const [formData, setFormData] = useState<FormData>({
        description: "",
        template_name: "",
        ciuser: "",
        cipassword: ""
    });
    const { showToast } = useToast();

    const handleUpdate = (templateId: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast("請先登入", "danger");
            return;
        }

        const options = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        };

        // 檢查 formData 的 欄位是否為空
        if (!checkEmpty()) {
            return; // 如果有空欄位，則不繼續
        }

        const body = {
            template_id: templateId,
            ...formData
        };

        asyncPost(vm_template_manage_api.update, body, options)
            .then((res) => {
                if (res.code === 200) {
                    showToast("範本更新成功", "success");
                    window.location.reload();
                } else {
                    showToast("範本更新失敗：" + res.message, "danger");
                }
            })
            .catch((err) => {
                showToast("範本更新失敗：" + err.message, "danger");
            });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name,value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    const checkEmpty =  () => {
        const emptyData = []
        for (const key in formData) {
            if (formData[key as keyof FormData].trim() === "") {
                emptyData.push(key);
            }
        }

        if (emptyData.length > 0) {
            showToast(`請填寫${emptyData.join(", ")}欄位`, "danger");
            return false; // 失敗
        }

        return true; // 成功
    }


    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>更新範本</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicTemplateName">
                            <Form.Label>範本名稱</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="輸入範本名稱"
                                name="template_name"
                                value={formData.template_name}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicDescription">
                            <Form.Label>說明</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="輸入說明"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicCIUser">
                            <Form.Label>預設使用者名稱</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="輸入預設使用者名稱"
                                name="ciuser"
                                value={formData.ciuser}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicCIPassword">
                            <Form.Label>預設密碼</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="輸入預設密碼"
                                name="cipassword"
                                value={formData.cipassword}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => handleUpdate(templateId)}>
                        更新
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
