import { Table } from "react-bootstrap";
import { VM_Template_Info } from "../../../interface/VM/VM_Template";
import { formatISOString } from "../../../utils/timeFormat";
import { MBtoGB } from "../../../utils/StorageUnitsConverter";

interface TemplateCardProps {
    templates: VM_Template_Info[]
}

export default function TemplateCard({ templates }: TemplateCardProps) {
    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr className="text-center">
                        <th>#</th>
                        <th>名稱</th>
                        <th style={{ width: '45%' }}>描述</th>
                        <th>CPU(核)</th>
                        <th>記憶體(GB)</th>
                        <th>磁碟(GB)</th>
                        <th>擁有者</th>
                        <th>提交日期</th>
                    </tr>
                </thead>
                <tbody>
                    {templates.map((template, index) => (
                        <tr key={template._id} className="text-start align-middle">
                            <td>{index + 1}</td>
                            <td>{template.name}</td>
                            <td>{template.description}</td>
                            <td>{template.default_cpu_cores}</td>
                            <td>{MBtoGB(template.default_memory_size)}</td>
                            <td>{template.default_disk_size}</td>
                            <td>{template.submitter_user_info?.username}</td>
                            <td>{template.submitted_date ? formatISOString(template.submitted_date) : ''}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}
