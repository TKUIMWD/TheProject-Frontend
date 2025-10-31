import { useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Form, Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { mockScenarios, getStatistics, AD_Scenario } from "../utils/attackDefenceMockData";
import "../style/AttackDefence.css";

export default function AttackAndDefence() {
    const navigate = useNavigate();
    const [scenarios] = useState<AD_Scenario[]>(mockScenarios);
    const [difficulty, setDifficulty] = useState<string>("All");
    const [activeTab, setActiveTab] = useState<string>("All");
    const statistics = getStatistics();

    // 根據篩選條件過濾場景
    const filteredScenarios = scenarios.filter(scenario => {
        const matchesTab = activeTab === "All" || scenario.status === activeTab;
        const matchesDifficulty = difficulty === "All" || scenario.difficulty === difficulty;
        return matchesTab && matchesDifficulty;
    });

    // 取得狀態顏色
    const getStatusColor = (status: string): string => {
        switch (status) {
            case "Active": return "success";
            case "Upcoming": return "info";
            case "Ended": return "secondary";
            default: return "secondary";
        }
    };

    // 取得狀態文字
    const getStatusText = (status: string): string => {
        switch (status) {
            case "Active": return "進行中";
            case "Upcoming": return "即將開始";
            case "Ended": return "已結束";
            default: return status;
        }
    };

    // 取得難度顏色
    const getDifficultyColor = (difficulty: string): string => {
        switch (difficulty) {
            case "Easy": return "success";
            case "Medium": return "warning";
            case "Hard": return "danger";
            default: return "secondary";
        }
    };

    // 格式化時間
    const formatDateTime = (dateString?: string): string => {
        if (!dateString) return "未設定";
        const date = new Date(dateString);
        return date.toLocaleString('zh-TW', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // 計算時長
    const formatDuration = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
        if (hours > 0) return `${hours}h`;
        return `${mins}m`;
    };

    return (
        <div className="attack-defence-page">
            <Container>
                {/* 頁面標題 */}
                <Row className="mb-4">
                    <Col>
                        <h1 className="page-title">紅藍攻防</h1>
                        <p className="page-subtitle text-muted">模擬真實攻防場景，提升實戰能力</p>
                    </Col>
                </Row>

                {/* 快速統計卡片 */}
                <Row className="mb-4">
                    <Col md={3}>
                        <Card className="stat-card stat-card-active">
                            <Card.Body>
                                <div className="stat-icon">
                                    <i className="bi bi-lightning-charge-fill"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>{statistics.active_scenarios}</h3>
                                    <p>進行中場景</p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="stat-card stat-card-teams">
                            <Card.Body>
                                <div className="stat-icon">
                                    <i className="bi bi-people-fill"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>{statistics.total_teams}</h3>
                                    <p>我的隊伍</p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="stat-card stat-card-flags">
                            <Card.Body>
                                <div className="stat-icon">
                                    <i className="bi bi-flag-fill"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>{statistics.captured_flags}</h3>
                                    <p>累計獲得 Flag</p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="stat-card stat-card-score">
                            <Card.Body>
                                <div className="stat-icon">
                                    <i className="bi bi-trophy-fill"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>{statistics.total_score}</h3>
                                    <p>總積分</p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* 篩選與操作列 */}
                <Row className="mb-3 align-items-center">
                    <Col md={8}>
                        <Tabs
                            activeKey={activeTab}
                            onSelect={(k) => setActiveTab(k || "All")}
                            className="scenario-tabs"
                        >
                            <Tab eventKey="All" title="全部" />
                            <Tab eventKey="Active" title={
                                <span>
                                    <i className="bi bi-lightning-fill me-1"></i>
                                    進行中
                                </span>
                            } />
                            <Tab eventKey="Upcoming" title={
                                <span>
                                    <i className="bi bi-clock-fill me-1"></i>
                                    即將開始
                                </span>
                            } />
                            <Tab eventKey="Ended" title={
                                <span>
                                    <i className="bi bi-check-circle-fill me-1"></i>
                                    已結束
                                </span>
                            } />
                        </Tabs>
                    </Col>
                    <Col md={2}>
                        <Form.Select 
                            value={difficulty} 
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="difficulty-filter"
                        >
                            <option value="All">所有難度</option>
                            <option value="Easy">簡單</option>
                            <option value="Medium">中等</option>
                            <option value="Hard">困難</option>
                        </Form.Select>
                    </Col>
                    <Col md={2}>
                        <Button 
                            variant="light-blue" 
                            className="w-100"
                            onClick={() => navigate('/attackAndDefence/create')}
                        >
                            <i className="bi bi-plus-circle me-2"></i>
                            建立場景
                        </Button>
                    </Col>
                </Row>

                {/* 場景卡片列表 */}
                <Row>
                    {filteredScenarios.length > 0 ? (
                        filteredScenarios.map(scenario => (
                            <Col md={6} lg={4} key={scenario.scenario_id} className="mb-4">
                                <Card className="scenario-card">
                                    <Card.Body>
                                        {/* 標題與狀態 */}
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <h5 className="scenario-title">{scenario.scenario_name}</h5>
                                            <Badge bg={getStatusColor(scenario.status)} className="status-badge">
                                                {getStatusText(scenario.status)}
                                            </Badge>
                                        </div>

                                        {/* 描述 */}
                                        <p className="scenario-description text-muted">
                                            {scenario.description}
                                        </p>

                                        {/* 元資料 */}
                                        <div className="scenario-meta mb-3">
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                                <span className="meta-item">
                                                    <i className="bi bi-clock me-1"></i>
                                                    {formatDuration(scenario.duration_in_minutes)}
                                                </span>
                                                <span className="meta-item">
                                                    <Badge bg={getDifficultyColor(scenario.difficulty)} className="difficulty-badge">
                                                        {scenario.difficulty}
                                                    </Badge>
                                                </span>
                                                <span className="meta-item">
                                                    <i className="bi bi-flag me-1"></i>
                                                    {scenario.total_flags} Flags
                                                </span>
                                            </div>

                                            <div className="d-flex align-items-center justify-content-between">
                                                <span className="meta-item">
                                                    <i className="bi bi-people me-1"></i>
                                                    {scenario.current_teams} / {scenario.max_teams} 隊伍
                                                </span>
                                                <span className="meta-item text-muted small">
                                                    <i className="bi bi-tag me-1"></i>
                                                    {scenario.scenario_type}
                                                </span>
                                            </div>
                                        </div>

                                        {/* 時間資訊 */}
                                        {scenario.status === "Active" && (
                                            <div className="time-info active-time mb-3">
                                                <i className="bi bi-hourglass-split me-2"></i>
                                                <small>
                                                    結束時間: {formatDateTime(scenario.end_time)}
                                                </small>
                                            </div>
                                        )}

                                        {scenario.status === "Upcoming" && (
                                            <div className="time-info upcoming-time mb-3">
                                                <i className="bi bi-calendar-event me-2"></i>
                                                <small>
                                                    開始時間: {formatDateTime(scenario.start_time)}
                                                </small>
                                            </div>
                                        )}

                                        {/* 操作按鈕 */}
                                        <div className="d-flex gap-2">
                                            <Button 
                                                variant="outline-light-blue" 
                                                size="sm"
                                                className="flex-grow-1"
                                                onClick={() => navigate(`/attackAndDefence/scenarios/${scenario.scenario_id}`)}
                                            >
                                                查看詳情
                                            </Button>

                                            {scenario.status === "Active" && (
                                                <Button 
                                                    className="btn-custom btn-light-blue flex-grow-1"
                                                    size="sm"
                                                    onClick={() => navigate(`/attackAndDefence/scenarios/${scenario.scenario_id}/join`)}
                                                >
                                                    <i className="bi bi-box-arrow-in-right me-1"></i>
                                                    加入場景
                                                </Button>
                                            )}

                                            {scenario.status === "Upcoming" && (
                                                <Button 
                                                    variant="outline-secondary" 
                                                    size="sm"
                                                    className="flex-grow-1"
                                                    disabled
                                                >
                                                    <i className="bi bi-clock me-1"></i>
                                                    等待開始
                                                </Button>
                                            )}

                                            {scenario.status === "Ended" && (
                                                <Button 
                                                    variant="outline-secondary" 
                                                    size="sm"
                                                    className="flex-grow-1"
                                                    onClick={() => navigate(`/attackAndDefence/scenarios/${scenario.scenario_id}/results`)}
                                                >
                                                    <i className="bi bi-bar-chart me-1"></i>
                                                    查看結果
                                                </Button>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col>
                            <Card className="text-center py-5">
                                <Card.Body>
                                    <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                                    <h5 className="mt-3 text-muted">目前沒有符合條件的場景</h5>
                                    <p className="text-muted">試試調整篩選條件或建立新場景</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    );
}