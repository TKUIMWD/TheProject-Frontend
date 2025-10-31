import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Badge, Alert } from "react-bootstrap";
import { useToast } from "../context/ToastProvider";
import "../style/AttackDefence.css";

interface CreateScenarioForm {
    scenario_name: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard" | "";
    duration_in_minutes: number;
    max_teams: number;
    scenario_type: "Red vs Blue" | "Multi Team" | "King of the Hill" | "";
    start_time: string;
}

export default function CreateScenario() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [formData, setFormData] = useState<CreateScenarioForm>({
        scenario_name: "",
        description: "",
        difficulty: "",
        duration_in_minutes: 120,
        max_teams: 4,
        scenario_type: "",
        start_time: ""
    });

    const handleInputChange = (field: keyof CreateScenarioForm, value: any) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };

    const validateForm = (): boolean => {
        if (!formData.scenario_name.trim()) {
            showToast("請輸入場景名稱", "warning");
            return false;
        }

        if (!formData.description.trim()) {
            showToast("請輸入場景描述", "warning");
            return false;
        }

        if (!formData.difficulty) {
            showToast("請選擇難度", "warning");
            return false;
        }

        if (!formData.scenario_type) {
            showToast("請選擇場景類型", "warning");
            return false;
        }

        if (formData.duration_in_minutes <= 0) {
            showToast("請設定有效的場景時長", "warning");
            return false;
        }

        if (formData.max_teams <= 0) {
            showToast("請設定有效的最大隊伍數", "warning");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        try {
            // TODO: 實際 API 呼叫
            // const res = await asyncPost(
            //     attack_defence_api.createScenario,
            //     formData,
            //     getOptions()
            // );

            setTimeout(() => {
                showToast("場景建立成功！", "success");
                navigate("/attackAndDefence");
            }, 1000);
        } catch (error: any) {
            showToast("建立場景失敗", "danger");
            setSubmitting(false);
        }
    };

    return (
        <div className="create-scenario-page">
            <Container>
                {/* 返回按鈕 */}
                <Row className="mb-3">
                    <Col>
                        <Button 
                            variant="link" 
                            className="text-decoration-none p-0"
                            onClick={() => navigate('/attackAndDefence')}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            返回場景列表
                        </Button>
                    </Col>
                </Row>

                {/* 頁面標題 */}
                <Row className="mb-4">
                    <Col>
                        <h2>
                            <i className="bi bi-plus-circle me-2"></i>
                            建立攻防場景
                        </h2>
                        <p className="text-muted">
                            設定場景基本資訊，之後可以新增 Flags 和 VM 環境配置
                        </p>
                    </Col>
                </Row>

                <Row>
                    <Col lg={8}>
                        {/* 基本資訊 */}
                        <Card className="mb-4">
                            <Card.Header>
                                <i className="bi bi-info-circle me-2"></i>
                                基本資訊
                            </Card.Header>
                            <Card.Body>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            場景名稱 <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="例如：Web 應用程式攻防"
                                            value={formData.scenario_name}
                                            onChange={(e) => handleInputChange('scenario_name', e.target.value)}
                                            maxLength={100}
                                        />
                                        <Form.Text className="text-muted">
                                            最多 100 個字元
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            場景描述 <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            placeholder="詳細描述場景內容、學習目標和演練方式..."
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            maxLength={500}
                                        />
                                        <Form.Text className="text-muted">
                                            {formData.description.length} / 500 字元
                                        </Form.Text>
                                    </Form.Group>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    難度 <span className="text-danger">*</span>
                                                </Form.Label>
                                                <div className="d-flex gap-2">
                                                    {['Easy', 'Medium', 'Hard'].map((level) => (
                                                        <Button
                                                            key={level}
                                                            variant={formData.difficulty === level ? 
                                                                (level === 'Easy' ? 'success' : level === 'Medium' ? 'warning' : 'danger') : 
                                                                'outline-secondary'
                                                            }
                                                            onClick={() => handleInputChange('difficulty', level)}
                                                            className="flex-grow-1"
                                                        >
                                                            {level === 'Easy' ? '簡單' : level === 'Medium' ? '中等' : '困難'}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    場景類型 <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Select
                                                    value={formData.scenario_type}
                                                    onChange={(e) => handleInputChange('scenario_type', e.target.value)}
                                                >
                                                    <option value="">請選擇</option>
                                                    <option value="Red vs Blue">Red vs Blue (紅藍對抗)</option>
                                                    <option value="Multi Team">Multi Team (多隊混戰)</option>
                                                    <option value="King of the Hill">King of the Hill (山丘之王)</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    場景時長 (分鐘) <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min="30"
                                                    max="480"
                                                    step="30"
                                                    value={formData.duration_in_minutes}
                                                    onChange={(e) => handleInputChange('duration_in_minutes', parseInt(e.target.value))}
                                                />
                                                <Form.Text className="text-muted">
                                                    建議 30-480 分鐘
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    最大隊伍數 <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min="2"
                                                    max="20"
                                                    value={formData.max_teams}
                                                    onChange={(e) => handleInputChange('max_teams', parseInt(e.target.value))}
                                                />
                                                <Form.Text className="text-muted">
                                                    2-20 個隊伍
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            開始時間 (選填)
                                        </Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={formData.start_time}
                                            onChange={(e) => handleInputChange('start_time', e.target.value)}
                                        />
                                        <Form.Text className="text-muted">
                                            不設定將以草稿形式儲存
                                        </Form.Text>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>

                        {/* 場景類型說明 */}
                        <Card className="mb-4">
                            <Card.Header>
                                <i className="bi bi-question-circle me-2"></i>
                                場景類型說明
                            </Card.Header>
                            <Card.Body>
                                <div className="scenario-type-explanation">
                                    <div className="type-item">
                                        <h6>
                                            <Badge bg="danger" className="me-2">Red vs Blue</Badge>
                                            紅藍對抗
                                        </h6>
                                        <p className="text-muted small mb-0">
                                            經典對抗模式，紅隊負責攻擊，藍隊負責防守。適合學習攻防技術。
                                        </p>
                                    </div>
                                    <hr />
                                    <div className="type-item">
                                        <h6>
                                            <Badge bg="primary" className="me-2">Multi Team</Badge>
                                            多隊混戰
                                        </h6>
                                        <p className="text-muted small mb-0">
                                            多個隊伍同時競爭，攻擊其他隊伍的同時也要防守自己。競爭激烈。
                                        </p>
                                    </div>
                                    <hr />
                                    <div className="type-item">
                                        <h6>
                                            <Badge bg="warning" className="me-2">King of the Hill</Badge>
                                            山丘之王
                                        </h6>
                                        <p className="text-muted small mb-0">
                                            控制關鍵系統越久得分越高。需要持續攻擊和防禦來維持控制權。
                                        </p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* 右側：提示與預覽 */}
                    <Col lg={4}>
                        {/* 建立提示 */}
                        <Card className="mb-3">
                            <Card.Header>
                                <i className="bi bi-lightbulb me-2"></i>
                                建立提示
                            </Card.Header>
                            <Card.Body>
                                <Alert variant="info" className="small">
                                    <strong>建立步驟：</strong>
                                    <ol className="mb-0 ps-3">
                                        <li>填寫基本資訊</li>
                                        <li>建立後可新增 Flags</li>
                                        <li>配置 VM 環境</li>
                                        <li>設定目標和規則</li>
                                        <li>發布場景開始對抗</li>
                                    </ol>
                                </Alert>

                                <Alert variant="warning" className="small mb-0">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    <strong>注意事項：</strong>
                                    <ul className="mb-0 ps-3">
                                        <li>場景名稱要簡潔明瞭</li>
                                        <li>描述要詳細說明學習目標</li>
                                        <li>難度要符合目標學員程度</li>
                                        <li>時長要考慮任務複雜度</li>
                                    </ul>
                                </Alert>
                            </Card.Body>
                        </Card>

                        {/* 場景預覽 */}
                        <Card>
                            <Card.Header>
                                <i className="bi bi-eye me-2"></i>
                                場景預覽
                            </Card.Header>
                            <Card.Body>
                                {formData.scenario_name ? (
                                    <>
                                        <h6 className="mb-2">{formData.scenario_name}</h6>
                                        {formData.difficulty && (
                                            <Badge 
                                                bg={
                                                    formData.difficulty === 'Easy' ? 'success' : 
                                                    formData.difficulty === 'Medium' ? 'warning' : 
                                                    'danger'
                                                }
                                                className="me-2 mb-2"
                                            >
                                                {formData.difficulty === 'Easy' ? '簡單' : 
                                                 formData.difficulty === 'Medium' ? '中等' : '困難'}
                                            </Badge>
                                        )}
                                        {formData.scenario_type && (
                                            <Badge bg="secondary" className="mb-2">
                                                {formData.scenario_type}
                                            </Badge>
                                        )}
                                        {formData.description && (
                                            <p className="text-muted small mt-2 mb-2">
                                                {formData.description}
                                            </p>
                                        )}
                                        <div className="scenario-meta-preview">
                                            <small className="text-muted d-block">
                                                <i className="bi bi-clock me-1"></i>
                                                {Math.floor(formData.duration_in_minutes / 60)}h {formData.duration_in_minutes % 60}m
                                            </small>
                                            <small className="text-muted d-block">
                                                <i className="bi bi-people me-1"></i>
                                                最多 {formData.max_teams} 隊伍
                                            </small>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-muted text-center mb-0">
                                        <i className="bi bi-inbox"></i>
                                        <br />
                                        開始填寫場景資訊
                                    </p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* 底部操作按鈕 */}
                <Row className="mt-4 mb-5">
                    <Col>
                        <div className="d-flex justify-content-end gap-2">
                            <Button 
                                variant="outline-secondary"
                                size="lg"
                                onClick={() => navigate('/attackAndDefence')}
                            >
                                取消
                            </Button>
                            <Button 
                                className="btn-custom btn-light-blue"
                                size="lg"
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        建立中...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-circle me-2"></i>
                                        建立場景
                                    </>
                                )}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
