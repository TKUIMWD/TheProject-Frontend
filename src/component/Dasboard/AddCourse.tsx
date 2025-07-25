import { useState } from "react";
import AddCourseForm from "./AddCourseForm";
import AddChapterForm from "./AddChapterForm";

interface TabProps {
    key: "AddCourseForm" | "AddClassForm" | "AddChapterForm";
    component: JSX.Element;
}

export default function AddCourse() {
    const [activeKey, setActiveKey] = useState<TabProps["key"]>("AddCourseForm");
    const handleTabChange = (direction: "prev" | "next") => {
        if (direction === "next") {
            setActiveKey("AddChapterForm");
        } else if (direction === "prev") {
            setActiveKey("AddCourseForm")
        }
    };
    const tabs: TabProps[] = [
        { key: "AddCourseForm", component: <AddCourseForm handleTabChange={handleTabChange} /> },
        { key: "AddChapterForm", component: <AddChapterForm handleTabChange={handleTabChange} /> },
    ];
    return (
        <>
            <h3>新增課程</h3>
            <hr />
            {tabs.find(tab => tab.key === activeKey)?.component}
        </>
    );
}