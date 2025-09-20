import { Row, Col, Image, Button, Modal, ProgressBar } from "react-bootstrap";
import { VM_Box_Info } from "../../interface/VM/VM_Box";
import { useEffect, useState } from "react";
import { UserProfile } from "../../interface/User/User";
import { processAvatarPath } from "../../utils/processAvatar";
import { getOptions } from "../../utils/token";
import { asyncGet, asyncPost } from "../../utils/fetch";
import { box_api, user_api } from "../../enum/api";
import { useToast } from "../../context/ToastProvider";
import { Reviews } from "../../interface/Review/Review";
import "../../style/BoxAndCourseUniversal/UniversalContent.css";

interface WriteReviewAreaProps {
    showWriteReview: boolean;
    handleCloseWriteReview: () => void;
    userProfile?: UserProfile;
    handleRating?: (rating: number, comments: string) => void;
    box: VM_Box_Info;
}

function calculateRatingDistribution(reviews: Reviews[]) {
    const distribution: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const totalReviews = reviews.length;

    if (totalReviews === 0) {
        return distribution; // 如果沒有評論，所有百分比都是 0
    }

    // 統計每個星級的評論數量
    for (const review of reviews) {
        // 確保評分在 1-5 之間
        if (review.rating_score >= 1 && review.rating_score <= 5) {
            distribution[review.rating_score]++;
        }
    }

    // 將數量轉換為百分比
    for (const key in distribution) {
        const rating = key as unknown as keyof typeof distribution;
        distribution[rating] = (distribution[rating] / totalReviews) * 100;
    }

    return distribution;
}

function renderStars(rating: number | undefined) {
    const stars = [];
    const score = rating ?? 0;

    for (let i = 1; i <= 5; i++) {
        if (score >= i) {
            // 滿星
            stars.push(<i key={i} className="bi bi-star-fill text-warning" />);
        } else if (score >= i - 0.5) {
            // 半星
            stars.push(<i key={i} className="bi bi-star-half text-warning" />);
        } else {
            // 空星
            stars.push(<i key={i} className="bi bi-star text-warning" />);
        }
    }
    return stars;
}

function RatingScore({ box, reviews }: { box: VM_Box_Info, reviews: Reviews[] }) {
    const reviewsPercentMap = calculateRatingDistribution(reviews);
    return (
        <>
            <Row className="align-items-center">
                <Col lg={3} className="text-center">
                    <h1 className="display-3 mb-0 fw-bold">
                        {box.rating_score?.toFixed(1) ?? 'N/A'}
                    </h1>
                    {renderStars(box.rating_score)}
                    <p>({box.review_count ?? 0} 則評論)</p>
                </Col>
                <Col lg={9} className="d-flex flex-column gap-3">
                    {[5, 4, 3, 2, 1].map((index) => {
                        return (
                            <Row className="align-items-center">
                                <Col xs={8} lg={9}>
                                    <ProgressBar variant="warning" now={reviewsPercentMap[index]} />
                                </Col>
                                <Col>
                                    {renderStars(index)} {reviewsPercentMap[index]}%
                                </Col>
                            </Row>
                        )
                    })}
                </Col>
            </Row>
        </>
    );
}

