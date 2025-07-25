import { useState, useMemo } from "react";
import { Button, Col, Container, Row, Form, ListGroup, Tabs, Tab } from "react-bootstrap";
import '../../style/dashboard/AddChapterForm.css'; // 引入新的樣式檔
import Markdown from "react-markdown";


// 資料結構保持不變
interface Chapter {
    id: number;
    content: string;
    subtitle: string;
    title: string;
}

interface Class {
    id: number;
    title: string;
    subtitle: string;
    chapters: Chapter[];
}

interface AddChapterFormProps {
    handleTabChange: (key: "prev" | "next") => void;
}

export default function AddChapterForm({ handleTabChange }: AddChapterFormProps) {
    const [classes, setClasses] = useState<Class[]>([
        {
            id: Date.now(),
            title: "",
            subtitle: "",
            chapters: [{ id: Date.now() + 1, title: "", content: "", subtitle: "" }],
        },
    ]);

    // 1. 新增 state 來追蹤當前選擇的項目
    const [selectedClassId, setSelectedClassId] = useState<number | null>(classes[0]?.id || null);
    const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);

    // --- 資料操作函式 (邏輯微調以適應新 UI) ---

    const handleAddClass = () => {
        const newId = Date.now();
        const newClass: Class = {
            id: newId,
            title: "", // 1. 修改：新增時標題為空，讓使用者自行填寫
            subtitle: "",
            chapters: [],
        };
        setClasses([...classes, newClass]);
        // 新增後自動選取新的 Class
        setSelectedClassId(newId);
        setSelectedChapterId(null);
    };

    const handleRemoveClass = (classId: number) => {
        setClasses(classes.filter((c) => c.id !== classId));
        // 如果刪除的是當前選取的 Class，則清空選擇
        if (selectedClassId === classId) {
            setSelectedClassId(null);
            setSelectedChapterId(null);
        }
    };

    const handleAddChapter = (classId: number) => {
        const newId = Date.now();
        setClasses(classes.map(c => {
            if (c.id === classId) {
                const newChapter: Chapter = {
                    id: newId,
                    title: "", // 2. 修改：新增時標題為空
                    content: "",
                    subtitle: "",
                };
                return { ...c, chapters: [...c.chapters, newChapter] };
            }
            return c;
        }));
        // 新增後自動選取新的 Chapter
        setSelectedChapterId(newId);
    };

    const handleRemoveChapter = (classId: number, chapterId: number) => {
        setClasses(classes.map(c => {
            if (c.id === classId) {
                return { ...c, chapters: c.chapters.filter(ch => ch.id !== chapterId) };
            }
            return c;
        }));
        // 如果刪除的是當前選取的 Chapter，則清空 Chapter 選擇
        if (selectedChapterId === chapterId) {
            setSelectedChapterId(null);
        }
    };

    // 2. 建立一個統一的 change handler
    const handleFieldChange = (field: 'classTitle' | 'classSubtitle' | 'chapterTitle' | 'chapterSubtitle' | 'chapterContent', value: string) => {
        setClasses(classes.map(c => {
            if (c.id === selectedClassId) {
                switch (field) {
                    case 'classTitle':
                        return { ...c, title: `${value}` };
                    case 'classSubtitle':
                        return { ...c, subtitle: value };
                    case 'chapterTitle':
                    case 'chapterSubtitle':
                    case 'chapterContent':
                        const updatedChapters = c.chapters.map(ch => {
                            if (ch.id === selectedChapterId) {
                                if (field === 'chapterTitle') return { ...ch, title: value };
                                if (field === 'chapterSubtitle') return { ...ch, subtitle: value };
                                if (field === 'chapterContent') return { ...ch, content: value };
                            }
                            return ch;
                        });
                        return { ...c, chapters: updatedChapters };
                    default:
                        return c;
                }
            }
            return c;
        }));
    };

    const handleSave = () => {
        console.log("儲存的資料:", JSON.stringify(classes, null, 2));
    };

    // 3. 使用 useMemo 來派生出當前選擇的項目，避免重複計算
    const selectedClass = useMemo(() => classes.find(c => c.id === selectedClassId), [classes, selectedClassId]);
    const selectedChapter = useMemo(() => selectedClass?.chapters.find(ch => ch.id === selectedChapterId), [selectedClass, selectedChapterId]);

    return (
        <Container fluid>
            <Row>
                {/* 4. 左側導覽欄 */}
                <Col md={4} className="sidebar-nav">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>課程結構</h5>
                        <Button variant="outline-secondary" size="sm" onClick={handleAddClass}>+ 新增 Class</Button>
                    </div>
                    <ListGroup>
                        {classes.map((classItem, classIndex) => (
                            <div key={classItem.id}>
                                <ListGroup.Item
                                    action
                                    active={selectedClassId === classItem.id && !selectedChapterId}
                                    onClick={() => { setSelectedClassId(classItem.id); setSelectedChapterId(null); }}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    {`Class ${classIndex + 1}. ${classItem.title || "未命名"}`}
                                    <Button variant="link" className="p-0 text-danger" onClick={(e) => { e.stopPropagation(); handleRemoveClass(classItem.id); }}>
                                        <i className="bi bi-x-circle"></i>
                                    </Button>
                                </ListGroup.Item>
                                {classItem.chapters.map((chapter, chapterIndex) => (
                                    <ListGroup.Item
                                        key={chapter.id}
                                        action
                                        active={selectedChapterId === chapter.id}
                                        onClick={() => { setSelectedClassId(classItem.id); setSelectedChapterId(chapter.id); }}
                                        className="d-flex justify-content-between align-items-center chapter-item"
                                    >
                                        {/* 6. 加上編號前綴 */}
                                        {`Chapter ${chapterIndex + 1}. ${chapter.title || "未命名"}`}
                                        <Button variant="link" className="p-0 text-danger" onClick={(e) => { e.stopPropagation(); handleRemoveChapter(classItem.id, chapter.id); }}>
                                            <i className="bi bi-x-circle"></i>
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                                {selectedClassId === classItem.id && (
                                    <ListGroup.Item action onClick={() => handleAddChapter(classItem.id)} className="add-chapter-btn">
                                        + 新增 Chapter
                                    </ListGroup.Item>
                                )}
                            </div>
                        ))}
                    </ListGroup>
                </Col>

                {/* 5. 右側編輯區 */}
                <Col md={8} className="edit-pane">
                    {selectedChapter ? (
                        // 顯示 Chapter 編輯表單
                        <div>
                            <h4>編輯區</h4>
                            <hr />
                            <Form.Group className="mb-3">
                                <Form.Label>Chapter 標題</Form.Label>
                                <Form.Control type="text" value={selectedChapter.title} onChange={e => handleFieldChange('chapterTitle', e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Chapter 副標題</Form.Label>
                                <Form.Control type="text" value={selectedChapter.subtitle} onChange={e => handleFieldChange('chapterSubtitle', e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Chapter 內容</Form.Label>
                                <Tabs
                                    defaultActiveKey="edit"
                                >
                                    <Tab eventKey="edit" title="編輯">
                                        <Form.Control
                                            as="textarea"
                                            rows={10}
                                            placeholder="請輸入 Chapter 內容 支援 Markdown 形式編輯"
                                            value={selectedChapter.content}
                                            onChange={e => handleFieldChange('chapterContent', e.target.value)}
                                        />
                                    </Tab>
                                    <Tab eventKey="preview" title="預覽">
                                        <div className="form-control preview-area">
                                            <Markdown>{selectedChapter.content ? selectedChapter.content : "預覽畫面"}</Markdown>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </Form.Group>
                            <Form.Group className="mb-3 d-flex gap-3">
                                <Button variant="success" onClick={handleSave}>儲存</Button>
                                <Button variant="secondary" onClick={() => handleTabChange("prev")}>上頁</Button>
                            </Form.Group>
                        </div>
                    ) : selectedClass ? (
                        // 顯示 Class 編輯表單
                        <div>
                            <h4>編輯區</h4>
                            <hr />
                            <Form.Group className="mb-3">
                                <Form.Label>Class 標題</Form.Label>
                                <Form.Control type="text" value={selectedClass.title} onChange={e => handleFieldChange('classTitle', e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Class 副標題</Form.Label>
                                <Form.Control type="text" value={selectedClass.subtitle} onChange={e => handleFieldChange('classSubtitle', e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3 d-flex gap-3">
                                <Button variant="success" onClick={handleSave}>儲存</Button>
                                <Button variant="secondary" onClick={() => handleTabChange("prev")}>上頁</Button>
                            </Form.Group>
                        </div>
                    ) : (
                        // 預設提示訊息
                        <div className="text-center p-5">
                            <p className="text-muted">請從左側選擇一個項目進行編輯，或新增一個 Class。</p>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}