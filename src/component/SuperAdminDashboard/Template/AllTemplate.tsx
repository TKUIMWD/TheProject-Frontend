import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastProvider";
import { asyncDelete, asyncGet } from "../../../utils/fetch";
import { vm_template_api, vm_template_manage_api } from "../../../enum/api";
import { VM_Template_Info } from "../../../interface/VM/VM_Template";
import TemplateList from "../List/TemplateList";
import { Tab, Tabs } from "react-bootstrap";
import { getOptions } from "../../../utils/token";

export default function AllTemplates() {
    const [allTemplates, setAllTemplates] = useState<VM_Template_Info[]>([]);
    const [privatetemplates, setPrivateTemplates] = useState<VM_Template_Info[]>([]);
    const [publicTemplates, setPublicTemplates] = useState<VM_Template_Info[]>([]);
    const { showToast } = useToast();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            showToast("請先登入", "danger");
            return;
        }
        const options = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        asyncGet(vm_template_api.getAllTemplates, options)
            .then((response) => {
                if (response.code === 200) {
                    setAllTemplates(response.body);
                    setPrivateTemplates(response.body.filter((template: VM_Template_Info) => !template.is_public));
                    setPublicTemplates(response.body.filter((template: VM_Template_Info) => template.is_public));
                } else {
                    throw new Error(response.message || "獲取範本失敗");
                }
            })
            .catch((error) => {
                showToast("獲取範本失敗：" + error.message, "danger");
            });
    }, []);

    const handleDelete = (template_id: string) => {
        const confirmed = confirm("確定要刪除這個範本嗎？該操作無法復原！");
        if (!confirmed) {
            return;
        }

        try {
            const options = getOptions();

            asyncDelete(vm_template_manage_api.delete, { template_id }, options)
                .then((res) => {
                    if (res.code === 200) {
                        showToast("刪除範本成功", "success");
                        setAllTemplates(prev => prev.filter(t => t._id !== template_id));
                        setPrivateTemplates(prev => prev.filter(t => t._id !== template_id));
                        setPublicTemplates(prev => prev.filter(t => t._id !== template_id));
                    } else {
                        throw new Error(res.message || "刪除範本失敗");
                    }
                })
                .catch((err) => {
                    throw new Error(err.message || "刪除範本失敗");
                })
        } catch (error: any) {
            showToast(error.message, "danger");
            console.error("Error deleting template:", error);
        }
    }

    return (
        <div>
            <h3>範本總覽</h3>
            <hr />
            <Tabs
                defaultActiveKey="all"
                className="mb-3"
            >
                <Tab eventKey="all" title="All">
                    {allTemplates.length > 0 ? (
                        <TemplateList templates={allTemplates} handleDelete={handleDelete} />
                    ) : (
                        <p>目前沒有範本</p>
                    )}
                </Tab>
                <Tab eventKey="private" title="私有範本">
                    {privatetemplates.length > 0 ? (
                        <TemplateList templates={privatetemplates} handleDelete={handleDelete} />
                    ) : (
                        <p>目前沒有範本</p>
                    )}
                </Tab>
                <Tab eventKey="public" title="公開範本">
                    {publicTemplates.length > 0 ? (
                        <TemplateList templates={publicTemplates} handleDelete={handleDelete} />
                    ) : (
                        <p>目前沒有範本</p>
                    )}
                </Tab>
            </Tabs>
        </div>
    );
}
