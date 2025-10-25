import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getVMHistory, VMHistoryItem } from '../../utils/vmHistory';
import '../../style/VMDrawer.css';

interface VMDrawerProps {
    onVMChange?: (vmId: string) => void;
}

export default function VMDrawer({ onVMChange }: VMDrawerProps) {
    const navigate = useNavigate();
    const { vmId: currentVmId } = useParams<{ vmId: string }>();
    const [isOpen, setIsOpen] = useState(false);
    const [vmHistory, setVmHistory] = useState<VMHistoryItem[]>([]);

    // 載入 VM 歷史記錄
    useEffect(() => {
        const history = getVMHistory();
        setVmHistory(history);
    }, [currentVmId]); // 當 currentVmId 改變時重新載入

    // 處理 VM 切換
    const handleVMSwitch = (vmId: string) => {
        if (vmId === currentVmId) {
            setIsOpen(false);
            return;
        }

        // 導航到新的 VM 頁面
        navigate(`/vmDetail/${vmId}`);
        
        // 觸發回調
        onVMChange?.(vmId);
        
        // 關閉抽屜
        setIsOpen(false);
    };

    // 如果沒有歷史記錄,不顯示抽屜
    if (vmHistory.length === 0) {
        return null;
    }

    return (
        <>
            {/* 觸發按鈕 */}
            <button 
                className={`vm-drawer-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title="近期使用的 VM"
            >
                <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
                {!isOpen && <span className="vm-drawer-toggle-text">近期 VM</span>}
            </button>

            {/* 抽屜 */}
            <div className={`vm-drawer ${isOpen ? 'open' : ''}`}>
                <div className="vm-drawer-header">
                    <h5>
                        <i className="bi bi-clock-history me-2"></i>
                        近期使用的 VM
                    </h5>
                </div>

                <div className="vm-drawer-content">
                    {vmHistory.length === 0 ? (
                        <div className="vm-drawer-empty">
                            <i className="bi bi-inbox"></i>
                            <p>尚無訪問記錄</p>
                        </div>
                    ) : (
                        <ul className="vm-drawer-list">
                            {vmHistory.map((item) => (
                                <li 
                                    key={item.vmId}
                                    className={`vm-drawer-item ${item.vmId === currentVmId ? 'active' : ''}`}
                                    onClick={() => handleVMSwitch(item.vmId)}
                                >
                                    <div className="vm-drawer-item-content">
                                        <div className="vm-drawer-item-header">
                                            <i className="bi bi-hdd-rack me-2"></i>
                                            <span className="vm-drawer-item-name">
                                                {item.vmName}
                                            </span>
                                            {item.vmId === currentVmId && (
                                                <span className="vm-drawer-item-badge">當前</span>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* 遮罩層 */}
            {isOpen && (
                <div 
                    className="vm-drawer-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
