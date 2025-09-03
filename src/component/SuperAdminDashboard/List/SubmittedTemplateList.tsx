import { Button, Table } from "react-bootstrap";
import { formatISOString } from "../../../utils/timeFormat";
import { MBtoGB } from "../../../utils/StorageUnitsConverter";
import { SubmittedTemplateDetails, SubmittedTemplateStatus } from "../../../interface/Template/SubmittedTemplate";
import { useState } from "react";
import TemplateRejectModal from "../Modal/TemplateRejectModal";

interface SubmittedTemplateCardProps {
    isAuditMode: boolean;
    showRejectReason: boolean;
    templates: SubmittedTemplateDetails[];
    handleAudit: (templateId: string, status: SubmittedTemplateStatus, reject_reason?: string) => void;
}

export default function SubmittedTemplateList({ templates, handleAudit, isAuditMode, showRejectReason }: SubmittedTemplateCardProps) {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [templateId, setTemplateId] = useState<string>("");

    const handleApproved = (template_id: string) => {
        handleAudit(template_id, SubmittedTemplateStatus.approved);
    }

    const handleReject = (template_id: string, reason: string) => {
        handleAudit(template_id, SubmittedTemplateStatus.rejected, reason);
    }

    const handleCancel = (template_id: string, status: SubmittedTemplateStatus) => {
        handleAudit(template_id, status);
    }

    return (
        <>
            <Table hover bordered responsive>
                <thead>
                    <tr className="text-center">
                        <th>#</th>
                        <th>名稱</th>
                        <th style={{ width: '40%' }}>描述</th>
                        <th>擁有者</th>
                        {showRejectReason && <th>拒絕原因</th>}
                        <th>提交日期</th>
                        {isAuditMode && <th>核准</th>}
                    </tr>
                </thead>
                <tbody>
                    {templates.map((template, index) => (
                        <tr key={template._id} className="text-start align-middle">
                            <td>{index + 1}</td>
                            <td>{template.template_name}</td>
                            <td>{template.template_description}</td>
                            <td>{template.submitter_user_info?.username}</td>
                            {showRejectReason && <td>{template.reject_reason || "No reject reason"}</td>}
                            <td>{template.submitted_date ? formatISOString(template.submitted_date) : 'N/A'}</td>
                            <td >
                                {isAuditMode && (
                                    <div className="d-flex gap-2 justify-content-center align-items-center">
                                        <Button variant="outline-success" onClick={() => handleApproved(template._id)}>核准</Button>
                                        <Button variant="outline-danger" onClick={() => {
                                            setShowRejectModal(true)
                                            setTemplateId(template._id)
                                        }}>拒絕</Button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <TemplateRejectModal
                show={showRejectModal}
                handleClose={() => setShowRejectModal(false)}
                template_id={templateId}
                handleReject={handleReject}
            />
        </>
    );
}
