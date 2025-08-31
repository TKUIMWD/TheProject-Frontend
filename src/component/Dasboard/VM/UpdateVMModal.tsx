import { Modal } from "react-bootstrap";
import CreateVM from "./CreateVM";

interface UpdateVMModalProps {
    showUpdateModal: boolean;
    handleCloseModal: () => void;
    editingVMId: string;
}

export default function UpdateVMModal({showUpdateModal, handleCloseModal, editingVMId}:UpdateVMModalProps) {
    return (
        <Modal show={showUpdateModal} onHide={handleCloseModal} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>更新虛擬機</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {editingVMId && (
                    <CreateVM
                        isUpdateMode={true}
                        vmToUpdateId={editingVMId}
                    />
                )}
            </Modal.Body>
        </Modal>
    );
}