import { Dropdown, Table } from "react-bootstrap";
import { VM_Template_Info } from "../../../interface/VM/VM_Template";
import { formatISOString } from "../../../utils/timeFormat";
import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastProvider";
import TemplateInfoModal from "../Modal/TemplateInfoModal";
import "../../../style/superAdmin/List/TemplateList.css";
import { getOptions } from "../../../utils/token";
import { asyncGet } from "../../../utils/fetch";
import { user_api } from "../../../enum/api";

interface TemplateCardProps {
    templates: VM_Template_Info[];
    handleDelete: (template_id:string) => void;
}

export default function TemplateCard({ templates, handleDelete }: TemplateCardProps) {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedTemplate, setSelectedTemplate] = useState<VM_Template_Info | null>(null);
    const [ownerNames, setOwnerNames] = useState<Record<string, string>>({});
    const { showToast } = useToast();

    useEffect(() => {
        // 建立一個非同步函式來處理資料獲取
        const fetchOwnerNames = async () => {
            try {
                const options = getOptions();
                // 找出所有 templates 中不重複的 owner ID
                const ownerIds = [...new Set(templates.map(t => t.owner))];

                // 為每一個 ID 發起請求
                for (const id of ownerIds) {
                    // 如果這個 ID 的名字已經在 state 中，就跳過，避免重複請求
                    if (ownerNames[id]) {
                        continue;
                    }

                    const res = await asyncGet(user_api.getUserById(id), options);
                    if (res.code === 200 && res.body.username) {
                        // 更新 state，將新的名字加進去
                        setOwnerNames(prevNames => ({
                            ...prevNames,
                            [id]: res.body.username
                        }));
                    }
                }
            } catch (error: any) {
                showToast(error.message || "獲取使用者資訊時發生錯誤", "danger");
            }
        };

        // 只有在 templates 陣列有內容時才執行
        if (templates.length > 0) {
            fetchOwnerNames();
        }
    }, [templates]);

    const handleRowClick = (template: VM_Template_Info) => {
        setSelectedTemplate(template);
        setShowModal(true);
    }

    // Modal 關閉處理函式
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTemplate(null); // 清空選中的範本
    }

    return (
        <>
            <Table bordered hover>
                <thead>
                    <tr className="text-center">
                        <th style={{ width: '5%' }}>#</th>
                        <th style={{ width: '20%' }}>名稱</th>
                        <th style={{ width: '35%' }}>描述</th>
                        <th style={{ width: '15%' }}>擁有者</th>
                        <th style={{ width: '15%' }}>提交日期</th>
                        <th style={{ width: '10%' }}>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {templates.map((template, index) => (
                        <tr
                            key={template._id}
                            className="text-center align-middle"
                            onClick={() => handleRowClick(template)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{index + 1}</td>
                            <td className="text-start">{template.name}</td>
                            <td className="text-start">{template.description}</td>
                            <td>{ownerNames[template.owner] || '讀取中...'}</td>
                            <td>{template.submitted_date ? formatISOString(template.submitted_date) : ''}</td>
                            <td onClick={(e) => e.stopPropagation()}>
                                <Dropdown>
                                    <Dropdown.Toggle variant="none" className="no-caret">
                                        <i className="bi bi-three-dots-vertical"></i>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item className="text-danger" onClick={() => handleDelete(template._id)}><i className="bi bi-trash" /> 刪除</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <TemplateInfoModal
                show={showModal}
                handleClose={handleCloseModal}
                template={selectedTemplate}
            />
        </>
    );
}
