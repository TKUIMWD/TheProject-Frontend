import { useEffect, useState } from "react";
import { VM_Box_Info } from "../../interface/VM/VM_Box";
import { UserProfile } from "../../interface/User/User";
import { useToast } from "../../context/ToastProvider";
import { getOptions } from "../../utils/token";
import { asyncGet, asyncPost } from "../../utils/fetch";
import { user_api, vm_manage_api } from "../../enum/api";
import { GBtoMB } from "../../utils/StorageUnitsConverter";
import { CreateVMCard, OwnerCard } from "../BoxAndCourseUniversal/Sidebar";

export default function BoxSidebar({ box }: { box: VM_Box_Info }) {
    const [submitter, setSubmitter] = useState<UserProfile | null>(null);
    const { showToast } = useToast();

    // get owner profile
    useEffect(() => {
        try {
            const options = getOptions();
            asyncGet(user_api.getUserById(box.owner), options)
                .then((res) => {
                    if (res.code === 200) {
                        setSubmitter(res.body);
                    } else {
                        throw new Error(res.message || "無法取得 Submitter 資料");
                    }
                })
                .catch((error) => {
                    showToast(`無法取得擁有者資料: ${error.message}`, "danger");
                    console.error(`無法取得擁有者資料: ${error.message}`);
                });
        } catch (error) {
            showToast(`無法取得擁有者資料: ${error}`, "danger");
            console.error(`無法取得擁有者資料: ${error}`);
        }
    }, []);

    const handleCreateVM = (name: string, cpuCores: number, memorySize: number, diskSize: number) => {
        try {
            const options = getOptions();
            const body = {
                box_id: box._id,
                name: name,
                target: "gapvea",
                cpuCores: cpuCores,
                memorySize: GBtoMB(memorySize),
                diskSize: diskSize,
            };
            showToast("虛擬機建立中，請稍後至儀表板查看", "info");
            asyncPost(vm_manage_api.createFromBoxTemplate, body, options)
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
        <div className="d-flex flex-column gap-4">
            <CreateVMCard boxOrTemplate={box} handleCreateVM={handleCreateVM} />
            <OwnerCard user={submitter} />
        </div>
    );
}