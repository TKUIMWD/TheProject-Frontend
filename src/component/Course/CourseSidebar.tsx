import { CreateVMCard, OwnerCard } from "../BoxAndCourseUniversal/Sidebar";
import { UserProfile } from "../../interface/User/User";
import { useToast } from "../../context/ToastProvider";
import { getOptions } from "../../utils/token";
import {  asyncPost } from "../../utils/fetch";
import {  vm_manage_api } from "../../enum/api";
import { GBtoMB } from "../../utils/StorageUnitsConverter";
import { VM_Template_Info } from "../../interface/VM/VM_Template";

interface CourseSidebarProps {
    template?: VM_Template_Info;
    submitter: UserProfile | null;
}

export default function CourseSidebar({ template, submitter }: CourseSidebarProps) {
    const { showToast } = useToast();

    const handleCreateVM = (name: string, cpuCores: number, memorySize: number, diskSize: number) => {
        if (!template) {
            return;
        }

        try {
            const options = getOptions();
            const body = {
                template_id: template._id,
                name: name,
                target: "gapvea",
                cpuCores: cpuCores,
                memorySize: GBtoMB(memorySize),
                diskSize: diskSize,
            };
            showToast("虛擬機建立中，請稍後至儀表板查看", "info");
            asyncPost(vm_manage_api.createFromTemplate, body, options)
                .then((res) => {
                    if (res.code === 200) {
                        showToast("虛擬機建立成功", "success");
                    } else {
                        throw new Error(res.message || "無法建立虛擬機");
                    }
                })
                .catch((err) => {
                    showToast(`無法建立虛擬機: ${err.message}`, "danger");
                    console.error(`無法建立虛擬機: ${err.message}`);
                });
        } catch (error: any) {
            showToast(`無法建立虛擬機: ${error.message}`, "danger");
            console.error(`無法建立虛擬機: ${error.message}`);
        }
    }

    return (
        <div>
            {template && <CreateVMCard boxOrTemplate={template} handleCreateVM={handleCreateVM} />}
            <OwnerCard user={submitter} />
        </div>
    );
}