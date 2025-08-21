import { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { asyncGet } from '../utils/fetch';
import { pve_api, vm_api } from '../enum/api';
import { VMDetailWithBasicConfig, VMStatus, VMNetwork } from '../interface/VM/VM';

// 定義 Context 要提供的資料結構
interface VMDetailContextType {
    vmDetail: VMDetailWithBasicConfig | null;
    status: VMStatus | null;
    network: VMNetwork | null;
    cpuMax: number | null;
    memoryMax: number | null;
    subscribe: () => void;
    unsubscribe: () => void;
}

const VMDetailContext = createContext<VMDetailContextType | undefined>(undefined);

export function VMDetailProvider({ children }: { children: ReactNode }) {
    const { vmId } = useParams<{ vmId: string }>();
    const [vmDetail, setVmDetail] = useState<VMDetailWithBasicConfig | null>(null);
    const [status, setStatus] = useState<VMStatus | null>(null);
    const [network, setNetwork] = useState<VMNetwork | null>(null);
    const [cpuMax, setCpuMax] = useState<number | null>(null);
    const [memoryMax, setMemoryMax] = useState<number | null>(null);

    // 追蹤有多少個元件正在監聽
    const listenerCount = useRef(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // 獲取Status, Network 資料
    const fetchData = useCallback(() => {
        if (!vmId) return;
        const token = localStorage.getItem("token");
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };

        asyncGet(`${vm_api.getVMStatus}?vm_id=${vmId}`, { headers })
            .then(data => data.code === 200 && setStatus(data.body));
        asyncGet(`${vm_api.getVMNetworkInfo}?vm_id=${vmId}`, { headers })
            .then(data => data.code === 200 && setNetwork(data.body));
    }, [vmId]);

    // 訂閱函式
    const subscribe = useCallback(() => {
        listenerCount.current += 1;
        // 當第一個元件訂閱時，啟動計時器
        if (listenerCount.current === 1) {
            fetchData(); // 立即獲取一次資料
            intervalRef.current = setInterval(fetchData, 5000);
        }
    }, [fetchData]);

    // 取消訂閱函式
    const unsubscribe = useCallback(() => {
        listenerCount.current -= 1;
        // 當最後一個元件取消訂閱時，清除計時器
        if (listenerCount.current === 0 && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);
    

    useEffect(() => {
        if (!vmId) return;
        const token = localStorage.getItem("token");
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };


        // 獲取 VM 完整資訊 (名稱、節點等)
        asyncGet(vm_api.getAllMachines, { headers })
            .then(data => {
                if (data.code === 200) {
                    const VM = data.body.find((vm: VMDetailWithBasicConfig) => vm._id === vmId);
                    setVmDetail(VM);
                }
            });

        // 獲取cpu, memory 最大用量
        asyncGet(`${pve_api.getQemuConfig}?id=${vmId}`, { headers })
            .then(data => {
                if (data.code === 200) {
                    const { cores, memory } = data.body;
                    const memoryInGB = memory / 1024;
                    setCpuMax(cores);
                    setMemoryMax(memoryInGB);
                }
            });
    }, [vmId]);

    const value = { vmDetail, status, network, cpuMax, memoryMax, subscribe, unsubscribe };

    return (
        <VMDetailContext.Provider value={value}>
            {children}
        </VMDetailContext.Provider>
    );
}

// 自訂 Hook，方便子元件使用
export function useVMDetail() {
    const context = useContext(VMDetailContext);
    if (context === undefined) {
        // 如果元件不在 Provider 內，就回傳 null，讓元件知道要用 props 模式
        return null;
    }
    return context;
}