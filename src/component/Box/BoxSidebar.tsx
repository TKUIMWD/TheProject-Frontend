import { useEffect, useState } from "react";
import { VM_Box_Info } from "../../interface/VM/VM_Box";
import { UserProfile } from "../../interface/User/User";
import { useToast } from "../../context/ToastProvider";
import { getOptions } from "../../utils/token";
import { asyncGet, asyncPost } from "../../utils/fetch";
import { user_api, vm_manage_api } from "../../enum/api";
import { Button, Card, Form, Image, Modal } from "react-bootstrap";
import { processAvatarPath } from "../../utils/processAvatar";
import { GBtoMB, MBtoGB } from "../../utils/StorageUnitsConverter";

interface CreateVMCardProps {
    box: VM_Box_Info;
    handleCreateVM: (name: string, cpuCores: number, memorySize: number, diskSize: number) => void;
}

interface CreateVMModalProps {
    box: VM_Box_Info;
    show: boolean;
    handleClose: () => void;
    handleCreateVM: (name: string, cpuCores: number, memorySize: number, diskSize: number) => void;
}

function CreateVMCard({ box, handleCreateVM }: CreateVMCardProps) {
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    return (
        <>
            <Card
                style={{ width: '18rem' }}
                onClick={handleShow}
                className="hover-shadow"
                role="button"
            >
                <Card.Title className="text-center pt-3">
                    <i className="bi bi-cloud-plus" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                </Card.Title>
                <Card.Body className="text-center">
                    <Card.Title>建立虛擬機</Card.Title>
                    <Card.Text>
                        <p>點擊此處以建立新的虛擬機器。</p>
                    </Card.Text>
                </Card.Body>
            </Card>
            <CreateVMModal box={box} show={showModal} handleClose={handleClose} handleCreateVM={handleCreateVM} />
        </>
    );
}

function CreateVMModal({ box, show, handleClose, handleCreateVM }: CreateVMModalProps) {
    const [formData, setFormData] = useState({
        name: `${box.name}-VM`,
        cpuCores: box.default_cpu_cores,
        memorySize: MBtoGB(box.default_memory_size),
        diskSize: box.default_disk_size,
    });

    const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        handleCreateVM(formData.name, formData.cpuCores, formData.memorySize, formData.diskSize);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>建立虛擬機</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>說明</Form.Label>
                        <Form.Text className="text-muted">
                            <p>您即將建立一台新的虛擬機器。請確認您的設定無誤，然後點擊「確認」以建立機器。</p>
                            <p>建立後，您可以在「dashboard」中查看並管理您的虛擬機器。</p>
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="vmName">
                        <Form.Label>虛擬機名稱</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={`${box.name}-VM`}
                            name="name"
                            value={formData.name}
                            onChange={handleFormDataChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="cpuCores">
                        <Form.Label>CPU 核心數</Form.Label>
                        <Form.Control 
                            type="number"
                            defaultValue={box.default_cpu_cores}
                            name="cpuCores"
                            value={formData.cpuCores}
                            onChange={handleFormDataChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="memorySize">
                        <Form.Label>記憶體大小 (GB)</Form.Label>
                        <Form.Control 
                            type="number"
                            defaultValue={MBtoGB(box.default_memory_size)}
                            name="memorySize"
                            value={formData.memorySize}
                            onChange={handleFormDataChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="diskSize">
                        <Form.Label>磁碟大小 (GB)</Form.Label>
                        <Form.Control 
                            type="number"
                            defaultValue={box.default_disk_size}
                            name="diskSize"
                            value={formData.diskSize}
                            onChange={handleFormDataChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    取消
                </Button>
                <Button variant="success" onClick={() => handleSubmit()}>
                    確認
                </Button>
            </Modal.Footer>
        </Modal>
    );

}

function SubmitterCard({ user }: { user: UserProfile | null }) {
    return (
        <Card style={{ width: '18rem' }}>
            <div className="text-center p-3">
                <Image
                    src={processAvatarPath(user?.avatar_path)}
                    roundedCircle
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
            </div>
            <Card.Body className="text-center">
                <Card.Title>{user?.username || "未知的使用者"}</Card.Title>
                <Card.Text>
                    <p>{user?.email || ""}</p>
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default function BoxSidebar({ box }: { box: VM_Box_Info }) {
    const [submitter, setSubmitter] = useState<UserProfile | null>(null);
    const { showToast } = useToast();

    // get submitter profile
    useEffect(() => {
        try {
            const options = getOptions();
            asyncGet(user_api.getUserById(box.owner), options)
                .then((res) => {
                    if (res.code === 200) {
                        setSubmitter(res.body);
                    } else {
                        throw new Error(res.message || "無法取得 Submitter 資料");
                    }
                })
                .catch((error) => {
                    showToast(`無法取得 Submitter 資料: ${error.message}`, "danger");
                    console.error(`無法取得 Submitter 資料: ${error.message}`);
                });
        } catch (error) {
            showToast(`無法取得 Submitter 資料: ${error}`, "danger");
            console.error(`無法取得 Submitter 資料: ${error}`);
        }
    }, []);

    const handleCreateVM = (name: string, cpuCores: number, memorySize: number, diskSize: number) => {
        try {
            const options = getOptions();
            const body = {
                box_id: box._id,
                name: name,
                target: "gapvea",
                cpuCores: cpuCores,
                memorySize: GBtoMB(memorySize),
                diskSize: diskSize,
            };
            showToast("虛擬機建立中，請稍後至儀表板查看", "info");
            asyncPost(vm_manage_api.createFromBoxTemplate, body, options)
                .then((res) => {
                    if (res.code === 200) {
                        showToast("虛擬機建立成功", "success");
                    } else {
                        throw new Error(res.message || "無法建立虛擬機");
                    }
                })
                .catch((err) => {
                    showToast(`無法建立虛擬機: ${err.message}`, "danger");
                    console.error(`無法建立虛擬機: ${err.message}`);
                });
        } catch (error: any) {
            showToast(`無法建立虛擬機: ${error.message}`, "danger");
            console.error(`無法建立虛擬機: ${error.message}`);
        }
    }

    return (
        <div className="d-flex flex-column gap-4">
            <CreateVMCard box={box} handleCreateVM={handleCreateVM} />
            <SubmitterCard user={submitter} />
        </div>
    );
}