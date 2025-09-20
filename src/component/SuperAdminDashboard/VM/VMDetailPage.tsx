import { Breadcrumb, Container, Tab, Tabs } from "react-bootstrap";
import VMInfo from "./VMInfo";
import { VMDetailProvider, useVMDetail } from "../../../context/VMDetailContext"; // 引入 Provider
import { useState } from "react";
import VMConsole from "./VMConsole";
import Loading from "../../Loading";

function VMDetailContent() {
    const context = useVMDetail();
    const [activeTab, setActiveTab] = useState('about');
    if (!context) {
        return <div>Loading...</div>;
    }

    const { vmDetail } = context;
    if (!vmDetail) {
        return (
            <Loading />
        );
    }

    return (
        <Container className="mt-4">
            <Breadcrumb>
                <Breadcrumb.Item href="/superadmin/dashboard?tab=MachineManagement">機器總覽</Breadcrumb.Item>
                <Breadcrumb.Item active>虛擬機資訊（{vmDetail.pve_name}）</Breadcrumb.Item>
            </Breadcrumb>

            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || 'about')}
                className="mb-3"
            >
                <Tab eventKey="about" title="關於">
                    <VMInfo VM_name={vmDetail.pve_vmid} VM_pve_node={vmDetail.pve_node} isActive={activeTab === 'about'} />
                </Tab>
                <Tab eventKey="console" title="終端">
                    <VMConsole />
                </Tab>
            </Tabs>
        </Container>
    );
}

export default function VMDetailPage() {
    return (
        <VMDetailProvider>
            <VMDetailContent />
        </VMDetailProvider>
    );
}