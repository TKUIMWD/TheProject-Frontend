import { Form, InputGroup, Tab, Tabs } from "react-bootstrap";
import { VMDetailWithBasicConfig } from "../../../interface/VM/VM";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "../../../context/ToastProvider";
import { asyncGet } from "../../../utils/fetch";
import { vm_api } from "../../../enum/api";
import { VMTable } from "./VMTable";
import "../../../style/dashboard/VM/VMList.css";

// 1. 修改 SearchBar 接收 props
interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
    return (
        <InputGroup className="mb-3">
            <Form.Control
                placeholder="依據名稱或 ID 搜尋"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </InputGroup>
    )
}

export default function VMList() {
    // 搜尋用 state
    const [runningSearchTerm, setRunningSearchTerm] = useState("");
    const [stoppedSearchTerm, setStoppedSearchTerm] = useState("");

    const [runningVMs, setRunningVMs] = useState<VMDetailWithBasicConfig[]>([]);
    const [stoppedVMs, setStoppedVMs] = useState<VMDetailWithBasicConfig[]>([]);
    const { showToast } = useToast();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast("請先登入", "danger");
            return;
        }
        const options = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
        asyncGet(vm_api.getUsersOwnedVMs, options)
            .then((res) => {
                if (res.code === 200) {
                    setRunningVMs(res.body.filter((vm: VMDetailWithBasicConfig) => vm.status?.current_status === "running"));
                    setStoppedVMs(res.body.filter((vm: VMDetailWithBasicConfig) => vm.status?.current_status === "stopped"));
                } else {
                    throw new Error(res.message || "無法取得機器列表");
                }
            })
            .catch((err) => {
                showToast("無法取得機器列表：" + err.message, "danger");
                console.error("Error fetching machines:", err);
            })
    }, []);

    // 根據搜尋字詞計算過濾後的列表
    const filteredRunningVMs = useMemo(() => {
        if (!runningSearchTerm) return runningVMs;
        return runningVMs.filter(vm =>
            vm.pve_vmid.toString().toLowerCase().includes(runningSearchTerm.toLowerCase())
        );
    }, [runningVMs, runningSearchTerm]);

    const filteredStoppedVMs = useMemo(() => {
        if (!stoppedSearchTerm) return stoppedVMs;
        return stoppedVMs.filter(vm =>
            vm.pve_vmid.toString().toLowerCase().includes(stoppedSearchTerm.toLowerCase())
        );
    }, [stoppedVMs, stoppedSearchTerm]);

    return (
        <>
            <h3>我的機器</h3>
            <hr />
            <Tabs
                defaultActiveKey="running"
                className="mb-3"
            >
                <Tab eventKey="running" title={`運行中 (${filteredRunningVMs.length})`}>
                    <SearchBar
                        searchTerm={runningSearchTerm}
                        onSearchChange={setRunningSearchTerm}
                    />
                    <VMTable
                        VMs={filteredRunningVMs}
                        isSelectMode={false}
                    />
                </Tab>
                <Tab eventKey="stopped" title={`關機 (${filteredStoppedVMs.length})`}>
                    <SearchBar
                        searchTerm={stoppedSearchTerm}
                        onSearchChange={setStoppedSearchTerm}
                    />
                    <VMTable
                        VMs={filteredStoppedVMs}
                        isSelectMode={false}
                    />
                </Tab>
            </Tabs>
        </>
    );
}