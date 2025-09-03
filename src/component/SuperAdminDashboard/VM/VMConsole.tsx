import { useEffect, useRef, useState, useMemo } from "react";
import { Button, ButtonGroup, Dropdown, Spinner } from "react-bootstrap";
import { asyncDelete, asyncGet, asyncPost } from "../../../utils/fetch";
import { useToast } from "../../../context/ToastProvider";
import { guacamole_api, vm_api, vm_operate_api } from "../../../enum/api";
import StartVMModal from "../../modal/StartVMModal";
import { useParams } from "react-router-dom";

const consoleTypeMap: Record<"SSH" | "RDP" | "VNC", string> = {
    "SSH": guacamole_api.sshConnection,
    "RDP": guacamole_api.rdpConnection,
    "VNC": guacamole_api.vncConnection
};

export default function VMConsole() {
    const [connect, setConnect] = useState(false);
    const [connectionId, setConnectionId] = useState<string | null>(null);
    const [isBoot, setIsBoot] = useState<boolean>(false);
    const [showStartModal, setShowStartModal] = useState<boolean>(false);
    const [consoleLoading, setConsoleLoading] = useState(false);
    const [consoleUrl, setConsoleUrl] = useState<string>("");
    const [consoleType, setConsoleType] = useState<"SSH" | "RDP" | "VNC">("SSH");
    const { showToast } = useToast();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const { vmId } = useParams();

    const token = localStorage.getItem("token");
    const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

    // 建立狀態輪詢，作為 isBoot 的唯一事實來源
    useEffect(() => {
        if (!vmId || !token) return;

        const checkStatus = async () => {
            try {
                const res = await asyncGet(`${vm_api.getVMStatus}?vm_id=${vmId}`, { headers });
                if (res.code === 200) {
                    const isCurrentlyRunning = res.body.status === "running";
                    setIsBoot(isCurrentlyRunning);

                    // 如果 VM 狀態不是 running，強制更新 connect 狀態
                    if (!isCurrentlyRunning && connect) {
                        setConnect(false);
                        setConnectionId(null);
                        setConsoleUrl("");
                    }
                } else {
                    setIsBoot(false); // 查詢失敗也當作未開機
                }
            } catch (error) {
                console.error("Error polling VM status:", error);
                setIsBoot(false);
            }
        };

        checkStatus();
        const intervalId = setInterval(checkStatus, 5000); // 每 5 秒檢查一次

        return () => clearInterval(intervalId); // 元件卸載時清除計時器
    }, [vmId, token, headers, connect]); // 當 connect 狀態改變時也重新評估

    // 處理 iframe 的焦點問題
    useEffect(() => {
        // 當 iframe 可見時，才需要監聽
        if (!connect || consoleLoading) {
            return;
        }

        const handleWindowBlur = () => {
            // 當主視窗失焦時，檢查焦點是否轉移到了 iframe 上
            if (document.activeElement === iframeRef.current) {
                // 如果是，我們可以執行一些操作，例如記錄日誌
                // 但實際上，瀏覽器已經自動完成了聚焦，我們無需再手動呼叫 focus()
                console.log("Iframe has been focused by user click.");
            }
        };

        // 新增事件監聽
        window.addEventListener('blur', handleWindowBlur);

        // 元件卸載或依賴項改變時，清除監聽
        return () => {
            window.removeEventListener('blur', handleWindowBlur);
        };
    }, [connect, consoleLoading]);

    // 輔助函式：重新聚焦 iframe
    const refocusIframe = () => {
        setTimeout(() => {
            if (iframeRef.current && iframeRef.current.src) {
                iframeRef.current.focus();
            }
        }, 0);
    };

    // VM操作函式
    const sendVMOperation = async (operation: string, api: string) => {
        try {
            showToast(`正在發送 ${operation} 指令...`, "info");
            const response = await asyncPost(api, { vm_id: vmId }, { headers });
            if (response.code === 200) {
                showToast(`${operation} 指令已成功發送`, "success");
            } else {
                throw new Error(response.message || `無法發送 ${operation} 指令`);
            }
        } catch (error: any) {
            showToast(`${operation} 失敗: ${error.message}`, "danger");
            console.error(`Error during ${operation}:`, error);
        }
    };

    const handleStart = () => sendVMOperation("啟動", vm_operate_api.boot);
    const handleShutdown = () => sendVMOperation("關機 (Shutdown)", vm_operate_api.shutdown);
    const handlePoweroff = () => sendVMOperation("關機 (Poweroff)", vm_operate_api.poweroff);
    const handleReboot = () => sendVMOperation("重啟 (Reboot)", vm_operate_api.reboot);
    const handleReset = () => sendVMOperation("重啟 (Reset)", vm_operate_api.reset);

    const handleConnect = () => {
        if (!isBoot) {
            showToast("請先啟動虛擬機", "danger");
            return;
        }
        setConsoleLoading(true);
        setShowStartModal(true);
    };

    // 確認連線
    const onConfirmConnect = async (username: string, password: string) => {
        const api = consoleTypeMap[consoleType];
        const body = { "vm_id": vmId, "username": username, "password": password };
        try {
            const response = await asyncPost(api, body, { headers });
            if (response.code !== 200) throw new Error(response.message);

            const { direct_url, connection_id } = response.body;
            if (!direct_url || !connection_id) throw new Error("後端未回傳完整連線資訊");
            setConnect(true);
            setConnectionId(connection_id);
            setConsoleUrl(direct_url);
            setConsoleLoading(false);
            showToast("連線成功，請稍後...", "success");
        } catch (error: any) {
            showToast(`連線失敗: ${error}`, "danger");
            setConnect(false);
            setConsoleLoading(false);
        } finally {
            setShowStartModal(false);
        }
    };

    const handleDisconnect = () => {
        if (!connectionId) return;
        try {
            asyncPost(guacamole_api.disConnect, { connection_id: connectionId }, { headers })
                .then((res) => {
                    if (res.code === 200) {
                        showToast("已斷開連線", "success");
                        setConnect(false);
                        setConnectionId(null);
                        setConsoleUrl("");
                    } else {
                        throw new Error(res.message || "斷開連線失敗");
                    }
                })
        } catch (error: any) {
            showToast(`斷線失敗: ${error.message}`, "danger");
        }
    };

    const handleDeleteAllConnection = async () => {
        try {
            const confirm = window.confirm("確定要刪除您所有的 Guacamole 連線嗎？此操作無法復原。");
            if (!confirm) {
                return;
            }

            // list user's all connections
            const listRes = await asyncGet(guacamole_api.listConnections, { headers });

            if (listRes.code !== 200 || !Array.isArray(listRes.body)) {
                throw new Error(listRes.message || "獲取連線列表失敗");
            }
            const connections: any[] = listRes.body;
            console.log(connections);

            if (connections.length === 0) {
                showToast("沒有可刪除的連線。", "info");
                return;
            }

            // delete all connections
            const deletePromises = connections.map(conn =>
                asyncDelete(guacamole_api.deleteConnection, { connection_id: conn.connection_id }, { headers })
            );

            showToast(`正在刪除 ${deletePromises.length} 個連線...`, "info");

            // 執行所有刪除請求
            const results = await Promise.all(deletePromises);

            // 檢查是否有任何一個請求失敗
            const failedDeletions = results.filter(res => res.code !== 200);
            console.log(failedDeletions);

            if (failedDeletions.length > 0) {
                throw new Error(`部分連線刪除失敗 (${failedDeletions.length}/${results.length})`);
            }

            // 所有請求成功
            showToast("所有連線已成功刪除", "success");
            setConnect(false);
            setConnectionId(null);
            setConsoleUrl("");
        } catch (error: any) {
            showToast(`刪除連線失敗: ${error.message}`, "danger");
        }

    }

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
        // 如果使用者是直接關閉 Modal，則重設畫面狀態
        if (consoleLoading) {
            setConnect(false);
            setConsoleLoading(false);
        }
    };

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
                    onConfirm={onConfirmConnect}
                />
            )}
            <div className="d-flex justify-content-between mb-2">
                <ButtonGroup>
                    <Button variant="outline-secondary" onClick={handleStart} disabled={isBoot}><i className="bi bi-play-circle" /> Start</Button>
                    <Button variant="outline-secondary" onClick={handleShutdown} disabled={!isBoot}><i className="bi bi-power" /> Shutdown</Button>
                    <Button variant="outline-secondary" onClick={handlePoweroff} disabled={!isBoot}><i className="bi bi-power" /> Poweroff</Button>
                    <Button variant="outline-secondary" onClick={handleReboot} disabled={!isBoot}><i className="bi bi-repeat" /> Reboot</Button>
                    <Button variant="outline-secondary" onClick={handleReset} disabled={!isBoot}> <i className="bi bi-repeat" /> Reset</Button>
                </ButtonGroup>
                <div className="d-flex align-items-center gap-2">
                    <ButtonGroup>
                        <Button variant="outline-secondary" onClick={handleConnect} disabled={!isBoot || connect}><i className="bi bi-play-circle" /> Connect</Button>
                        <Button variant="outline-secondary" onClick={handleDisconnect} disabled={!connect}><i className="bi bi-x-circle" /> Disconnect</Button>
                        <Button variant="outline-secondary" onClick={handleDeleteAllConnection}><i className="bi bi-x-circle" /> Delete Connect</Button>
                    </ButtonGroup>
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
            {connect ? (
                consoleLoading ? (
                    <div style={{ width: "100%", height: "600px", border: "solid 1px #ccc", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Spinner animation="border" role="status" />
                    </div>
                ) : (
                    <div style={{ position: 'relative', width: '100%', height: '600px' }}>
                        <iframe
                            ref={iframeRef}
                            src={consoleUrl}
                            onLoad={refocusIframe} // 在 iframe 載入完成後聚焦
                            title="VM Console"
                            width="100%"
                            height="100%"
                            style={{ border: "solid 1px #ccc" }}
                            allowFullScreen
                        />
                        {/* 讓 SSH 連線的 iframe 可點擊以聚焦的透明div */}
                        {consoleType === 'SSH' && (
                            <div
                                onClick={refocusIframe}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    zIndex: 10,
                                    backgroundColor: 'transparent'
                                }}
                            />
                        )}
                    </div>
                )
            ) : (
                <div style={{ width: "100%", height: "600px", border: "solid 1px #ccc", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {!isBoot && <span>VM is not running</span>}
                    {isBoot && <span>VM is running, but not connected</span>}
                </div>
            )}
        </div>
    );
}