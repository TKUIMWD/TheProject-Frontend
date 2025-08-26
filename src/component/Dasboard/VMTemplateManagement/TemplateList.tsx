import { useEffect, useState } from "react";
import { Tab, Table, Tabs } from "react-bootstrap";
import { asyncGet } from "../../../utils/fetch";
import { vm_template_api } from "../../../enum/api";
import { useToast } from "../../../context/ToastProvider";
import { VM_Template_Info } from "../../../interface/VM/VM_Template";
import { MBtoGB } from "../../../utils/StorageUnitsConverter";

interface VMTemplateListProps {
    isSelectMode: boolean;
    handleSelect?: (template_id: string) => void;
}

export default function VMTemplateList({ isSelectMode, handleSelect }: VMTemplateListProps) {
    const { showToast } = useToast();
    const [ownTemplates, setOwnTemplates] = useState<VM_Template_Info[]>([]);
    const [publicTemplates, setPublicTemplates] = useState<VM_Template_Info[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

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
        };

        asyncGet(vm_template_api.getAccessibleTemplates, options)
            .then(response => {
                if (response.code === 200) {
                    const own: VM_Template_Info[] = [];
                    const publicT: VM_Template_Info[] = [];
                    response.body.forEach((template: VM_Template_Info) => {
                        if (!template.is_public) {
                            own.push(template);
                        } else {
                            publicT.push(template);
                        }
                    });
                    setOwnTemplates(own);
                    setPublicTemplates(publicT);
                } else {
                    throw new Error(response.message || "無法取得範本");
                }
            })
            .catch(error => {
                showToast("無法取得範本：" + error.message, "danger");
                console.error("Error fetching templates:", error);
            });
    }, []);

    const handleTemplateSelection = (templateId: string) => {
        if (!isSelectMode) return;
        setSelectedTemplateId(templateId);

        if (handleSelect) {
            handleSelect(templateId);
        }
    };

    function createList(templates: VM_Template_Info[]) {
        const items = templates.map((template, index) => {
            return (
                <tr key={template._id}>
                    <td>
                        {isSelectMode ? (
                            <input
                                type="radio"
                                name="template-selection"
                                value={template._id}
                                checked={selectedTemplateId === template._id}
                                onChange={() => handleTemplateSelection(template._id)}
                            />
                        ) : (
                            index + 1
                        )}
                    </td>
                    <td>{template.name}</td>
                    <td>{template.description}</td>
                    <td>{template.default_cpu_cores}</td>
                    <td>{MBtoGB(template.default_memory_size)}</td>
                    <td>{template.default_disk_size}</td>
                    <td>{template.submitter_user_info?.username || "未知"}</td>
                </tr>
            );
        });
        const templateList =
            <Table hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>名稱</th>
                        <th>描述</th>
                        <th>CPU(核)</th>
                        <th>記憶體(GB)</th>
                        <th>磁碟(GB)</th>
                        <th>擁有者</th>
                    </tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </Table>
        return items.length > 0 ? templateList : <div className="text-center"><h5>無範本</h5></div>;
    }

    return (
        <>
            {!isSelectMode && (
                <>
                    <h3>範本列表</h3>
                    <hr />
                </>
            )}
            <Tabs
                defaultActiveKey="own"
            >
                <Tab eventKey="own" title="私有範本">
                    {createList(ownTemplates)}
                </Tab>
                <Tab eventKey="shared" title="公開範本">
                    {createList(publicTemplates)}
                </Tab>
            </Tabs>
        </>
    );
}