import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Nav, Tab, ListGroup, Table, Alert } from 'react-bootstrap';
import { 
    getScenarioById, 
    getTeamsByScenario, 
    getFlagsByScenario, 
    getVMsByScenario,
    AD_Scenario, 
    AD_Team, 
    AD_Flag, 
    AD_VM 
} from "../utils/attackDefenceMockData";
import "../style/AttackDefence.css";

export default function ScenarioDetail() {
    const { scenarioId } = useParams<{ scenarioId: string }>();
    const navigate = useNavigate();
    
    const [scenario, setScenario] = useState<AD_Scenario | null>(null);
    const [teams, setTeams] = useState<AD_Team[]>([]);
    const [flags, setFlags] = useState<AD_Flag[]>([]);
    const [vms, setVMs] = useState<AD_VM[]>([]);
    const [activeTab, setActiveTab] = useState<string>('objectives');

    useEffect(() => {
        if (scenarioId) {
            const id = parseInt(scenarioId);
            const scenarioData = getScenarioById(id);
            
            if (!scenarioData) {
                // 場景不存在，返回列表頁
                navigate('/attackAndDefence');
                return;
            }
            
            setScenario(scenarioData);
            setTeams(getTeamsByScenario(id));
            setFlags(getFlagsByScenario(id));
            setVMs(getVMsByScenario(id));
        }
    }, [scenarioId, navigate]);

    if (!scenario) {
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

    // 狀態徽章
    const getStatusBadge = (status: string) => {
        const statusMap = {
            'Active': { bg: 'success', text: '進行中', icon: 'circle-fill' },
            'Upcoming': { bg: 'warning', text: '即將開始', icon: 'clock' },
            'Ended': { bg: 'secondary', text: '已結束', icon: 'check-circle' }
        };
        const config = statusMap[status as keyof typeof statusMap] || statusMap['Upcoming'];
        return (
            <Badge bg={config.bg} className="status-badge">
                <i className={`bi bi-${config.icon} me-1`}></i>
                {config.text}
            </Badge>
        );
    };

    // 難度顏色
    const getDifficultyColor = (difficulty: string) => {
        const colorMap = {
            'Easy': 'success',
            'Medium': 'warning',
            'Hard': 'danger'
        };
        return colorMap[difficulty as keyof typeof colorMap] || 'secondary';
    };

    // 格式化時間
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Container fluid className="ad-container py-4">
            {/* 返回按鈕 */}
            <Button 
                variant="link" 
                className="mb-3 text-decoration-none"
                onClick={() => navigate('/attackAndDefence')}
            >
                <i className="bi bi-arrow-left me-2"></i>
                返回場景列表
            </Button>

            <Row>
                {/* 主要內容區 */}
                <Col lg={8}>
                    {/* 場景頭部 */}
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h2 className="mb-2">{scenario.scenario_name}</h2>
                                    <div className="d-flex gap-2 align-items-center">
                                        {getStatusBadge(scenario.status)}
                                        <Badge bg={getDifficultyColor(scenario.difficulty)}>
                                            {scenario.difficulty}
                                        </Badge>
                                        <Badge bg="info">
                                            <i className="bi bi-flag me-1"></i>
                                            {scenario.total_flags} 個旗標
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <p className="text-muted mb-3">{scenario.description}</p>

                            <Row className="g-3">
                                <Col md={6}>
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-calendar-event text-primary me-2"></i>
                                        <div>
                                            <div className="small text-muted">開始時間</div>
                                            <strong>{formatDate(scenario.start_time)}</strong>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-calendar-check text-primary me-2"></i>
                                        <div>
                                            <div className="small text-muted">結束時間</div>
                                            <strong>{formatDate(scenario.end_time)}</strong>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-people text-primary me-2"></i>
                                        <div>
                                            <div className="small text-muted">最大隊伍數</div>
                                            <strong>{scenario.max_teams} 隊</strong>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-clock text-primary me-2"></i>
                                        <div>
                                            <div className="small text-muted">活動時長</div>
                                            <strong>{scenario.duration_in_minutes} 分鐘</strong>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* 分頁內容 */}
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Tab.Container activeKey={activeTab} onSelect={(k) => k && setActiveTab(k)}>
                                <Nav variant="tabs" className="mb-3">
                                    <Nav.Item>
                                        <Nav.Link eventKey="objectives">
                                            <i className="bi bi-bullseye me-2"></i>
                                            場景目標
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="rules">
                                            <i className="bi bi-book me-2"></i>
                                            規則說明
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="flags">
                                            <i className="bi bi-flag me-2"></i>
                                            旗標資訊
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="environment">
                                            <i className="bi bi-laptop me-2"></i>
                                            環境配置
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>

                                <Tab.Content>
                                    {/* 場景目標 */}
                                    <Tab.Pane eventKey="objectives">
                                        <div className="objectives-content">
                                            <h5 className="mb-3">
                                                <i className="bi bi-bullseye text-primary me-2"></i>
                                                場景資訊
                                            </h5>
                                            <Alert variant="info">
                                                <div className="mb-2">
                                                    <strong>場景類型:</strong> {scenario.scenario_type}
                                                </div>
                                                <div className="mb-2">
                                                    <strong>活動時長:</strong> {scenario.duration_in_minutes} 分鐘
                                                </div>
                                                <div>
                                                    <strong>建立時間:</strong> {formatDate(scenario.created_at)}
                                                </div>
                                            </Alert>
                                        </div>
                                    </Tab.Pane>

                                    {/* 規則說明 */}
                                    <Tab.Pane eventKey="rules">
                                        <div className="rules-content">
                                            <h5 className="mb-3">
                                                <i className="bi bi-book text-primary me-2"></i>
                                                規則說明
                                            </h5>
                                            <Alert variant="info">
                                                <i className="bi bi-info-circle me-2"></i>
                                                本場景遵循標準攻防演練規則
                                            </Alert>
                                            <div className="mt-3">
                                                <h6>基本規則:</h6>
                                                <ol>
                                                    <li className="mb-2">禁止攻擊系統基礎設施</li>
                                                    <li className="mb-2">禁止對其他隊伍進行 DoS 攻擊</li>
                                                    <li className="mb-2">必須在場景時間內完成任務</li>
                                                    <li className="mb-2">攻破旗標需提交有效的 Flag</li>
                                                </ol>
                                            </div>
                                        </div>
                                    </Tab.Pane>

                                    {/* 旗標資訊 */}
                                    <Tab.Pane eventKey="flags">
                                        <h5 className="mb-3">
                                            <i className="bi bi-flag text-primary me-2"></i>
                                            旗標列表 ({flags.length})
                                        </h5>
                                        {flags.length > 0 ? (
                                            <Table responsive hover>
                                                <thead>
                                                    <tr>
                                                        <th>旗標名稱</th>
                                                        <th>類型</th>
                                                        <th>分數</th>
                                                        <th>難度</th>
                                                        <th>狀態</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {flags.map((flag) => (
                                                        <tr key={flag.flag_id}>
                                                            <td>
                                                                <strong>{flag.flag_name}</strong>
                                                                <div className="small text-muted">
                                                                    {flag.description}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <Badge bg={flag.category === 'web' ? 'info' : 'warning'}>
                                                                    {flag.category}
                                                                </Badge>
                                                            </td>
                                                            <td>
                                                                <span className="text-primary fw-bold">
                                                                    {flag.points} 分
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <Badge bg={getDifficultyColor(flag.difficulty)}>
                                                                    {flag.difficulty}
                                                                </Badge>
                                                            </td>
                                                            <td>
                                                                {flag.is_captured ? (
                                                                    <div>
                                                                        <Badge bg="success">
                                                                            <i className="bi bi-check-circle me-1"></i>
                                                                            已被攻破
                                                                        </Badge>
                                                                        {flag.captured_by && (
                                                                            <div className="small text-muted mt-1">
                                                                                by {flag.captured_by.team_name}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <Badge bg="secondary">
                                                                        <i className="bi bi-circle me-1"></i>
                                                                        未攻破
                                                                    </Badge>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        ) : (
                                            <Alert variant="warning">
                                                <i className="bi bi-exclamation-triangle me-2"></i>
                                                本場景尚未配置旗標
                                            </Alert>
                                        )}
                                    </Tab.Pane>

                                    {/* 環境配置 */}
                                    <Tab.Pane eventKey="environment">
                                        <h5 className="mb-3">
                                            <i className="bi bi-laptop text-primary me-2"></i>
                                            虛擬機環境 ({vms.length})
                                        </h5>
                                        {vms.length > 0 ? (
                                            <Row className="g-3">
                                                {vms.map((vm) => (
                                                    <Col md={6} key={vm.vm_id}>
                                                        <Card className="h-100">
                                                            <Card.Body>
                                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                                    <h6 className="mb-0">{vm.vm_name}</h6>
                                                                    <Badge bg={vm.vm_type === 'Target' ? 'danger' : vm.vm_type === 'Attacker' ? 'warning' : 'primary'}>
                                                                        {vm.vm_type}
                                                                    </Badge>
                                                                </div>
                                                                <div className="small">
                                                                    <div className="mb-2">
                                                                        <i className="bi bi-hdd text-muted me-2"></i>
                                                                        <strong>作業系統:</strong> {vm.os}
                                                                    </div>
                                                                    <div className="mb-2">
                                                                        <i className="bi bi-router text-muted me-2"></i>
                                                                        <strong>IP 位址:</strong> {vm.ip_address}
                                                                    </div>
                                                                    <div className="mb-2">
                                                                        <i className="bi bi-cpu text-muted me-2"></i>
                                                                        <strong>CPU:</strong> {vm.cpu} 核心
                                                                    </div>
                                                                    <div className="mb-2">
                                                                        <i className="bi bi-memory text-muted me-2"></i>
                                                                        <strong>記憶體:</strong> {vm.memory} GB
                                                                    </div>
                                                                    <div className="mb-2">
                                                                        <i className="bi bi-hdd-stack text-muted me-2"></i>
                                                                        <strong>儲存空間:</strong> {vm.disk} GB
                                                                    </div>
                                                                    <div className="mb-2">
                                                                        <i className="bi bi-circle-fill text-muted me-2"></i>
                                                                        <strong>狀態:</strong> 
                                                                        <Badge bg={vm.status === 'Running' ? 'success' : 'secondary'} className="ms-2">
                                                                            {vm.status}
                                                                        </Badge>
                                                                    </div>
                                                                    {vm.services && vm.services.length > 0 && (
                                                                        <div className="mt-3">
                                                                            <strong className="d-block mb-2">服務:</strong>
                                                                            <div className="d-flex flex-wrap gap-1">
                                                                                {vm.services.map((service, idx) => (
                                                                                    <Badge key={idx} bg="light" text="dark" className="border">
                                                                                        {service}
                                                                                    </Badge>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        ) : (
                                            <Alert variant="warning">
                                                <i className="bi bi-exclamation-triangle me-2"></i>
                                                本場景尚未配置虛擬機環境
                                            </Alert>
                                        )}
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </Card.Body>
                    </Card>
                </Col>

                {/* 側邊欄 */}
                <Col lg={4}>
                    {/* 場景統計 */}
                    <Card className="mb-3 shadow-sm">
                        <Card.Header className="bg-light">
                            <i className="bi bi-bar-chart-fill me-2"></i>
                            場景統計
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                                <span className="text-muted">當前隊伍數</span>
                                <strong className="text-primary fs-5">{scenario.current_teams} / {scenario.max_teams}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                                <span className="text-muted">已攻破旗標</span>
                                <strong className="text-success fs-5">{scenario.captured_flags} / {scenario.total_flags}</strong>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">參與人數</span>
                                <strong className="fs-5">
                                    {teams.reduce((sum, team) => sum + team.members.length, 0)} 人
                                </strong>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* 參與隊伍 */}
                    <Card className="mb-3 shadow-sm">
                        <Card.Header className="bg-light">
                            <i className="bi bi-people-fill me-2"></i>
                            參與隊伍
                        </Card.Header>
                        <Card.Body>
                            {teams.length > 0 ? (
                                <ListGroup variant="flush">
                                    {teams.map(team => (
                                        <ListGroup.Item key={team.team_id} className="px-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <Badge 
                                                        bg={team.team_type === 'Red Team' ? 'danger' : 'primary'} 
                                                        className="me-2"
                                                    >
                                                        {team.team_type === 'Red Team' ? '紅隊' : '藍隊'}
                                                    </Badge>
                                                    <strong>{team.team_name}</strong>
                                                    <div className="text-muted small">
                                                        {team.members.length} 名成員
                                                    </div>
                                                </div>
                                                {scenario.status === 'Active' && (
                                                    <div className="text-end">
                                                        <div className="text-muted small">分數</div>
                                                        <strong className="text-primary">
                                                            {team.score}
                                                        </strong>
                                                    </div>
                                                )}
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p className="text-muted text-center mb-0">
                                    <i className="bi bi-inbox"></i>
                                    <br />
                                    尚無隊伍加入
                                </p>
                            )}
                        </Card.Body>
                    </Card>

                    {/* 操作按鈕 */}
                    <Card className="shadow-sm">
                        <Card.Body>
                            {scenario.status === 'Active' && (
                                <>
                                    <Button 
                                        className="btn-custom btn-light-blue w-100 mb-2"
                                        size="lg"
                                        onClick={() => navigate(`/attackAndDefence/scenarios/${scenario.scenario_id}/join`)}
                                    >
                                        <i className="bi bi-box-arrow-in-right me-2"></i>
                                        加入場景
                                    </Button>
                                    <Button 
                                        variant="outline-secondary" 
                                        className="w-100"
                                        onClick={() => navigate(`/attackAndDefence/scenarios/${scenario.scenario_id}/scoreboard`)}
                                    >
                                        <i className="bi bi-bar-chart me-2"></i>
                                        查看計分板
                                    </Button>
                                </>
                            )}

                            {scenario.status === 'Upcoming' && (
                                <Button 
                                    variant="outline-secondary" 
                                    className="w-100"
                                    disabled
                                >
                                    <i className="bi bi-clock me-2"></i>
                                    等待場景開始
                                </Button>
                            )}

                            {scenario.status === 'Ended' && (
                                <>
                                    <Button 
                                        variant="outline-secondary" 
                                        className="w-100 mb-2"
                                        onClick={() => navigate(`/attackAndDefence/scenarios/${scenario.scenario_id}/scoreboard`)}
                                    >
                                        <i className="bi bi-bar-chart me-2"></i>
                                        查看最終結果
                                    </Button>
                                    <Button 
                                        variant="outline-secondary" 
                                        className="w-100"
                                        onClick={() => navigate(`/attackAndDefence/scenarios/${scenario.scenario_id}/replay`)}
                                    >
                                        <i className="bi bi-play-circle me-2"></i>
                                        回放記錄
                                    </Button>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
