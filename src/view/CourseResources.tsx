import NavBar from "../component/NavBar"
import Search from "../component/CourseResource/Search";
import Filter from "../component/CourseResource/Filter";
import Cards from "../component/CourseResource/Cards";
import Footer from "../component/Footer";
import { Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { asyncGet } from "../utils/fetch";
import { course_api, user_api } from "../enum/api";
import { useToast } from "../context/ToastProvider";
import { CoursePageDTO } from "../interface/Course/CoursePageDTO";
import "../style/courseResource/CourseResource.css";
import { CourseInfo } from "../interface/Course/Course";

export default function CourseResources() {
    const [allCourses, setAllCourses] = useState<CourseInfo[] | null>(null);
    const [userCourses, setUserCourses] = useState<CourseInfo[] | null>(null);
    const [filteredCourses, setFilteredCourses] = useState<CourseInfo[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { showToast } = useToast();

    // get all public courses
    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            showToast("請先登入", "danger");
            window.location.href = "/";
            return;
        }

        const fetchCourses = async () => {
            try {
                asyncGet(course_api.getAllPublicCourses, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then((res) => {
                    if (res.code === 200) {
                        setAllCourses(res.body);
                        setFilteredCourses(res.body);
                        console.log("課程資料載入成功:", res.body);
                    } else {
                        showToast(`無法獲取課程資料： ${res.message}`, "danger");
                        throw new Error(`無法獲取課程資料： ${res.message}`);
                    }
                }).finally(() => {
                    setLoading(false)
                });
            } catch (error) {
                console.error("載入課程時發生錯誤:", error);
                showToast("載入課程時發生錯誤", "danger");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // get user's courses
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            showToast("請先登入", "danger");
            window.location.href = "/";
            return;
        }

        const fetchUserCourses = async () => {
            try {
                const response = await asyncGet(user_api.getUserCourses, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.code === 200) {
                    setUserCourses(response.body);
                } else {
                    showToast(`無法獲取用戶課程資料： ${response.message}`, "danger");
                }
            } catch (error) {
                console.error("載入用戶課程時發生錯誤:", error);
                showToast("載入用戶課程時發生錯誤", "danger");
            }
        };

        fetchUserCourses();
    }, [userCourses]);

    function handleFillter(difficulty: string | null, rating: string | null) {
        let tempCourses = allCourses ? [...allCourses] : [];

        // 篩選難度
        if (difficulty && difficulty !== "All") {
            tempCourses = tempCourses.filter(course => course.difficulty === difficulty);
        }

        // 篩選評價
        if (rating && rating !== "All") {
            // 解析 "4.0 ~ 5.0" 這樣的字串
            const [min, max] = rating.split('~').map(s => parseFloat(s.trim()));
            tempCourses = tempCourses.filter(course => course.rating >= min && course.rating <= max);
        }

        setFilteredCourses(tempCourses);
    }

    function handleSearch(searchTerm: string) {
        if (!allCourses) return;

        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filtered = allCourses.filter(course =>
            course.course_name.toLowerCase().includes(lowerCaseSearchTerm)
        );

        setFilteredCourses(filtered);
    }

    function handleDropdownSelect(selectedOption: string) {
        if (!allCourses) return;

        let sortedCourses = [...allCourses];
        if (selectedOption === "最高評價") {
            sortedCourses.sort((a, b) => b.rating - a.rating);
        } else if (selectedOption === "最新課程") {
            sortedCourses.sort((a, b) => new Date(b.update_date).getTime() - new Date(a.update_date).getTime());
        }

        setFilteredCourses(sortedCourses);
    }

    return (
        <>
            <NavBar />
            <div className="course-resources-title-container container mx-auto my-5">
                <h1 className="text-4xl font-bold mb-4">課程資源</h1>
            </div>
            <Container>
                <Row>
                    <Col lg={2}>
                        <Filter handleFilter={handleFillter} />
                    </Col>
                    <Col lg={10}>
                        <Search handleSearch={handleSearch} handleDropdownSelect={handleDropdownSelect} />
                        <Cards courses={filteredCourses} userCourses={userCourses} loading={loading} />
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
}