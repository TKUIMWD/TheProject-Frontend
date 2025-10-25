import { Breadcrumb, Container } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { pve_api } from "../../../enum/api"
import { asyncGet } from "../../../utils/fetch"
import VMConsole from "../../SuperAdminDashboard/VM/VMConsole"
import VMDrawer from "../../VMDrawer/VMDrawer"
import { addVMToHistory } from "../../../utils/vmHistory"
import "../../../style/dashboard/VM/UserVMConsole.css"

export default function UserVMConsole() {
    const { vmId } = useParams();
    const [VMName, setVMName] = useState<string>("");

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!vmId || !token) return;
        const options = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        asyncGet(`${pve_api.getQemuConfig}?id=${vmId}`, options)
            .then((res) => {
                if (res.code === 200) {
                    const vmName = res.body.name;
                    setVMName(vmName);
                    // 添加到訪問歷史
                    if (vmId) {
                        addVMToHistory(vmId, vmName);
                    }
                } else {
                    throw new Error(res.message || "無法取得虛擬機名稱");
                }
            })
            .catch((err) => {
                console.error("Error fetching VM name:", err);
            })
    }, [vmId])

    return (
        <>
            <VMDrawer />
            <div className="user-vm-console">
                <Container>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/dashboard?tab=VMList">Dashboard</Breadcrumb.Item>
                        <Breadcrumb.Item active>虛擬機終端（{VMName}）</Breadcrumb.Item>
                    </Breadcrumb>
                    <h3>虛擬機終端（{VMName}）</h3>
                    <hr />
                    <VMConsole />
                </Container>
            </div>
        </>
    )
}