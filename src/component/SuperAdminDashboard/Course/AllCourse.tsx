import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastProvider";
import { course_api } from "../../../enum/api";
import { asyncDelete, asyncGet } from "../../../utils/fetch";
import { getOptions } from "../../../utils/token";
import { CourseInfo } from "../../../interface/Course/Course";
import '../../../style/superAdmin/List/CourseList.css';
import CourseList from "../List/CourseList";

export default function AllCourse() {
    const [courses, setCourses] = useState<CourseInfo[]>([]);
    const { showToast } = useToast();
    useEffect(() => {
        try {
            const options = getOptions();
            asyncGet(course_api.getAllCourses, options)
                .then((res) => {
                    if (res.code === 200 && res.body) {
                        setCourses(res.body);
                        console.log("Courses fetched:", res.body);
                    } else {
                        throw new Error(res.message || "無法取得課程資料");
                    }
                })
                .catch((error) => {
                    showToast(`無法獲取課程資料：${error.message}`, "danger");
                    console.error("獲取課程資料時發生錯誤：", error);
                });
        } catch (error: any) {
            showToast(`無法獲取課程資料：${error.message}`, "danger");
            console.error("獲取課程資料時發生錯誤：", error);
        }
    }, []);

    function handleDelete(course_id: string) {
        try {
            const comfirmDelete = window.confirm("確定要刪除這個課程嗎？此操作無法復原。");
            if (!comfirmDelete) return;
            const options = getOptions();
            const body = {};
            asyncDelete(course_api.deleteCourseById(course_id), body, options)
                .then((res) => {
                    if (res.code === 200) {
                        setCourses(courses.filter(course => course._id !== course_id));
                        showToast("課程刪除成功", "success");
                    } else {
                        throw new Error(res.message || "無法刪除課程");
                    }
                })
                .catch((error) => {
                    throw error;
                });
        } catch (error: any) {
            showToast(`刪除課程失敗：${error.message}`, "danger");
            console.error("刪除課程時發生錯誤：", error);
        }
    }
    return (
        <div>
            <h3>課程總覽</h3>
            <hr />
            <CourseList courses={courses} handleDelete={handleDelete} />
        </div>
    );
}