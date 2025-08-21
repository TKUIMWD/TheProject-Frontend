import { useRef, useState } from "react";
import { Button, ButtonGroup, Dropdown, Spinner } from "react-bootstrap";
import { asyncPost } from "../../../utils/fetch";
import { useToast } from "../../../context/ToastProvider";
import { guacamole_api } from "../../../enum/api";
import StartVMModal from "../../modal/StartVMModal";
import { useParams } from "react-router-dom";

const consoleTypeMap: Record<"SSH" | "RDP" | "VNC", string> = {
    "SSH": guacamole_api.sshConnection,
    "RDP": guacamole_api.rdpConnection,
    "VNC": guacamole_api.vncConnection
};

export default function VMConsole() {
    const [start, setStart] = useState(false);
    const [showStartModal, setShowStartModal] = useState<boolean>(false);
    const [consoleLoading, setConsoleLoading] = useState(false);
    const [consoleType, setConsoleType] = useState<"SSH" | "RDP" | "VNC">("SSH");
    const { showToast } = useToast();

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const { vmId } = useParams();
    if (!vmId) {
        showToast("無法獲取 VM ID", "danger");
        setConsoleLoading(false);
        setStart(false);
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        showToast("請先登入", "danger");
        return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    const refocusIframe = () => {
        // 使用 setTimeout 確保在瀏覽器完成其他操作 (如關閉下拉選單) 後再執行聚焦
        setTimeout(() => {
            // 檢查 ref 是否存在且 iframe 是否已連線 (有 src)
            if (iframeRef.current && iframeRef.current.src) {
                iframeRef.current.focus();
            }
        }, 0);
    };

    const handleStart = () => {
        
        setConsoleLoading(true);
        setShowStartModal(true);
    };

    const handleReboot = () => {

    };

    const handleShutdown = () => {

    };

    const handleFullScreen = () => {
        // 檢查 ref 是否已經指向 iframe
        if (iframeRef.current) {
            // 呼叫瀏覽器的 requestFullscreen API
            // 這裡也包含了對不同瀏覽器前綴的相容性處理
            if (iframeRef.current.requestFullscreen) {
                iframeRef.current.requestFullscreen();
            } else if ((iframeRef.current as any).mozRequestFullScreen) { /* Firefox */
                (iframeRef.current as any).mozRequestFullScreen();
            } else if ((iframeRef.current as any).webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                (iframeRef.current as any).webkitRequestFullscreen();
            } else if ((iframeRef.current as any).msRequestFullscreen) { /* IE/Edge */
                (iframeRef.current as any).msRequestFullscreen();
            }
        }

        refocusIframe();
    };

    const onHideStartModal = () => {
        setShowStartModal(false);
    }

    const onConfirmStart = async (username: string, password: string) => {
        setStart(true);
        setConsoleLoading(true);
        const api = consoleTypeMap[consoleType];
        const body = {
            "vm_id": vmId,
            "username": username,
            "password": password
        };
        try {
            asyncPost(api, body, { headers })
                .then(response => {
                    if (response.code !== 200) {
                        showToast(`無法獲取連線資訊: ${response.message}`, "danger");
                        console.error(`Error fetching VM console: ${response.message}`);
                        return;
                    }

                    if (iframeRef.current) {
                        iframeRef.current.src = response.body.direct_url;
                        iframeRef.current.onload = () => {
                            refocusIframe();
                        };
                    }
                    showToast("連線成功，正在載入終端...", "success");
                    setConsoleLoading(false);
                })
                .catch(error => {
                    throw new Error(error || "無法獲取連線資訊");
                });
        } catch (error) {
            showToast(`Error: ${error}`, "danger");
            setConsoleLoading(false);
            setStart(false);
        } finally {
            setConsoleLoading(false);
        }
    }

    const handleConsoleTypeChange = (eventKey: string | null) => {
        if (eventKey && (eventKey === "SSH" || eventKey === "RDP" || eventKey === "VNC")) {
            setConsoleType(eventKey);
        }
    };

    return (
        <div className="vm-console-container">
            {showStartModal && (
                <StartVMModal
                    show={showStartModal}
                    onHide={onHideStartModal}
                    onConfirm={onConfirmStart}
                />
            )}
            <div className="d-flex justify-content-between mb-2">
                <ButtonGroup>
                    <Button variant="outline-secondary" onClick={handleStart} disabled={start}><i className="bi bi-play-circle" /> Start</Button>
                    <Button variant="outline-secondary"><i className="bi bi-repeat" /> Reboot</Button>
                    <Button variant="outline-secondary"><i className="bi bi-power" /> Shutdown</Button>
                </ButtonGroup>
                <div className="d-flex align-items-center gap-2">
                    <Button variant="outline-secondary" onClick={handleFullScreen}><i className="bi bi-fullscreen" /> Full Screen</Button>
                    <Dropdown onSelect={handleConsoleTypeChange}>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            {consoleType}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="SSH">SSH</Dropdown.Item>
                            <Dropdown.Item eventKey="RDP">RDP</Dropdown.Item>
                            <Dropdown.Item eventKey="VNC">VNC</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            {start ? (
                consoleLoading ? (
                    <div style={{ width: "100%", height: "600px", border: "solid 1px #ccc", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Connecting...</span>
                        </Spinner>
                    </div>
                ) : (
                    <div style={{ position: 'relative', width: '100%', height: '600px' }}>
                        <iframe
                            ref={iframeRef}
                            title="VM Console"
                            width="100%"
                            height="100%"
                            style={{ border: "solid 1px #ccc" }}
                            allowFullScreen
                        />
                        {/* 作用：讓 iframe 可以重新focus */}
                        <div
                            onClick={refocusIframe}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                zIndex: 10,
                                backgroundColor: 'transparent',
                            }}
                        />
                    </div>
                )
            ) : (
                <div style={{ width: "100%", height: "600px", border: "solid 1px #ccc", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <span>VM is not running</span>
                </div>
            )}
        </div>
    );
}