function WriteReviewArea({ userProfile, handleRating, box, showWriteReview, handleCloseWriteReview }: WriteReviewAreaProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");

    const Star = ({ index }: { index: number }) => {
        // 決定星星是否要填滿：如果懸停評分大於等於當前 index，或最終評分大於等於當前 index
        const isFilled = hoverRating >= index || (hoverRating === 0 && rating >= index);
        return (
            <i
                className={`bi ${isFilled ? 'bi-star-fill' : 'bi-star'} text-warning fs-4`}
                onMouseEnter={() => setHoverRating(index)}
                onClick={() => setRating(index)}
                style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
            />
        );
    };

    const handleSubmit = () => {
        if (handleRating && rating > 0) {
            handleRating(rating, comment);
            setRating(0);
            setComment("");
        }
    };

    return (
        <Modal size="lg" show={showWriteReview} onHide={handleCloseWriteReview} centered >
            <Modal.Header closeButton>
                <Modal.Title>撰寫評論</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="align-items-center mb-3">
                    <Col xs="auto">
                        <span className="fw-bold">您的評分:</span>
                    </Col>
                    <Col onMouseLeave={() => setHoverRating(0)}>
                        {[1, 2, 3, 4, 5].map((index) => (
                            <Star key={index} index={index} />
                        ))}
                    </Col>
                </Row>
                <Row className="align-items-center mb-3">
                    <Col xs="auto">
                        <Image
                            src={processAvatarPath(userProfile?.avatar_path)}
                            alt={userProfile?.username}
                            className="rounded-circle"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                    </Col>
                    <Col>
                        <textarea
                            className="form-control"
                            rows={3}
                            placeholder={userProfile ? `發表你對 ${box.name} 的評論...` : "請先登入以發表評論..."}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={!userProfile}
                        ></textarea>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-end">
                        <button
                            className={`btn ${userProfile ? 'btn-success' : 'btn-secondary'}`}
                            onClick={handleSubmit}
                            disabled={!userProfile || rating === 0}
                        >
                            發表評論
                        </button>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
}

function AllReviews({ reviews, handleShowWriteReview }: { reviews: Reviews[]; handleShowWriteReview: () => void }) {
    if (!reviews || reviews.length === 0) {
        return (
            <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="mb-4"><b>留言({reviews.length})</b></h3>
                    <Button variant="success" onClick={handleShowWriteReview}>新增留言</Button>
                </div>
                <p className="text-muted">目前尚無留言</p>
            </>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-4"><b>留言({reviews.length})</b></h3>
                <Button variant="success" onClick={handleShowWriteReview}>新增留言</Button>
            </div>
            {reviews.map((review) => (
                <div key={review._id} className="mb-4">
                    <Row className="d-flex align-items-center justify-content-center">
                        <Col xs="auto">
                            <Image
                                src={processAvatarPath(review.reviewer_info.avatar_path)}
                                alt={review.reviewer_info.username || "匿名使用者"}
                                className="rounded-circle"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                        </Col>

                        <Col>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="fw-bold">{review.reviewer_info.username || "匿名使用者"}</div>
                                    <div>{renderStars(review.rating_score)}</div>
                                </div>
                                <div className="text-muted small">{new Date(review.submitted_date).toLocaleString()}</div>
                            </div>
                            {review.comment && (
                                <p className="mt-2 mb-0">{review.comment}</p>
                            )}
                        </Col>
                    </Row>
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default function BoxReviews({ box }: { box: VM_Box_Info }) {
    const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);
    const [reviews, setReviews] = useState<Reviews[]>([]);
    const { showToast } = useToast();

    const [showWriteReview, setShowWriteReview] = useState(false);
    // 打開和關閉 Modal 的處理函式
    const handleShowWriteReview = () => setShowWriteReview(true);
    const handleCloseWriteReview = () => setShowWriteReview(false);

    // get user profile
    useEffect(() => {
        try {
            const options = getOptions();
            asyncGet(user_api.getProfile, options)
                .then((res) => {
                    if (res.code !== 200) {
                        throw new Error(res.message || "取得使用者資料失敗");
                    }
                    setUserProfile(res.body || []);
                })
                .catch((error) => {
                    showToast("取得使用者資料失敗，請重新登入", "danger");
                    console.error("取得使用者資料失敗:", error);
                });
        } catch (error: any) {
            showToast(`取得 Box 評論失敗: ${error.message}`, "danger");
            console.error("取得 Box 評論失敗:", error);
        }
    }, []);

    useEffect(() => {
        try {
            const options = getOptions();
            asyncGet(`${box_api.getBoxReviews}?box_id=${box._id}`, options)
                .then((res) => {
                    if (res.code !== 200) {
                        // throw new Error(res.message || "取得 Box 評論失敗");
                        setReviews([]);
                        return;
                    }
                    setReviews(res.body.reviews || []);
                })
                .catch((error) => {
                    showToast("取得 Box 評論失敗", "danger");
                    console.error("取得 Box 評論失敗:", error);
                });
        } catch (error: any) {
            showToast(`取得 Box 評論失敗: ${error.message}`, "danger");
            console.error("取得 Box 評論失敗:", error);
        }
    }, [box]);

    const handleRating = (rating: number, comment: string) => {
        try {
            const options = getOptions();
            const body = {
                box_id: box._id,
                rating: rating,
                comment: comment
            }
            asyncPost(box_api.rateBox, body, options)
                .then((res) => {
                    if (res.code !== 200) {
                        throw new Error(res.message || "提交評論失敗");
                    }
                    // 成功後關閉 Modal 並更新評論列表
                    setShowWriteReview(false);
                    setReviews((prevReviews) => [
                        {
                            _id: res.body.review_id, // 假設後端回傳新評論的 ID
                            rating_score: rating,
                            comment: comment,
                            submitted_date: new Date(),
                            reviewer_info: {
                                username: userProfile?.username || "匿名使用者",
                                avatar_path: userProfile?.avatar_path || ""
                            }
                        },
                        ...prevReviews
                    ]);
                    showToast("評論提交成功", "success");
                })
                .catch((error) => {
                    console.error("提交評論失敗:", error);
                    showToast(`提交評論失敗: ${error.message}`, "danger");
                });
        } catch (error: any) {
            console.error("提交評論失敗:", error);
            showToast(`提交評論失敗: ${error.message}`, "danger");
        }
    };

    return (
        <div className="tab-pane-content">
            <RatingScore box={box} reviews={reviews} />
            <hr />
            <AllReviews reviews={reviews} handleShowWriteReview={handleShowWriteReview} />
            <WriteReviewArea
                showWriteReview={showWriteReview}
                handleCloseWriteReview={handleCloseWriteReview}
                userProfile={userProfile}
                handleRating={handleRating}
                box={box}
            />
        </div>
    );
}
