/**
 * VM 訪問歷史管理工具
 * 用於記錄和獲取用戶最近訪問的 VM
 */

const VM_HISTORY_KEY = 'vm_access_history';
const MAX_HISTORY_ITEMS = 10; // 最多保存 10 個歷史記錄

export interface VMHistoryItem {
    vmId: string;
    vmName: string;
    lastAccessTime: number;
}

/**
 * 獲取 VM 訪問歷史
 */
export function getVMHistory(): VMHistoryItem[] {
    try {
        const historyStr = localStorage.getItem(VM_HISTORY_KEY);
        if (!historyStr) return [];
        
        const history = JSON.parse(historyStr) as VMHistoryItem[];
        // 按最近訪問時間排序
        return history.sort((a, b) => b.lastAccessTime - a.lastAccessTime);
    } catch (error) {
        console.warn('無法讀取 VM 訪問歷史:', error);
        return [];
    }
}

/**
 * 添加或更新 VM 訪問記錄
 */
export function addVMToHistory(vmId: string, vmName: string): void {
    try {
        const history = getVMHistory();
        
        // 移除相同的 VM (如果存在)
        const filteredHistory = history.filter(item => item.vmId !== vmId);
        
        // 添加新記錄到開頭
        const newHistory: VMHistoryItem[] = [
            {
                vmId,
                vmName,
                lastAccessTime: Date.now()
            },
            ...filteredHistory
        ].slice(0, MAX_HISTORY_ITEMS); // 限制最大數量
        
        localStorage.setItem(VM_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
        console.warn('無法保存 VM 訪問歷史:', error);
    }
}

/**
 * 從歷史記錄中移除指定 VM
 */
export function removeVMFromHistory(vmId: string): void {
    try {
        const history = getVMHistory();
        const newHistory = history.filter(item => item.vmId !== vmId);
        localStorage.setItem(VM_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
        console.warn('無法移除 VM 訪問歷史:', error);
    }
}

/**
 * 清空所有 VM 訪問歷史
 */
export function clearVMHistory(): void {
    try {
        localStorage.removeItem(VM_HISTORY_KEY);
    } catch (error) {
        console.warn('無法清空 VM 訪問歷史:', error);
    }
}
