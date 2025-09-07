import { Button, Table } from "react-bootstrap";
import { formatISOString } from "../../../utils/timeFormat";
import { SubmittedBoxStatus } from "../../../interface/VM/SubmittedBox";
import { useState } from "react";
import RejectModal from "../Modal/RejectModal";
import { VM_Box_Info } from "../../../interface/VM/VM_Box";

interface BoxListProps {
    isAuditMode: boolean;
    showRejectReason: boolean;
    boxes: VM_Box_Info[];
    handleAudit: (BoxId: string, status: SubmittedBoxStatus, reject_reason?: string) => void;
}

export default function BoxList({ boxes, handleAudit, isAuditMode, showRejectReason }: BoxListProps) {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [BoxId, setBoxId] = useState<string>("");

    const handleApproved = (box_id: string) => {
        handleAudit(box_id, SubmittedBoxStatus.approved);
    }

    const handleReject = (box_id: string, reason: string) => {
        handleAudit(box_id, SubmittedBoxStatus.rejected, reason);
    }

    return (
        <>
            <Table hover bordered responsive>
                <thead>
                    <tr className="text-center">
                        <th style={{ width: '5%' }}>#</th>
                        <th style={{ width: '15%' }}>名稱</th>
                        <th style={{ width: '30%' }}>描述</th>
                        <th style={{ width: '10%' }}>擁有者</th>
                        {showRejectReason && <th style={{ width: '15%' }}>拒絕原因</th>}
                        <th style={{ width: '15%' }}>提交日期</th>
                        {isAuditMode && <th style={{ width: '15%' }}>核准</th>}
                    </tr>
                </thead>
                <tbody>
                    {boxes.map((box, index) => (
                        <tr key={box._id} className="text-center align-middle">
                            <td>{index + 1}</td>
                            <td>{box.name}</td>
                            <td className="text-start">{box.description}</td>
                            <td>{box.submitter_user_info?.username}</td>
                            {showRejectReason && <td>{box.reject_reason}</td>}
                            <td>{box.submitted_date ? formatISOString(box.submitted_date) : 'N/A'}</td>
                            {isAuditMode &&
                                <td >
                                    <div className="d-flex gap-2 justify-content-center align-items-center">
                                        <Button variant="outline-success" onClick={() => handleApproved(box._id)}>核准</Button>
                                        <Button variant="outline-danger" onClick={() => {
                                            setShowRejectModal(true)
                                            setBoxId(box._id)
                                        }}>拒絕</Button>
                                    </div>
                                </td>
                            }
                        </tr>
                    ))}
                </tbody>
            </Table>

            <RejectModal
                show={showRejectModal}
                handleClose={() => setShowRejectModal(false)}
                _id={BoxId}
                handleReject={handleReject}
            />
        </>
    );
}
