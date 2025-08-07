import { useEffect, useState } from "react";
import { course_api, class_api, chapter_api } from "../../enum/api";
import { asyncPost } from "../../utils/fetch";
import { useToast } from "../../context/ToastProvider";
import AddCourseForm from "./AddCourseForm";
import AddChapterForm from "./AddChapterForm";
import { Course } from "../../interface/Course/Course";
import { Class } from "../../interface/Class/Class";
import { Chapter } from "../../interface/Chapter/Chapter";

export default function AddCourse() {
    const { showToast } = useToast();

    const [courseId, setCourseId] = useState<string | undefined>(undefined);
    const [courseData, setCourseData] = useState<Course | undefined>(undefined);
    const [isCourseInfoSaved, setIsCourseInfoSaved] = useState<boolean>(false);
    const [classData, setClassData] = useState<Class[]>([]);
    const [chapterData, setChapterData] = useState<Chapter[]>([]);

    const [activeKey, setActiveKey] = useState<"AddCourseForm" | "AddChapterForm">("AddCourseForm");
    const [loading, setLoading] = useState<boolean>(false);

    // 當 courseData 變更時，代表表單內容與上次儲存時不同
    useEffect(() => {
        if (courseData !== undefined) {
            setIsCourseInfoSaved(false);
        }
    }, [courseData]);

    const resetAllData = () => {
        setCourseId(undefined);
        setCourseData(undefined);
        setIsCourseInfoSaved(false);
        setClassData([]);
        setChapterData([]);
        setActiveKey("AddCourseForm");
    };

    const handleOrderChange = (newClasses: Class[], newChapters: Chapter[]) => {
        const reorderedClasses = newClasses.map((c, index) => ({ ...c, class_order: index + 1 }));
        const reorderedChapters = newChapters.map((c, index) => ({ ...c, order: index + 1 }));
        setClassData(reorderedClasses);
        setChapterData(reorderedChapters);
    };

    const handleCourseDataChange = (newCourseData: Course) => {
        setCourseData(newCourseData);
    };

    const handleTabChange = (direction: "prev" | "next") => {
        if (direction === "next") {
            if (!isCourseInfoSaved) {
                showToast("請先儲存課程基本資訊", "warning");
                return;
            }
            setActiveKey("AddChapterForm");
        } else if (direction === "prev") {
            setActiveKey("AddCourseForm")
        }
    };

    const handleAddClass = () => {
        setClassData(prevClasses => {
            const maxOrder = prevClasses.reduce((max, c) => (c.class_order > max ? c.class_order : max), 0);
            return [...prevClasses, {
                _id: `new_class_${Date.now()}`,
                class_name: "",
                class_subtitle: "",
                class_order: maxOrder + 1,
                chapter_ids: [],
                course_id: courseId || '',
            }];
        });
    };

    const handleDeleteClass = (classId: string) => {
        setClassData(prevClasses => {
            const updatedClasses = prevClasses
                .filter(c => c._id !== classId)
                .map((c, index) => ({ ...c, class_order: index + 1 }));
            setChapterData(prevChapters => prevChapters.filter(ch => ch.class_id !== classId));
            return updatedClasses;
        });
    };

    const handleUpdateClass = (classId: string, updatedFields: Partial<Class>) => {
        setClassData(prev => prev.map(c => c._id === classId ? { ...c, ...updatedFields } : c));
    };

    const handleAddChapter = (classId: string) => {
        setChapterData(prevChapters => {
            const chaptersInThisClass = prevChapters.filter(chap => chap.class_id === classId);
            const maxOrder = chaptersInThisClass.reduce((max, chap) => (chap.chapter_order > max ? chap.chapter_order : max), 0);
            const newChapter: Chapter = {
                _id: `new_chapter_${Date.now()}`,
                chapter_name: "",
                chapter_subtitle: "",
                chapter_content: "",
                chapter_order: maxOrder + 1,
                class_id: classId,
                course_id: courseId || '',
            };
            return [...prevChapters, newChapter];
        });
    };

    const handleDeleteChapter = (chapterId: string) => {
        setChapterData(prevChapters => {
            const chapterToDelete = prevChapters.find(ch => ch._id === chapterId);
            if (!chapterToDelete) return prevChapters;
            const targetClassId = chapterToDelete.class_id;
            const remainingChapters = prevChapters.filter(ch => ch._id !== chapterId);
            const chaptersToReorder = remainingChapters
                .filter(ch => ch.class_id === targetClassId)
                .sort((a, b) => a.chapter_order - b.chapter_order)
                .map((chapter, index) => ({ ...chapter, order: index + 1 }));
            const otherChapters = remainingChapters.filter(ch => ch.class_id !== targetClassId);
            return [...otherChapters, ...chaptersToReorder];
        });
    };

    const handleUpdateChapter = (chapterId: string, updatedFields: Partial<Chapter>) => {
        setChapterData(prev => prev.map(ch => ch._id === chapterId ? { ...ch, ...updatedFields } : ch));
    };

    // Save Course 只做前端暫存
    const handleTemporarySaveCourse = () => {
        if (!courseData || !courseData.course_name || !courseData.course_subtitle || !courseData.course_description) {
            showToast("請填寫所有必填欄位", "danger");
            return;
        }
        if (courseData.duration_in_minutes === 0) {
            showToast("請選擇課程進行時間", "danger");
            return;
        }
        setIsCourseInfoSaved(true);
        showToast("課程資訊已暫存！現在可以前往下一步新增章節。", "success");
    };

    // Save All 唯一的後端儲存函式
    const handleSaveAll = async () => {
        if (!isCourseInfoSaved || !courseData) {
            showToast("課程基本資訊尚未填寫或暫存", "danger");
            return;
        }
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            showToast("請先登入", "danger");
            setLoading(false);
            return;
        }
        const headers = { "Authorization": `Bearer ${token}` };

        try {
            const createdCourseResponse = await asyncPost(course_api.addCourse, courseData, { headers });
            if (createdCourseResponse.code !== 200) {
                throw new Error(`儲存課程失敗：${createdCourseResponse.message}`);
            }

            const finalCourse = createdCourseResponse.body;
            if (!finalCourse || !finalCourse.course_id) {
                throw new Error("儲存課程失敗：後端未回傳課程 ID");
            }

            const finalCourseId = finalCourse.course_id;
            setCourseId(finalCourseId);

            const tempIdToRealIdMap = new Map<string, string>();
            const finalClasses: Class[] = [];

            for (const classItem of classData) {
                const { _id: tempId, ...payload } = classItem;
                const response = await asyncPost(class_api.addClassToCourse(finalCourseId), { ...payload, course_id: finalCourseId }, { headers });
                const responseBody = response.body;
                if (response.code !== 200) {
                    throw new Error(`儲存 Class "${payload.class_name}" 失敗：${response.message}`);
                }

                if (responseBody && responseBody.class_id) {
                    const realId = responseBody.class_id;
                    tempIdToRealIdMap.set(tempId, realId); // 建立 臨時ID -> 真實ID 的映射
                    finalClasses.push({ ...classItem, _id: realId }); // 建立一個包含真實 ID 的新陣列
                } else {
                    throw new Error(`建立 Class "${payload.class_name}" 失敗`);
                }
            }

            setClassData(finalClasses);
            for (const chapterItem of chapterData) {
                const realClassId = tempIdToRealIdMap.get(chapterItem.class_id);

                if (!realClassId) {
                    throw new Error(`資料不一致：找不到 Chapter "${chapterItem.chapter_name}" 對應的 Class ID！`);
                }

                const { _id, class_id, course_id, ...payload } = chapterItem;

                const res = await asyncPost(
                    chapter_api.addChapterToClass(realClassId),
                    {
                        ...payload,
                        class_id: realClassId, // 附上真實的 class_id
                        course_id: finalCourseId // 附上真實的 course_id
                    },
                    { headers }
                );
                if (res.code !== 200) {
                    throw new Error(`儲存 Chapter "${payload.chapter_name}" 失敗：${res.message}`);
                }
            }
            console.log("後端 addChapterToClass API 回應:", JSON.stringify(chapterData, null, 2));
            console.log("Chapter 儲存完成。");

            showToast("課程已完整發布！", "success");
            resetAllData();
        } catch (error: any) {
            showToast(error.message || "儲存過程中發生錯誤", "danger");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <h4>載入中...</h4>}
            <h3>新增課程</h3>
            <hr />
            {activeKey === 'AddCourseForm' && (
                <AddCourseForm
                    courseData={courseData}
                    onCourseChange={handleCourseDataChange}
                    onTemporarySave={handleTemporarySaveCourse}
                    handleTabChange={handleTabChange}
                />
            )}
            {activeKey === 'AddChapterForm' && (
                <AddChapterForm
                    initialClasses={classData}
                    initialChapters={chapterData}
                    onOrderChange={handleOrderChange}
                    onAddClass={handleAddClass}
                    onDeleteClass={handleDeleteClass}
                    onUpdateClass={handleUpdateClass}
                    onAddChapter={handleAddChapter}
                    onDeleteChapter={handleDeleteChapter}
                    onUpdateChapter={handleUpdateChapter}
                    onSave={handleSaveAll}
                    handleTabChange={handleTabChange}
                />
            )}
        </>
    );
}