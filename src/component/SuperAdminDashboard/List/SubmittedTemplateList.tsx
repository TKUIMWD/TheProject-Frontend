import { Button, Table } from "react-bootstrap";
import { formatISOString } from "../../../utils/timeFormat";
import { MBtoGB } from "../../../utils/StorageUnitsConverter";
import { SubmittedTemplateDetails } from "../../../interface/Template/SubmittedTemplate";

interface SubmittedTemplateCardProps {
    templates: SubmittedTemplateDetails[]
}

export default function SubmittedTemplateList({ templates }: SubmittedTemplateCardProps) {
    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr className="text-center">
                        <th>#</th>
                        <th>名稱</th>
                        <th>描述</th>
                        <th>CPU(核)</th>
                        <th>記憶體(GB)</th>
                        <th>磁碟(GB)</th>
                        <th>擁有者</th>
                        <th>提交日期</th>
                        <th>核准</th>
                    </tr>
                </thead>
                <tbody>
                    {templates.map((template, index) => (
                        <tr key={template._id} className="text-center">
                            <td>{index + 1}</td>
                            <td>{template.template_name}</td>
                            <td>{template.template_description}</td>
                            <td>{template.default_cpu_cores}</td>
                            <td>{MBtoGB(template.default_memory_size)}</td>
                            <td>{template.default_disk_size}</td>
                            <td>{template.submitter_user_info?.username}</td>
                            <td>{template.submitted_date ? formatISOString(template.submitted_date) : ''}</td>
                            <td>
                                <div className="d-flex gap-2 justify-content-center">
                                    <Button variant="outline-success">核准</Button>
                                    <Button variant="outline-danger">拒絕</Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}
