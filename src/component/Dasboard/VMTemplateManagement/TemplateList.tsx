import { useEffect, useRef, useState } from "react";
import { Dropdown, Tab, Table, Tabs } from "react-bootstrap";
import { asyncDelete, asyncGet, asyncPost } from "../../../utils/fetch";
import { vm_template_api, vm_template_manage_api } from "../../../enum/api";
import { useToast } from "../../../context/ToastProvider";
import { VM_Template_Info } from "../../../interface/VM/VM_Template";
import { MBtoGB } from "../../../utils/StorageUnitsConverter";
import UpdateTemplate from "./UpdateTemplate";

interface VMTemplateListProps {
    isSelectMode: boolean;
    handleSelect?: (template_id: string) => void;
}

export default function VMTemplateList({ isSelectMode, handleSelect }: VMTemplateListProps) {
    const { showToast } = useToast();
    const [ownTemplates, setOwnTemplates] = useState<VM_Template_Info[]>([]);
    const [publicTemplates, setPublicTemplates] = useState<VM_Template_Info[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    // 儲存所有 dropdown 的 DOM 節點
    const dropdownRefs = useRef<Record<string, HTMLTableCellElement | null>>({});
    // update
    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
    const [editingTemplate, setEditingTemplate] = useState<VM_Template_Info | null>(null);

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

    useEffect(() => {
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

    // 如果點擊的是已開啟的 dropdown，則關閉它，否則開啟點擊的 dropdown
    const handleDropdownToggle = (vm_id: string) => {
        setOpenDropdownId(prevId => (prevId === vm_id ? null : vm_id));
    };

    const handleTemplateSelection = (templateId: string) => {
        if (!isSelectMode) return;
        setSelectedTemplateId(templateId);

        if (handleSelect) {
            handleSelect(templateId);
        }
    };

    const handleUpdate = (template: VM_Template_Info) => {
        if (!template) {
            showToast("無效的範本", "danger");
            return;
        }
        setEditingTemplate(template);
        setShowUpdateModal(true);
    }

    const handleDelete = (templateId: string) => {
        const confirmDelete = window.confirm("確定要刪除這個範本嗎？此操作無法復原。");
        if (confirmDelete) {
            asyncDelete(vm_template_manage_api.delete, { template_id: templateId }, options)
                .then((res) => {
                    if (res.code === 200) {
                        showToast("範本刪除成功", "success");
                        // 刪除後從列表中移除該範本
                        setOwnTemplates(prev => prev.filter(t => t._id !== templateId));
                        setPublicTemplates(prev => prev.filter(t => t._id !== templateId));
                    } else {
                        throw new Error(res.message || "無法刪除範本");
                    }
                })
                .catch((err) => {
                    showToast("範本刪除失敗：" + err.message, "danger");
                });
        }
    };

    const handleSubmit = (templateId: string) => {
        asyncPost(vm_template_api.submitTemplate, { template_id: templateId }, options)
            .then((res) => {
                if (res.code === 200) {
                    showToast("範本提交成功", "success");
                } else {
                    throw new Error(res.message || "無法提交範本");
                }
            })
            .catch((err) => {
                showToast("範本提交失敗：" + err.message, "danger");
            });
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
                    {!isSelectMode && (
                        <td onClick={(e) => e.stopPropagation()} ref={el => { dropdownRefs.current[template._id] = el; }}>
                            <Dropdown
                                show={openDropdownId === template._id}
                                drop='down'
                            >
                                <Dropdown.Toggle
                                    variant="none"
                                    className="no-caret"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDropdownToggle(template._id);
                                    }}>
                                    <i className="bi bi-three-dots-vertical" />
                                </Dropdown.Toggle>

                                <Dropdown.Menu style={{ zIndex: 1000 }}>
                                    <Dropdown.Item onClick={(e) => {
                                        e.stopPropagation();
                                        handleSubmit(template._id);
                                    }}>
                                        <i className="bi bi-arrow-up-right-circle" /> 提交
                                    </Dropdown.Item>

                                    <Dropdown.Item onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdate(template);
                                    }}>
                                        <i className="bi bi-repeat" /> 更新
                                    </Dropdown.Item>

                                    <Dropdown.Item onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(template._id);
                                    }}>
                                        <span className="text-danger"><i className="bi bi-trash" /> 刪除</span>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </td>
                    )}
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
                        <th>提交者</th>
                        {!isSelectMode && <th>操作</th>}
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
            <UpdateTemplate show={showUpdateModal} handleClose={() => setShowUpdateModal(false)} template={editingTemplate} />
        </>
    );
}