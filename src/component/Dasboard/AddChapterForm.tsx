import { useState, useMemo } from "react";
import { Button, Col, Container, Row, Form, ListGroup, Tabs, Tab } from "react-bootstrap";
import Markdown from "react-markdown";
import { Class } from "../../interface/Class/Class";
import { Chapter } from "../../interface/Chapter/Chapter";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import '../../style/dashboard/AddChapterForm.css';
import { SortableClassItem } from "./SortableClassItem";
import { SortableChapterItem } from "./SortableChapterItem";

// 1. 重新定義 Props，使其更符合事件驅動的模式
interface AddChapterFormProps {
    initialClasses: Class[];
    initialChapters: Chapter[];
    onOrderChange: (newClasses: Class[], newChapters: Chapter[]) => void;
    onAddClass: () => void;
    onDeleteClass: (classId: string) => void;
    onUpdateClass: (classId: string, updatedFields: Partial<Class>) => void;
    onAddChapter: (classId: string) => void;
    onDeleteChapter: (chapterId: string) => void;
    onUpdateChapter: (chapterId: string, updatedFields: Partial<Chapter>) => void;
    onSave: () => void; // 統一的儲存按鈕
    handleTabChange: (key: "prev" | "next") => void;
}

export default function AddChapterForm({
    initialClasses,
    initialChapters,
    onOrderChange,
    onAddClass,
    onDeleteClass,
    onUpdateClass,
    onAddChapter,
    onDeleteChapter,
    onUpdateChapter,
    onSave,
    handleTabChange,
}: AddChapterFormProps) {
    const [selectedClassId, setSelectedClassId] = useState<string | null>(initialClasses[0]?._id || null);
    const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

    const classesWithChapters = useMemo(() => {
        return initialClasses.map(cls => ({
            ...cls,
            chapters: initialChapters.filter(chap => chap.class_id === cls._id)
        }));
    }, [initialClasses, initialChapters]);

    const selectedClass = useMemo(() =>
        classesWithChapters.find(c => c._id === selectedClassId), [classesWithChapters, selectedClassId]);
    const selectedChapter = useMemo(() =>
        selectedClass?.chapters.find(ch => ch._id === selectedChapterId), [selectedClass, selectedChapterId]);

    // update
    const handleFieldChange = (field: 'class_name' | 'class_subtitle' | 'chapter_name' | 'chapter_subtitle' | 'chapter_content', value: string) => {
        if (selectedChapterId && (field === 'chapter_name' || field === 'chapter_subtitle' || field === 'chapter_content')) {
            onUpdateChapter(selectedChapterId, { [field]: value });
        } else if (selectedClassId && (field === 'class_name' || field === 'class_subtitle')) {
            onUpdateClass(selectedClassId, { [field]: value });
        }
    };

    // 控制拖曳排序的感應器
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // 處理拖曳結束事件
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id.toString();
        const overId = over.id.toString();

        if (activeId === overId) return;

        // 判斷是拖曳 Class or Chapter
        if (activeId.startsWith('class-')) {
            const oldIndex = initialClasses.findIndex(c => `class-${c._id}` === activeId);
            const newIndex = initialClasses.findIndex(c => `class-${c._id}` === overId);
            const newClasses = arrayMove(initialClasses, oldIndex, newIndex);
            onOrderChange(newClasses, initialChapters);
        } else if (activeId.startsWith('chapter-')) {
            const oldIndex = initialChapters.findIndex(c => `chapter-${c._id}` === activeId);
            const newIndex = initialChapters.findIndex(c => `chapter-${c._id}` === overId);
            const newChapters = arrayMove(initialChapters, oldIndex, newIndex);
            onOrderChange(initialClasses, newChapters);
        }
    }

    return (
        <Container fluid>
            <Row>
                {/* 左側導覽欄 */}
                <Col md={4} className="sidebar-nav">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>課程結構</h5>
                        <Button variant="outline-secondary" size="sm" onClick={onAddClass}>+ 新增 Class</Button>
                    </div>
                    <div className="list-group">
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={initialClasses.map(c => `class-${c._id}`)} strategy={verticalListSortingStrategy}>
                                {classesWithChapters.map((classItem, classIndex) => (
                                    <div>
                                        <SortableClassItem
                                            classItem={classItem}
                                            index={classIndex}
                                            isSelected={selectedClassId === classItem._id && !selectedChapterId}
                                            onSelect={() => { if (classItem._id) { setSelectedClassId(classItem._id); setSelectedChapterId(null); } }}
                                            onDelete={(e) => { e.stopPropagation(); if (classItem._id) onDeleteClass(classItem._id); }}
                                        />

                                        <SortableContext items={classItem.chapters.map(c => `chapter-${c._id}`)} strategy={verticalListSortingStrategy}>
                                            {classItem.chapters.map((chapter, chapterIndex) => (
                                                <SortableChapterItem
                                                    key={`chapter-${chapter._id}`}
                                                    chapter={chapter}
                                                    index={chapterIndex}
                                                    isSelected={selectedChapterId === chapter._id}
                                                    onSelect={() => { if (classItem._id && chapter._id) { setSelectedClassId(classItem._id); setSelectedChapterId(chapter._id); } }}
                                                    onDelete={(e) => { e.stopPropagation(); if (chapter._id) onDeleteChapter(chapter._id); }}
                                                />
                                            ))}
                                        </SortableContext>

                                        {selectedClassId === classItem._id && (
                                            <ListGroup.Item action onClick={() => onAddChapter(classItem._id)} className="add-chapter-btn">
                                                + 新增 Chapter
                                            </ListGroup.Item>
                                        )}
                                    </div>
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>
                </Col>

                {/* 右側編輯區 */}
                <Col md={8} className="edit-pane d-flex flex-column">
                    <div className="flex-grow-1 overflow-auto pr-3">
                        {selectedChapter ? (
                            // Chapter 編輯表單
                            <div>
                                <h4>編輯區</h4>
                                <hr />
                                <Form.Group className="mb-3">
                                    <Form.Label>Chapter 標題</Form.Label>
                                    <Form.Control type="text" value={selectedChapter.chapter_name || ''} onChange={e => handleFieldChange('chapter_name', e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Chapter 副標題</Form.Label>
                                    <Form.Control type="text" value={selectedChapter.chapter_subtitle || ''} onChange={e => handleFieldChange('chapter_subtitle', e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Chapter 內容 (支援 Markdown)</Form.Label>
                                    <Tabs defaultActiveKey="edit">
                                        <Tab eventKey="edit" title="編輯">
                                            <Form.Control as="textarea" rows={9} value={selectedChapter.chapter_content || ''} onChange={e => handleFieldChange('chapter_content', e.target.value)} />
                                        </Tab>
                                        <Tab eventKey="preview" title="預覽">
                                            <div className="form-control preview-area">
                                                <Markdown>{selectedChapter.chapter_content || "預覽畫面"}</Markdown>
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </Form.Group>
                            </div>
                        ) : selectedClass ? (
                            // Class 編輯表單
                            <div>
                                <h4>編輯區</h4>
                                <hr />
                                <Form.Group className="mb-3">
                                    <Form.Label>Class 標題</Form.Label>
                                    <Form.Control type="text" value={selectedClass.class_name || ''} onChange={e => handleFieldChange('class_name', e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Class 副標題</Form.Label>
                                    <Form.Control type="text" value={selectedClass.class_subtitle || ''} onChange={e => handleFieldChange('class_subtitle', e.target.value)} />
                                </Form.Group>
                            </div>
                        ) : (
                            <div className="text-center p-5"><p className="text-muted">請從左側選擇一個項目進行編輯，或新增一個 Class。</p></div>
                        )}
                    </div>
                    {/* 統一的按鈕區域 */}
                    <Form.Group className="pt-3 border-top d-flex gap-3">
                        <Button variant="success" onClick={onSave}>儲存所有資訊</Button>
                        <Button variant="secondary" onClick={() => handleTabChange("prev")}>上一步</Button>
                    </Form.Group>
                </Col>
            </Row >
        </Container >
    );
}