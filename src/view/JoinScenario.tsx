import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Badge, ListGroup, Alert } from "react-bootstrap";
import { getScenarioById, getTeamsByScenario, AD_Scenario, AD_Team } from "../utils/attackDefenceMockData";
import "../style/AttackDefence.css";

interface JoinOption {
    mode: "existing" | "create";
    selectedTeamId?: number;
    newTeamName?: string;
    newTeamType?: "Red Team" | "Blue Team";
}

export default function JoinScenario() {
    const { scenarioId } = useParams<{ scenarioId: string }>();
    const navigate = useNavigate();
    
    const [scenario, setScenario] = useState<AD_Scenario | null>(null);
    const [teams, setTeams] = useState<AD_Team[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [joinOption, setJoinOption] = useState<JoinOption>({
        mode: "existing"
    });

    useEffect(() => {
        if (scenarioId) {
            loadData(parseInt(scenarioId));
        }
    }, [scenarioId]);

    const loadData = (id: number) => {
        try {
            const scenarioData = getScenarioById(id);
            if (scenarioData) {
                setScenario(scenarioData);
                setTeams(getTeamsByScenario(id));
            } else {
                alert("場景不存在");
                navigate("/attackAndDefence");
            }
        } catch (error) {
            alert("載入失敗");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        setSubmitting(true);
        // 模擬 API 請求
        setTimeout(() => {
            if (joinOption.mode === "existing") {
                alert(`已加入隊伍 ID: ${joinOption.selectedTeamId}`);
            } else {
                alert(`已建立隊伍: ${joinOption.newTeamName} (${joinOption.newTeamType})`);
            }
            setSubmitting(false);
            navigate(`/attackAndDefence/scenarios/${scenarioId}`);
        }, 1000);
    };

    if (loading) {
        return (
            <Container className="py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">載入中...</span>
                    </div>
                </div>
            </Container>
        );
    }

    if (!scenario) {
        return null;
    }

    return (
        <Container fluid className="ad-container py-4">
            {/* 返回按鈕 */}
            <Button 
                variant="link" 
                className="mb-3 text-decoration-none"
                onClick={() => navigate(`/attackAndDefence/scenarios/${scenarioId}`)}
            >
                <i className="bi bi-arrow-left me-2"></i>
                返回場景詳情
            </Button>

            {/* 頁面標題 */}
            <div className="mb-4">
                <h2 className="mb-2">加入場景: {scenario.scenario_name}</h2>
                <p className="text-muted">選擇加入現有隊伍或建立新隊伍來參與這個攻防演練場景</p>
            </div>

            <Row>
                <Col lg={8}>
                    {/* 選擇加入方式 */}
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <h5 className="mb-3">
                                <i className="bi bi-ui-radios me-2"></i>
                                選擇加入方式
                            </h5>
                            <Form>
                                <Form.Check
                                    type="radio"
                                    id="join-existing"
                                    label="加入現有隊伍"
                                    name="joinMode"
                                    checked={joinOption.mode === "existing"}
                                    onChange={() => setJoinOption({ mode: "existing" })}
                                    className="mb-2"
                                />
                                <Form.Check
                                    type="radio"
                                    id="create-new"
                                    label="建立新隊伍"
                                    name="joinMode"
                                    checked={joinOption.mode === "create"}
                                    onChange={() => setJoinOption({ mode: "create" })}
                                />
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* 加入現有隊伍 */}
                    {joinOption.mode === "existing" && (
                        <Card className="shadow-sm">
                            <Card.Header className="bg-light">
                                <i className="bi bi-people me-2"></i>
                                選擇隊伍
                            </Card.Header>
                            <Card.Body>
                                {teams.length > 0 ? (
                                    <ListGroup>
                                        {teams.map(team => (
                                            <ListGroup.Item
                                                key={team.team_id}
                                                action
                                                active={joinOption.selectedTeamId === team.team_id}
                                                onClick={() => team.members.length < team.max_members && 
                                                    setJoinOption({ ...joinOption, selectedTeamId: team.team_id })}
                                                style={{ 
                                                    cursor: team.members.length >= team.max_members ? 'not-allowed' : 'pointer',
                                                    opacity: team.members.length >= team.max_members ? 0.6 : 1
                                                }}
                                            >
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <Badge 
                                                            bg={team.team_type === 'Red Team' ? 'danger' : 'primary'} 
                                                            className="me-2"
                                                        >
                                                            {team.team_type === 'Red Team' ? '紅隊' : '藍隊'}
                                                        </Badge>
                                                        <strong>{team.team_name}</strong>
                                                        <div className="text-muted small mt-1">
                                                            {team.members.length} / {team.max_members} 成員
                                                            {scenario.status === 'Active' && (
                                                                <span className="ms-2">• 分數: {team.score}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {team.members.length >= team.max_members ? (
                                                            <Badge bg="secondary">已滿</Badge>
                                                        ) : (
                                                            <Badge bg="success">可加入</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <Alert variant="info">
                                        <i className="bi bi-info-circle me-2"></i>
                                        目前沒有可加入的隊伍，請建立新隊伍
                                    </Alert>
                                )}
                            </Card.Body>
                        </Card>
                    )}

                    {/* 建立新隊伍 */}
                    {joinOption.mode === "create" && (
                        <Card className="shadow-sm">
                            <Card.Header className="bg-light">
                                <i className="bi bi-plus-circle me-2"></i>
                                建立新隊伍
                            </Card.Header>
                            <Card.Body>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>隊伍名稱</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="輸入隊伍名稱"
                                            value={joinOption.newTeamName || ""}
                                            onChange={(e) => setJoinOption({ 
                                                ...joinOption, 
                                                newTeamName: e.target.value 
                                            })}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>隊伍類型</Form.Label>
                                        <div>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                id="team-type-red"
                                                label={
                                                    <span>
                                                        <Badge bg="danger" className="me-2">紅隊</Badge>
                                                        攻擊方
                                                    </span>
                                                }
                                                name="teamType"
                                                checked={joinOption.newTeamType === "Red Team"}
                                                onChange={() => setJoinOption({ 
                                                    ...joinOption, 
                                                    newTeamType: "Red Team" 
                                                })}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                id="team-type-blue"
                                                label={
                                                    <span>
                                                        <Badge bg="primary" className="me-2">藍隊</Badge>
                                                        防守方
                                                    </span>
                                                }
                                                name="teamType"
                                                checked={joinOption.newTeamType === "Blue Team"}
                                                onChange={() => setJoinOption({ 
                                                    ...joinOption, 
                                                    newTeamType: "Blue Team" 
                                                })}
                                            />
                                        </div>
                                    </Form.Group>

                                    {scenario.current_teams >= scenario.max_teams && (
                                        <Alert variant="warning" className="mt-3">
                                            <i className="bi bi-exclamation-triangle me-2"></i>
                                            場景已達最大隊伍數限制
                                        </Alert>
                                    )}
                                </Form>
                            </Card.Body>
                        </Card>
                    )}
                </Col>

                {/* 側邊欄 - 場景資訊 */}
                <Col lg={4}>
                    <Card className="mb-3 shadow-sm">
                        <Card.Header className="bg-light">
                            <i className="bi bi-info-circle me-2"></i>
                            場景資訊
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3 pb-3 border-bottom">
                                <div className="small text-muted mb-1">場景狀態</div>
                                <Badge bg={
                                    scenario.status === 'Active' ? 'success' : 
                                    scenario.status === 'Upcoming' ? 'warning' : 'secondary'
                                }>
                                    {scenario.status === 'Active' ? '進行中' : 
                                     scenario.status === 'Upcoming' ? '即將開始' : '已結束'}
                                </Badge>
                            </div>
                            <div className="mb-3 pb-3 border-bottom">
                                <div className="small text-muted mb-1">難度</div>
                                <Badge bg={
                                    scenario.difficulty === 'Easy' ? 'success' :
                                    scenario.difficulty === 'Medium' ? 'warning' : 'danger'
                                }>
                                    {scenario.difficulty}
                                </Badge>
                            </div>
                            <div className="mb-3 pb-3 border-bottom">
                                <div className="small text-muted mb-1">當前隊伍數</div>
                                <strong>{scenario.current_teams} / {scenario.max_teams}</strong>
                            </div>
                            <div>
                                <div className="small text-muted mb-1">總旗標數</div>
                                <strong>{scenario.total_flags} 個</strong>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm">
                        <Card.Header className="bg-light">
                            <i className="bi bi-exclamation-circle me-2"></i>
                            注意事項
                        </Card.Header>
                        <Card.Body>
                            <ul className="small mb-0">
                                <li className="mb-2">加入隊伍後，您將能夠訪問該隊伍的虛擬機環境</li>
                                <li className="mb-2">請確保您瞭解選擇的隊伍類型(紅隊/藍隊)的角色</li>
                                <li className="mb-2">一旦加入，在場景進行期間無法更改隊伍</li>
                                <li>請遵守攻防演練規則，違規者將被取消資格</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* 底部操作按鈕 */}
            <Row className="mt-4">
                <Col>
                    <div className="d-flex justify-content-end gap-2">
                        <Button 
                            variant="outline-secondary"
                            onClick={() => navigate(`/attackAndDefence/scenarios/${scenarioId}`)}
                        >
                            取消
                        </Button>
                        <Button 
                            className="btn-custom btn-light-blue"
                            onClick={handleSubmit}
                            disabled={
                                submitting || 
                                (joinOption.mode === "existing" && !joinOption.selectedTeamId) ||
                                (joinOption.mode === "create" && (!joinOption.newTeamName || !joinOption.newTeamType))
                            }
                        >
                            {submitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    處理中...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-circle me-2"></i>
                                    {joinOption.mode === "existing" ? "加入隊伍" : "建立隊伍"}
                                </>
                            )}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
