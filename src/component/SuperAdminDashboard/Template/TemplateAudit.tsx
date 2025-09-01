import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastProvider";
import { asyncGet } from "../../../utils/fetch";
import { vm_template_api } from "../../../enum/api";
import SubmittedTemplateList from "./SubmittedTemplateList";
import { SubmittedTemplateDetails } from "../../../interface/Template/SubmittedTemplate";

export default function TemplateAudit() {
    const [templates, setTemplates] = useState<SubmittedTemplateDetails[]>([]);
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
        asyncGet(vm_template_api.getAllSubmittedTemplates, options)
            .then((res) => {
                if (res.code === 200) {
                    setTemplates(res.body || []);
                } else {
                    showToast(res.message || "取得範本失敗", "danger");
                }
            })
            .catch((err) => {
                showToast(`取得範本失敗：${err.message}`, "danger");
            });
    }, []);

    return (
        <div>
            <h3>範本審核</h3>
            <hr />
            {templates.length > 0 ? (
                <SubmittedTemplateList templates={templates} />
            ) : (
                <p>目前沒有待審核的範本</p>
            )}
        </div>
    );
}
