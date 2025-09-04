import { Button, Table } from "react-bootstrap";
import { formatISOString } from "../../../utils/timeFormat";
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

    return (
        <>
            <Table hover bordered responsive>
                <thead>
                    <tr className="text-center">
                        <th style={{ width: '5%' }}>#</th>
                        <th style={{ width: '15%' }}>名稱</th>
                        <th style={{ width: '30%' }}>描述</th>
                        <th style={{width: '10%'}}>擁有者</th>
                        {showRejectReason && <th style={{ width: '15%' }}>拒絕原因</th>}
                        <th style={{ width: '15%' }}>提交日期</th>
                        {isAuditMode && <th style={{ width: '15%' }}>核准</th>}
                    </tr>
                </thead>
                <tbody>
                    {templates.map((template, index) => (
                        <tr key={template._id} className="text-center align-middle">
                            <td>{index + 1}</td>
                            <td>{template.template_name}</td>
                            <td  className="text-start">{template.template_description}</td>
                            <td>{template.submitter_user_info?.username}</td>
                            {showRejectReason && <td>{template.reject_reason || "No reject reason"}</td>}
                            <td>{template.submitted_date ? formatISOString(template.submitted_date) : 'N/A'}</td>
                            {isAuditMode &&
                                <td >
                                    <div className="d-flex gap-2 justify-content-center align-items-center">
                                        <Button variant="outline-success" onClick={() => handleApproved(template._id)}>核准</Button>
                                        <Button variant="outline-danger" onClick={() => {
                                            setShowRejectModal(true)
                                            setTemplateId(template._id)
                                        }}>拒絕</Button>
                                    </div>
                                </td>
                            }
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
