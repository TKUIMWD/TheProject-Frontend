import { Dropdown, Table } from "react-bootstrap";
import { asyncDelete, asyncGet } from "../../../utils/fetch";
import { useEffect, useRef, useState } from "react";
import { VMDetailWithBasicConfig } from "../../../interface/VM/VM";
import { useToast } from "../../../context/ToastProvider";
import { pve_api, vm_manage_api } from "../../../enum/api";
import { useNavigate } from "react-router-dom";
import UpdateVMModal from "./UpdateVMModal";
import { getAuthStatus } from "../../../utils/token";

interface TableContentProps {
    VMs: VMDetailWithBasicConfig[];
    isSelectMode: boolean;
    handleSelectedVM?: (id: string) => void;
}

export function VMTable({ VMs, isSelectMode, handleSelectedVM }: TableContentProps) {
    const [selectedVMId, setSelectedVMId] = useState<string>("");
    const [vmsWithNames, setVmsWithNames] = useState<VMDetailWithBasicConfig[]>([]);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    // 儲存所有 dropdown 的 DOM 節點
    const dropdownRefs = useRef<Record<string, HTMLTableCellElement | null>>({});
    // update 用
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [editingVMId, setEditingVMId] = useState<string | null>(null);

    const { showToast } = useToast();
    const navigater = useNavigate();

    const token = localStorage.getItem('token');
    if (!token) {
        showToast("請先登入", "danger");
        return;
    }
    const options = { headers: { "Authorization": `Bearer ${token}` } };

    const role = getAuthStatus();

    // get node info (name)
    useEffect(() => {
        const promises = VMs.map(vm =>
            asyncGet(`${pve_api.getQemuConfig}?id=${vm._id}`, options)
                .then(res => {
                    if (res.code === 200) {
                        return { ...vm, pve_name: res.body.name };
                    }
                    // 如果失敗，也回傳原始的 vm 物件，避免資料遺失
                    return vm;
                })
                .catch(err => {
                    console.error(`Error fetching name for ${vm._id}:`, err);
                    return vm; // 發生錯誤時也回傳原始 vm
                })
        );

        Promise.all(promises).then(updatedVMs => {
            setVmsWithNames(updatedVMs);
        });

    }, [VMs]);

    // 處理點擊外部關閉的邏輯
    useEffect(() => {
        // 如果沒有任何 dropdown 是開啟的，就不用做任何事
        if (openDropdownId === null) return;

        function handleClickOutside(event: MouseEvent) {
            // 獲取當前開啟的 dropdown 的 ref
            const currentDropdownRef = dropdownRefs.current[openDropdownId!];
            // 如果點擊的目標不在 dropdown 內部，就關閉它
            if (currentDropdownRef && !currentDropdownRef.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        }

        // 新增事件監聽器
        document.addEventListener("mousedown", handleClickOutside);
        // 清理函式：在 effect 結束後移除監聽器
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDropdownId]);

    const handleVMSelection = (vm_id: string) => {
        if (!isSelectMode) return;
        setSelectedVMId(vm_id);
        if (handleSelectedVM) {
            handleSelectedVM(vm_id);
        }
    }

    const handleItemClick = (vm_id: string) => {
        if (isSelectMode) {
            return;
        }
        navigater(`/vmDetail/${vm_id}`);
    }

    // 如果點擊的是已開啟的 dropdown，則關閉它，否則開啟點擊的 dropdown
    const handleDropdownToggle = (vm_id: string) => {
        setOpenDropdownId(prevId => (prevId === vm_id ? null : vm_id));
    };

    function handleUpdate(vm_id: string): void {
        setEditingVMId(vm_id);
        setShowUpdateModal(true);
        setOpenDropdownId(null); // 關閉 dropdown
    }

    function handleDelete(vm_id: string): void {
        const confirmed = confirm("確定要刪除這個虛擬機器嗎？該操作無法復原！");
        if (!confirmed) return;

        showToast(`正在刪除中...`, "info");
        asyncDelete(vm_manage_api.deleteVM, { vm_id }, options)
            .then(res => {
                if (res.code === 200) {
                    showToast("刪除成功", "success");
                    setVmsWithNames(prev => prev.filter(vm => vm._id !== vm_id));
                } else if (res.code !== 200) {
                    showToast(`刪除失敗：${res.message || "非預期錯誤"}`, "danger");
                }
            });
    }

    const handleCloseModal = () => {
        setShowUpdateModal(false);
        setEditingVMId(null);
    };

    if (VMs.length === 0) {
        return (
            <div className="text-center">
                <p>沒有符合條件的機器。</p>
            </div>
        );
    }

    return (
        <>
            <Table hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>VM_id</th>
                        <th>名稱</th>
                        <th>節點名稱</th>
                        <th>狀態</th>
                        {!isSelectMode && <th>操作</th>}
                    </tr>
                </thead>
                <tbody>
                    {vmsWithNames.map((vm, index) => {
                        return (
                            <tr key={vm.pve_vmid} onClick={() => handleItemClick(vm._id)} style={{ cursor: 'pointer' }}>
                                <td>
                                    {isSelectMode ? (
                                        <input
                                            type="radio"
                                            name="vm-selection"
                                            value={vm._id}
                                            checked={selectedVMId === vm._id}
                                            onChange={() => handleVMSelection(vm._id)}
                                        />
                                    ) : (
                                        index + 1
                                    )}
                                </td>
                                <td>{vm.pve_vmid}</td>
                                <td>{vm.pve_name || "no-name"}</td>
                                <td>{vm.pve_node}</td>
                                <td>{vm.status?.current_status}</td>
                                {!isSelectMode && (
                                    <td onClick={(e) => e.stopPropagation()} ref={el => { dropdownRefs.current[vm._id] = el; }}>
                                        <Dropdown
                                            show={openDropdownId === vm._id}
                                            drop='down'
                                        >
                                            <Dropdown.Toggle
                                                variant="none"
                                                className="no-caret"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDropdownToggle(vm._id);
                                                }}>
                                                <i className="bi bi-three-dots-vertical" />
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu style={{ zIndex: 1000 }}>
                                                {role !== 'user' && <Dropdown.Item onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdate(vm._id);
                                                }}>
                                                    <i className="bi bi-repeat" /> 更新
                                                </Dropdown.Item>}

                                                <Dropdown.Item onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(vm._id);
                                                }}>
                                                    <span className="text-danger"><i className="bi bi-trash" /> 刪除</span>
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                )}
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <UpdateVMModal
                showUpdateModal={showUpdateModal}
                handleCloseModal={handleCloseModal}
                editingVMId={editingVMId || ""}
            />
        </>
    )
}