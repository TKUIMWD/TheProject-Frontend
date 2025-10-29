import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastProvider";
import { asyncGet, asyncPost } from "../../../utils/fetch";
import { box_api } from "../../../enum/api";
import SubmittedBoxList from "../List/SubmittedBoxList";
import { SubmittedBoxStatus } from "../../../interface/VM/SubmittedBox";
import { Tab, Tabs } from "react-bootstrap";
import { getOptions } from "../../../utils/token";
import { VM_Box_Info } from "../../../interface/VM/VM_Box";
import "../../../style/superAdmin/Box/BoxAudit.css";

export default function BoxAudit() {
    const [key, setKey] = useState<string>(SubmittedBoxStatus.not_approved);
    const [notApprovedboxes, setNotApprovedboxes] = useState<VM_Box_Info[]>([]);
    const [approvedboxes, setApprovedboxes] = useState<VM_Box_Info[]>([]);
    const [rejectedboxes, setRejectedboxes] = useState<VM_Box_Info[]>([]);
    const { showToast } = useToast();

    const fetchAllData = () => {
        const options = getOptions();
        if (!options) return;

        // 並行獲取兩個 API
        Promise.all([
            asyncGet(box_api.getSubmittedBoxes, options),
            asyncGet(box_api.getPendingBoxes, options)
        ]).then(([submittedRes, pendingRes]) => {
            // 處理待審核的 Boxes
            if (pendingRes.code === 200) {
                setNotApprovedboxes(pendingRes.body || []);
            } else {
                showToast(pendingRes.message || "取得待審核 Box 失敗", "danger");
            }

           if (submittedRes.code === 200) {
                // API 回傳的物件是 VM_Box_Info 加上 status
                const allSubmittedBoxes: (VM_Box_Info & { status: SubmittedBoxStatus })[] = submittedRes.body || [];

                // 後鏈接 map 來移除 status 屬性
                const approved = allSubmittedBoxes
                    .filter(box => box.status === SubmittedBoxStatus.approved)
                    .map(({ status, ...rest }) => rest); // 解構物件，移除 status，只保留其餘部分

                const rejected = allSubmittedBoxes
                    .filter(box => box.status === SubmittedBoxStatus.rejected)
                    .map(({ status, ...rest }) => rest); // 同樣處理

                setApprovedboxes(approved);
                setRejectedboxes(rejected);
            } else {
                showToast(submittedRes.message || "取得已審核 Box 失敗", "danger");
            }
        }).catch(err => {
            showToast(`取得資料時發生錯誤：${err.message}`, "danger");
            console.error("Error fetching data:", err);
        });
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleAudit = (submission_id: string, status: SubmittedBoxStatus, reject_reason?: string) => {
            if (!submission_id) {
                showToast("無效的範本 ID", "danger");
                return;
            }
    
            if (reject_reason && status === SubmittedBoxStatus.rejected && reject_reason.trim() === "") {
                showToast("請輸入拒絕原因", "danger");
                return;
            }
    
            const body = {
                submission_id: submission_id,
                status: status,
            }
    
            if (reject_reason && status === SubmittedBoxStatus.rejected) {
                Object.assign(body, { reject_reason: reject_reason });
            }
    
            showToast("正在提交審核結果\n範本審核可能需要一點時間...", "info");
            try {
                const options = getOptions();
                asyncPost(box_api.auditBox, body, options)
                    .then((res) => {
                        if (res.code === 200) {
                            const message = status === SubmittedBoxStatus.approved ? "Box 已通過審核" : "Box 已被拒絕";
                            showToast(`審核成功：${message}`, "success");
                            setNotApprovedboxes((prev) => prev.filter((item) => item._id !== submission_id));
                            if (status === SubmittedBoxStatus.approved) {
                                setApprovedboxes((prev) => [...prev, res.body]);
                            } else {
                                setRejectedboxes((prev) => [...prev, res.body]);
                            }
                        } else {
                            throw new Error(res.message || "審核失敗");
                        }
                    })
                    .catch((err) => {
                        showToast(`審核失敗：${err.message}`, "danger");
                        console.error("Error auditing Box:", err);
                    });
            } catch (error: any) {
                showToast(error.message, "danger");
            }
        }

    // JSX 渲染部分保持不變
    return (
        <div>
            <h3>Box 審核</h3>
            <hr />
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k || SubmittedBoxStatus.not_approved)}
                className="mb-3"
            >
                <Tab eventKey={SubmittedBoxStatus.not_approved} title={SubmittedBoxStatus.not_approved}>
                    {notApprovedboxes.length > 0 ? (
                        <SubmittedBoxList
                            isAuditMode={true}
                            showRejectReason={false}
                            boxes={notApprovedboxes}
                            handleAudit={handleAudit}
                        />
                    ) : (
                        <p>目前沒有待審核的 Box</p>
                    )}
                </Tab>
                <Tab eventKey={SubmittedBoxStatus.approved} title={SubmittedBoxStatus.approved}>
                    {approvedboxes.length > 0 ? (
                        <SubmittedBoxList
                            isAuditMode={false}
                            showRejectReason={false}
                            boxes={approvedboxes}
                            handleAudit={handleAudit}
                        />
                    ) : (
                        <p>目前沒有已通過的 Box</p>
                    )}
                </Tab>
                <Tab eventKey={SubmittedBoxStatus.rejected} title={SubmittedBoxStatus.rejected}>
                    {rejectedboxes.length > 0 ? (
                        <SubmittedBoxList
                            isAuditMode={false}
                            showRejectReason={true}
                            boxes={rejectedboxes}
                            handleAudit={handleAudit}
                        />
                    ) : (
                        <p>目前沒有已拒絕的 Box</p>
                    )}
                </Tab>
            </Tabs>
        </div>
    );
}