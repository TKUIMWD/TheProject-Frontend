import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastProvider";
import { asyncGet, asyncPost } from "../../../utils/fetch";
import { vm_template_api } from "../../../enum/api";
import SubmittedTemplateList from "../List/SubmittedTemplateList";
import { SubmittedTemplateDetails, SubmittedTemplateStatus } from "../../../interface/Template/SubmittedTemplate";
import { Tab, Tabs } from "react-bootstrap";

export default function TemplateAudit() {
    const [key, setKey] = useState<string>(SubmittedTemplateStatus.not_approved);
    const [notApprovedTemplates, setNotApprovedTemplates] = useState<SubmittedTemplateDetails[]>([]);
    const [approvedTemplates, setApprovedTemplates] = useState<SubmittedTemplateDetails[]>([]);
    const [rejectedTemplates, setRejectedTemplates] = useState<SubmittedTemplateDetails[]>([]);
    const { showToast } = useToast();

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

    useEffect(() => {
        asyncGet(vm_template_api.getAllSubmittedTemplates, options)
            .then((res) => {
                if (res.code === 200) {
                    setNotApprovedTemplates(res.body.filter((item: SubmittedTemplateDetails) => item.status === SubmittedTemplateStatus.not_approved));
                    setApprovedTemplates(res.body.filter((item: SubmittedTemplateDetails) => item.status === SubmittedTemplateStatus.approved));
                    setRejectedTemplates(res.body.filter((item: SubmittedTemplateDetails) => item.status === SubmittedTemplateStatus.rejected));
                } else {
                    showToast(res.message || "取得範本失敗", "danger");
                }
            })
            .catch((err) => {
                showToast(`取得範本失敗：${err.message}`, "danger");
            });
    }, []);

    const handleAudit = (templateId: string, status: SubmittedTemplateStatus, reject_reason?: string) => {
        if (!templateId) {
            showToast("無效的範本 ID", "danger");
            return;
        }

        if (reject_reason && status === SubmittedTemplateStatus.rejected && reject_reason.trim() === "") {
            showToast("請輸入拒絕原因", "danger");
            return;
        }

        const body = {
            template_id: templateId,
            status: status,
        }

        if (reject_reason && status === SubmittedTemplateStatus.rejected) {
            Object.assign(body, { reject_reason: reject_reason });
        }

        showToast("正在提交審核結果\n範本審核可能需要一點時間...", "info");
        asyncPost(vm_template_api.audit, body, options)
            .then((res) => {
                if (res.code === 200) {
                    const message = status === SubmittedTemplateStatus.approved ? "範本已通過審核" : "範本已被拒絕";
                    showToast(`審核成功：${message}`, "success");
                    setNotApprovedTemplates((prev) => prev.filter((item) => item._id !== templateId));
                    if (status === SubmittedTemplateStatus.approved) {
                        setApprovedTemplates((prev) => [...prev, res.body]);
                    } else {
                        setRejectedTemplates((prev) => [...prev, res.body]);
                    }
                } else {
                    throw new Error(res.message || "審核失敗");
                }
            })
            .catch((err) => {
                showToast(`審核失敗：${err.message}`, "danger");
                console.error("Error auditing template:", err);
            });
    }

    return (
        <div>
            <h3>範本審核</h3>
            <hr />
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k || SubmittedTemplateStatus.not_approved)}
                className="mb-3"
            >
                <Tab eventKey={SubmittedTemplateStatus.not_approved} title={SubmittedTemplateStatus.not_approved}>
                    {notApprovedTemplates.length > 0 ? (
                        <SubmittedTemplateList
                            isAuditMode={true}
                            showRejectReason={false}
                            templates={notApprovedTemplates}
                            handleAudit={handleAudit}
                        />
                    ) : (
                        <p>目前沒有待審核的範本</p>
                    )}
                </Tab>
                <Tab eventKey={SubmittedTemplateStatus.approved} title={SubmittedTemplateStatus.approved}>
                    {approvedTemplates.length > 0 ? (
                        <SubmittedTemplateList
                            isAuditMode={false}
                            showRejectReason={false}
                            templates={approvedTemplates}
                            handleAudit={handleAudit}
                        />
                    ) : (
                        <p>目前沒有已通過的範本</p>
                    )}
                </Tab>
                <Tab eventKey={SubmittedTemplateStatus.rejected} title={SubmittedTemplateStatus.rejected}>
                    {rejectedTemplates.length > 0 ? (
                        <SubmittedTemplateList
                            isAuditMode={false}
                            showRejectReason={true}
                            templates={rejectedTemplates}
                            handleAudit={handleAudit}
                        />
                    ) : (
                        <p>目前沒有已拒絕的範本</p>
                    )}
                </Tab>
            </Tabs>
        </div>
    );
}
