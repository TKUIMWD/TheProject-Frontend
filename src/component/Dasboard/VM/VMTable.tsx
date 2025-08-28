import { Dropdown, Table } from "react-bootstrap";
import { asyncGet } from "../../../utils/fetch";
import {  useEffect, useState } from "react";
import { VMDetailWithBasicConfig } from "../../../interface/VM/VM";
import { useToast } from "../../../context/ToastProvider";
import { pve_api } from "../../../enum/api";
import { useNavigate } from "react-router-dom";

interface TableContentProps {
    VMs: VMDetailWithBasicConfig[];
    isSelectMode: boolean;
    handleSelectedVM?: (id: string) => void;
}

export function VMTable({ VMs, isSelectMode, handleSelectedVM }: TableContentProps) {
    const [selectedVMId, setSelectedVMId] = useState<string>("");
    const [vmsWithNames, setVmsWithNames] = useState<VMDetailWithBasicConfig[]>([]);
    const { showToast } = useToast();
    const navigater = useNavigate();

    // get node info (name)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast("請先登入", "danger");
            return;
        }
        const options = { headers: { "Authorization": `Bearer ${token}` } };
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

    const handleVMSelection = (vm_id: string) => {
        if (!isSelectMode) return;
        setSelectedVMId(vm_id);
        if (handleSelectedVM) {
            handleSelectedVM(vm_id);
        }
    }

    const handleClick = (vm_id:string) => {
        if (isSelectMode) {
            return;
        }
        navigater(`/vmDetail/${vm_id}`);
    }

    if (VMs.length === 0) {
        return (
            <div className="text-center">
                <p>沒有符合條件的機器。</p>
            </div>
        );
    }

    return (
        <Table hover responsive>
            <thead>
                <tr>
                    <th>#</th>
                    <th>VM_id</th>
                    <th>名稱</th>
                    <th>節點名稱</th>
                    <th>狀態</th>
                    {!isSelectMode && <th>設定</th>}
                </tr>
            </thead>
            <tbody>
                {vmsWithNames.map((vm, index) => {
                    return (
                        <tr key={vm.pve_vmid} onClick={()=>handleClick(vm._id)} style={{ cursor: 'pointer' }}>
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
                            {!isSelectMode &&
                                <td>
                                    <Dropdown drop='down'>
                                        <Dropdown.Toggle variant="none" className="no-caret">
                                            <i className="bi bi-three-dots-vertical" />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu style={{ zIndex: 1000 }}>
                                            <Dropdown.Item href=""><i className="bi bi-repeat" /> 更新</Dropdown.Item>
                                            <Dropdown.Item href=""><span className="text-danger"><i className="bi bi-trash" /> 刪除</span></Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            }
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}