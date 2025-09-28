import { Button, Col, Form, InputGroup, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import VMTemplateList from "../VMTemplateManagement/TemplateList";
import { useState } from "react";
import { getOptions } from "../../../utils/token";
import { useToast } from "../../../context/ToastProvider";
import { asyncPost } from "../../../utils/fetch";
import { box_api } from "../../../enum/api";

interface BoxFormProps {
    handleSubmitBox: (template_id: string, description: string, flagValues: string[]) => void;
}

function BoxTrigger({ message }: { message: string }) {
    const renderTooltip = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
            {message || "No description provided."}
        </Tooltip>
    );
    return (
        <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
        >
            <Button variant="none"><i className="bi bi-question-circle" /></Button>
        </OverlayTrigger>
    );
}

function BoxForm({ handleSubmitBox }: BoxFormProps) {
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [flagValues, setFlagValues] = useState<string[]>(['']);

    const handleTemplateSelect = (template_id: string) => {
        setSelectedTemplateId(template_id);
    };

    // --- Flag 處理函式 ---
    const handleAddFlag = () => {
        setFlagValues([...flagValues, '']);
    };

    const handleRemoveFlag = (index: number) => {
        if (flagValues.length > 1) {
            const newValues = flagValues.filter((_, i) => i !== index);
            setFlagValues(newValues);
        }
    };

    const handleFlagValueChange = (index: number, value: string) => {
        const newValues = [...flagValues];
        newValues[index] = value;
        setFlagValues(newValues);
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleSubmitBox(selectedTemplateId, description, flagValues);
    };

    return (
        <Form onSubmit={handleFormSubmit} className="bg-light p-4 rounded">
            <Form.Group className="mb-3" controlId="BoxForm.temlateId">
                <>
                    <Form.Label>選擇範本</Form.Label>
                    <div style={{
                        height: '300px',
                        overflowY: 'auto',
                        border: '1px solid #dee2e6',
                        borderRadius: '0.375rem',
                    }}>
                        <VMTemplateList isSelectMode={true} handleSelect={handleTemplateSelect} />
                    </div>
                </>
            </Form.Group>

            <Form.Group className="mb-3" controlId="BoxForm.description">
                <Form.Label>Box 設置說明<BoxTrigger message="請填寫詳細的Box設定資訊，支援Markdown語法" /></Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="請填寫詳細的Box設定資訊"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label className="mb-0">Flag 答案 (非必填)</Form.Label>
                    <Button variant="outline-secondary" size="sm" onClick={handleAddFlag}>
                        <i className="bi bi-plus-circle"></i> 新增 Flag
                    </Button>
                </div>

                {flagValues.map((value, index) => (
                    <Row key={index} className="mb-2 align-items-center">
                        <Col xs={11}>
                            <InputGroup>
                                <InputGroup.Text style={{ minWidth: '90px' }}>flag{index + 1}</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder={`請輸入 flag${index + 1} 的答案`}
                                    value={value}
                                    onChange={(e) => handleFlagValueChange(index, e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col xs={1} className="text-end">
                            {flagValues.length > 1 && (
                                <Button variant="outline-danger" size="sm" onClick={() => handleRemoveFlag(index)}>
                                    <i className="bi bi-trash"></i>
                                </Button>
                            )}
                        </Col>
                    </Row>
                ))}
            </Form.Group>

            <hr />
            <Button variant="success" type="submit">
                提交
            </Button>
        </Form>
    );
}

export default function SubmitBox() {
    const { showToast } = useToast();

    const handleSubmitBox = (template_id: string, description: string, flagValues: string[]) => {
        try {
            const options = getOptions();
            if (template_id === "" || description === "") {
                showToast("請填寫所有欄位", "danger");
                return;
            }

             // 將 string[] 轉換為後端需要的 { key: value } 物件
            const flagAnswersObject = flagValues.reduce((acc, value, index) => {
                // 只處理有填寫答案的 flag
                if (value.trim() !== '') {
                    const key = `flag${index + 1}`;
                    acc[key] = value.trim();
                }
                return acc;
            }, {} as Record<string, string>); // 初始值為一個空物件

            const body = {
                vmtemplate_id: template_id,
                box_setup_description: description,
                // 只有在 flagAnswersObject 不是空物件時，才加入 flag_answers 欄位
                ...(Object.keys(flagAnswersObject).length > 0 && { flag_answers: flagAnswersObject })
            };

            // console.log("Submitting Box with body:", body);
            // console.log("flag_answers object:", flagAnswersObject);

            asyncPost(box_api.submitBox, body, options)
                .then((res) => {
                    if (res.code === 200) {
                        showToast("Box 提交成功，請等待審核", "success");
                    } else {
                        throw new Error(res.message || "Box 提交失敗");
                    }
                })
                .catch((err) => {
                    showToast(`Box 提交失敗: ${err.message}`, "danger");
                })
        } catch (error: any) {
            showToast(error.message, "danger");
        }

    }

    return (
        <>
            <h3>提交Box<BoxTrigger message="將範本提交成 Box" /></h3>
            <hr />
            <BoxForm handleSubmitBox={handleSubmitBox} />
        </>
    );
}
