import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastProvider";
import { asyncGet } from "../../../utils/fetch";
import { vm_template_api } from "../../../enum/api";
import { VM_Template_Info } from "../../../interface/VM/VM_Template";
import TemplateList from "../List/TemplateList";

export default function AllTemplates() {
    const [templates, setTemplates] = useState<VM_Template_Info[]>([]);
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
                    setTemplates(response.body);
                } else {
                    throw new Error(response.message || "獲取範本失敗");
                }
            })
            .catch((error) => {
                showToast("獲取範本失敗：" + error.message, "danger");
            });
    }, []);

    return (
        <div>
            <h3>所有範本</h3>
            <hr />
            {templates.length > 0 ? (
                <TemplateList templates={templates} />
            ) : (
                <p>目前沒有範本</p>
            )}
        </div>
    );
}
