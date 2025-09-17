import { useEffect, useState } from "react";
import SubmittedCourseList from "../List/SubmittedCourseList";
import { CourseInfo } from "../../../interface/Course/Course";
import { useToast } from "../../../context/ToastProvider";
import { getOptions } from "../../../utils/token";
import { asyncGet, asyncPost } from "../../../utils/fetch";
import { course_api } from "../../../enum/api";

export default function AuditCourse() {
    const [courses, setCourses] = useState<CourseInfo[]>([]);
    const { showToast } = useToast();
    useEffect(() => {
        try {
            const options = getOptions();
            asyncGet(course_api.getAllSubmittedCourses, options)
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

    function handleAudit(course_id: string, approved: boolean) {
        try {
            const options = getOptions();
            const apiEndpoint = approved ? course_api.approvedCourseById(course_id) : course_api.unApprovedCourseById(course_id);
            const body = {};
            asyncPost(apiEndpoint, body, options)
                .then((res) => {
                    if (res.code === 200) {
                        showToast(`課程審核成功`, "success");
                        setCourses(courses.filter(course => course._id !== course_id));
                    } else {
                        throw new Error(res.message || "課程審核失敗");
                    }
                })
                .catch((error) => {
                    showToast(`課程審核失敗：${error.message}`, "danger");
                    console.error("課程審核時發生錯誤：", error);
                });
        } catch (error: any) {
            showToast(`審核課程失敗：${error.message}`, "danger");
            console.error("審核課程時發生錯誤：", error);
        }
    }

    if (courses.length === 0) {
        return (
            <div>
                <h3>課程審核</h3>
                <hr />
                <p>目前沒有待審核的課程。</p>
            </div>
        );
    }

    return (
        <div>
            <h3>課程審核</h3>
            <hr />
            <SubmittedCourseList courses={courses} handleAudit={handleAudit} />
        </div>
    );
}
