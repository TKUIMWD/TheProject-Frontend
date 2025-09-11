import { Container, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { user_api } from "../../enum/api";
import { asyncPut } from "../../utils/fetch";
import { useState, useEffect } from "react";
import defaultAvatarImg from "../../assets/images/Dashboard/default-avatar.jpg";
import { processAvatarPath } from "../../utils/processAvatar";
import { getOptions } from "../../utils/token";
import { useToast } from "../../context/ToastProvider";
import "../../style/dashboard/Profile.css";
import "../../style/button/button.css";


export default function Profile() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [avatarPath, setAvatarPath] = useState(defaultAvatarImg);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    // 獲取用戶資料
    useEffect(() => {
        fetchUserProfile();

        // 清理函數，釋放預覽URL的內存
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, []);

    // 監聽預覽URL變化，清理舊的URL
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    async function fetchUserProfile() {

        try {
            setLoading(true);
            const options = getOptions();
            const response = await fetch(user_api.getProfile, options);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("獲取用戶資料回應:", result);

            if (result.code === 200 && result.body) {
                setUsername(result.body.username || "");
                setEmail(result.body.email || "");
                // 確保頭像路徑正確處理
                setAvatarPath(processAvatarPath(result.body.avatar_path));
            } else if (result.code === 400 && result.message === "invalid token") {
                showToast("登入已過期，請重新登入", "danger");
                // 可選：自動跳轉到登入頁面
            } else {
                showToast("獲取用戶資料失敗", "danger");
            }
        } catch (error) {
            console.error("獲取用戶資料失敗:", error);
            showToast("網路錯誤，請檢查連接", "danger");
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateProfile(e: React.FormEvent) {
        e.preventDefault();

        try {
            const options = getOptions();
            const body = {
                username: username,
                email: email,
            }
            const response = await asyncPut(user_api.updateProfile, body, options);
            console.log("更新回應:", response);

            if (response.code === 400) {
                if (response.message === "invalid token") {
                    showToast("登入已過期，請重新登入", "danger");
                    return;
                } else if (response.message.startsWith("missing required fields:")) {
                    // missing fields
                    let message = "請輸入"
                    if (response.message.includes("username")) {
                        message += "用戶名稱";
                    }
                    if (response.message.includes("email")) {
                        if (message !== "請輸入") message += "、";
                        message += "電子郵件";
                    }
                    showToast(message, "danger");
                    return;
                } else if (/^please wait \d+ minute\(s\) before resending the verification email/.test(response.message)) {
                    const waitTime = response.message.match(/\d+/)?.[0];
                    showToast(`請查收驗證信，或等${waitTime}分鐘後重試`, "danger");
                    return;
                }
            } else if (response.code === 500) {
                // server error
                showToast("伺服器錯誤，請稍後再試", "danger");

                return;
            } else if (response.code === 200) {
                // update success
                showToast("個人資訊更新成功", "success");
                setTimeout(() => {
                    showToast("請重新登入", "danger");
                    setTimeout(() => {
                        localStorage.removeItem('token');
                        window.location.href = '/';
                    }, 1000);
                }, 1000);
                return;
            }
        } catch (error: any) {
            console.error("更新失敗:", error);
            showToast(`更新失敗：${error.message}`, "danger");
        }
    };

    // 處理檔案選擇
    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // 檢查檔案格式 - 根據 API 文檔，支援 JPEG, PNG, WebP
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showToast("檔案格式不符合，請選擇 PNG、JPG 或 WebP 格式", "danger");
            e.target.value = ''; // 清空選擇
            return;
        }

        // 檢查檔案大小 - API 文檔規定最大 5MB
        if (file.size > 5 * 1024 * 1024) {
            showToast("檔案大小不可超過 5MB", "danger");
            e.target.value = ''; // 清空選擇
            return;
        }

        // 清理舊的預覽 URL
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setSelectedFile(file);

        // 建立預覽 URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        const fileSize = (file.size / (1024 * 1024)).toFixed(2);
        showToast(`檔案選擇成功 (${fileSize}MB)`, "success");
    }

    // 上傳頭像
    async function handleUploadAvatar() {
        if (!selectedFile) {
            showToast("請先選擇檔案", "danger");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            showToast("請先登入", "danger");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('avatar', selectedFile);

        try {
            const response = await fetch(user_api.uploadAvatar, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (result.code === 200) {
                // 處理上傳成功後的頭像路徑
                setAvatarPath(processAvatarPath(result.body.avatar_path));
                setSelectedFile(null);
                setPreviewUrl(null); // 清除預覽
                showToast("頭像上傳成功", "success");
                // 清空檔案選擇
                const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
                if (fileInput) fileInput.value = '';

                // 延遲重新整理頁面，讓用戶看到成功訊息
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else if (result.code === 400) {
                if (result.message === "invalid token") {
                    showToast("登入已過期，請重新登入", "danger");
                } else if (result.message === "文件大小超過限制（最大 5MB）") {
                    showToast("檔案大小超過 5MB 限制", "danger");
                } else if (result.message === "只允許上傳 JPEG、PNG 或 WebP 格式的圖片") {
                    showToast("檔案格式不符合要求", "danger");
                } else {
                    showToast(result.message || "上傳失敗", "danger");
                }
            } else if (result.code === 403) {
                showToast("請先完成郵箱驗證", "danger");
            } else {
                showToast("上傳失敗，請稍後再試", "danger");
            }
        } catch (error) {
            console.error("上傳頭像失敗:", error);
            showToast("上傳失敗，請檢查網路連接", "danger");
        } finally {
            setUploading(false);
        }
    }

    // 刪除頭像
    async function handleDeleteAvatar() {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast("請先登入", "danger");
            return;
        }

        // 檢查是否為預設頭像，如果是則不需要刪除
        if (avatarPath === defaultAvatarImg || avatarPath.includes('default-avatar')) {
            showToast("目前使用的是預設頭像", "secondary");
            return;
        }

        if (!confirm("確定要刪除目前的頭像嗎？")) {
            return;
        }

        try {
            const response = await fetch(user_api.deleteAvatar, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (result.code === 200) {
                // 處理刪除成功後的頭像路徑
                setAvatarPath(processAvatarPath(result.body.avatar_path));
                setSelectedFile(null);
                setPreviewUrl(null); // 清除預覽
                showToast("頭像刪除成功", "success");
                // 清空檔案選擇
                const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
                if (fileInput) fileInput.value = '';

                // 延遲重新整理頁面，讓用戶看到成功訊息
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else if (result.code === 400) {
                if (result.message === "invalid token") {
                    showToast("登入已過期，請重新登入", "danger");
                } else {
                    showToast(result.message || "刪除失敗", "danger");
                }
            } else if (result.code === 403) {
                showToast("請先完成郵箱驗證", "danger");
            } else {
                showToast("刪除失敗，請稍後再試", "danger");
            }
        } catch (error) {
            console.error("刪除頭像失敗:", error);
            showToast("刪除失敗，請檢查網路連接", "danger");
        }
    }

    return (
        <>
            <Container className="profile">
                <Row className="mb-4">
                    <h3>個人資訊</h3>
                    <hr />
                </Row>

                {/* 大頭貼區塊 */}
                <Row className="avatar-section mb-4">
                    <Col lg={12}>
                        <h4 className="section-title mb-3">大頭貼設定</h4>
                        <div className="avatar-container p-3">
                            <Row className="justify-content-center">
                                <Col xs={12} className="text-center mb-4">
                                    <div className="avatar-preview">
                                        {loading ? (
                                            <div className="avatar-loading">
                                                <Spinner animation="border" size="sm" />
                                            </div>
                                        ) : (
                                            <img
                                                src={previewUrl || avatarPath}
                                                alt="user-avatar"
                                                className="rounded-circle"
                                                width={80}
                                                height={80}
                                                style={{ objectFit: 'cover' }}
                                                onError={(e) => {
                                                    // 如果頭像載入失敗，使用預設頭像
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = defaultAvatarImg;
                                                }}
                                            />
                                        )}
                                        {previewUrl && !loading && (
                                            <div className="preview-badge">
                                                <small className="text-success">預覽</small>
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                            <Row className="justify-content-center">
                                <Col xs={12} md={8} lg={6} className="text-center">
                                    <h5 className="mb-2">更新大頭貼</h5>
                                    <p className="text-muted mb-3">格式：PNG, JPG, WebP、檔案大小不超過 5MB</p>
                                    <div className="custom-file-upload">
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg,image/webp"
                                            onChange={handleFileSelect}
                                            id="avatar-upload"
                                            className="file-input-hidden"
                                            disabled={uploading || loading}
                                        />
                                        <label htmlFor="avatar-upload" className="file-upload-btn">
                                            {uploading ? "上傳中..." : (selectedFile ? selectedFile.name : "選擇檔案")}
                                        </label>
                                    </div>
                                </Col>
                            </Row>
                            
                            <Row className="mt-3">
                                <Col xs={12} className="text-center">
                                    <div className="avatar-buttons-bottom">
                                        {selectedFile && (
                                            <Button
                                                variant="outline-secondary"
                                                className="avatar-btn-bottom"
                                                onClick={() => {
                                                    // 清理預覽 URL
                                                    if (previewUrl) {
                                                        URL.revokeObjectURL(previewUrl);
                                                    }
                                                    setSelectedFile(null);
                                                    setPreviewUrl(null);
                                                    const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
                                                    if (fileInput) fileInput.value = '';
                                                    showToast("已清除選擇", "secondary");
                                                }}
                                                disabled={uploading || loading}
                                                title="取消選擇的檔案"
                                            >
                                                取消
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline-success"
                                            className="avatar-btn-bottom"
                                            onClick={handleUploadAvatar}
                                            disabled={!selectedFile || uploading || loading}
                                            title={selectedFile ? "上傳選擇的頭像" : "請先選擇檔案"}
                                        >
                                            {uploading ? "上傳中..." : "更新"}
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            className="avatar-btn-bottom"
                                            onClick={handleDeleteAvatar}
                                            disabled={uploading || loading}
                                            title="刪除目前的頭像"
                                        >
                                            刪除
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                {/* 個人資料表單 */}
                <Row>
                    <Col lg={12}>
                        <h4 className="section-title">個人資料</h4>
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" className="me-2" />
                                載入用戶資料中...
                            </div>
                        ) : (
                            <Form onSubmit={handleUpdateProfile} className="profile-form">
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="3" className="form-label">
                                        用戶名稱
                                    </Form.Label>
                                    <Col sm="12">
                                        <Form.Control
                                            type="text"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            className="form-input"
                                            placeholder="請輸入用戶名稱"
                                            disabled={loading}
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-4">
                                    <Form.Label column sm="3" className="form-label">
                                        電子郵件
                                    </Form.Label>
                                    <Col sm="12">
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="form-input"
                                            placeholder="請輸入電子郵件"
                                            disabled={true}
                                        />
                                    </Col>
                                </Form.Group>

                                <div className="text-center">
                                    <Button
                                        variant="success"
                                        type="submit"
                                        className="update-btn"
                                        disabled={loading}
                                    >
                                        更新個人資料
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
}