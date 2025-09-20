import { Form, Col, Row, Button, InputGroup } from "react-bootstrap";
import { VM_Box_Info } from "../../interface/VM/VM_Box";
import { useState } from "react";
import { useToast } from "../../context/ToastProvider";
// import { getOptions } from "../../utils/token";
// import { asyncPost } from "../../utils/fetch";
// import { box_api } from "../../enum/api";

export default function BoxAnswerArea({ box }: { box: VM_Box_Info }) {
    const [flagValues, setFlagValues] = useState<{ [key: string]: string }>({});
    const { showToast } = useToast();

    const handleInputChange = (flagName: string, value: string) => {
        setFlagValues(prev => ({
            ...prev,
            [flagName]: value
        }));
    };

    const handleSingleSubmit = (flagName: string) => {
        const valueToSubmit = flagValues[flagName];
        if (!valueToSubmit) {
            console.warn(`嘗試提交空的 Flag: ${flagName}`);
            showToast(`您的答案是空值`, "danger");
            return;
        }
        // try {

        //     const options = getOptions();
        //     const body = {
        //         vm_id: vm_id,
        //         flag_name: flagName,
        //         flag_value: valueToSubmit
        //     }
        //     asyncPost(box_api.subitBoxAnswer, body, options)
        //         .then((res) => {
        //             if (res.code === 200) {
        //                 showToast(`Flag ${flagName} 提交成功`, "success");
        //             } else {
        //                 throw new Error(res.message || `Flag ${flagName} 提交失敗`);
        //             }
        //         })
        // } catch (error: any) {
        //     showToast(error.message, "danger");
        //     console.error("提交 Flag 時發生錯誤：", error);
        // }
    };

    const flagsToRender = Array.from({ length: box.flag_count || 0 }, (_, i) => i + 1);

    return (
        <Form className="tab-pane-content">
            <Row className="mb-4">
                <Col>
                    <h5><b>作答區</b></h5>
                    <p className="text-muted">請先建立虛擬機，並在下方輸入您找到的 flag 並提交。</p>
                </Col>
            </Row>

            {flagsToRender.length > 0 ? (
                flagsToRender.map((flagNumber) => {
                    const flagNameKey = `flag${flagNumber}`;
                    return (
                        <Form.Group key={flagNumber} as={Row} className="mb-3 align-items-end" controlId={`formFlag-${flagNumber}`}>
                            <Col md={10} lg={8}>
                                <Form.Label>{`Flag ${flagNumber}`}:</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        placeholder={`請輸入 Flag ${flagNumber} 的值`}
                                        value={flagValues[flagNameKey] || ''}
                                        onChange={(e) => handleInputChange(flagNameKey, e.target.value)}
                                    />
                                    <Button
                                        variant="outline-success"
                                        type="button"
                                        onClick={() => handleSingleSubmit(flagNameKey)}
                                        disabled={!flagValues[flagNameKey]}
                                    >
                                        提交
                                    </Button>
                                </InputGroup>
                            </Col>
                        </Form.Group>
                    );
                })
            ) : (
                <p className="text-muted">此 Box 沒有需要作答的 Flag。</p>
            )}
        </Form>
    );
}