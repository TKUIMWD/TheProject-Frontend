import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { asyncPost } from '../../utils/fetch';
import { useToast } from '../../context/ToastProvider';
import { course_api } from '../../enum/api';

interface JoinCourseModalProps {
    courseId: string;
    show: boolean;
    setShow: () => void;
}

export default function JoinCourseModal({ courseId, show, setShow }: JoinCourseModalProps) {
    const { showToast } = useToast();
    
    if (!courseId) {
        console.error("JoinCourseModal: courseId is required");
        return null;
    }

    const handleClose = () => setShow();

    const handleJoinCourse = (courseId: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("請先登入");
            window.location.href = "/";
            return;
        }

        if (!courseId) {
            showToast("無效的課程 ID", "danger");
            return;
        }

        asyncPost(course_api.joinCourseById(courseId), {}, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((res) => {
            if (res.code === 200) {
                showToast("成功加入課程", "success");
                handleClose();
                window.location.reload();
            } else {
                showToast(`加入課程失敗: ${res.message}`, "danger");
                handleClose();
                window.location.reload();
            }
        }).catch((error) => {
            console.error("加入課程時發生錯誤:", error);
            showToast("加入課程時發生錯誤", "danger");
        })
    }


    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>加入課程</Modal.Title>
                </Modal.Header>
                <Modal.Body>您尚未加入課程，加入課程以查看更多資訊</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => handleJoinCourse(courseId)}>加入課程</Button>
                    <Button variant="secondary" onClick={handleClose}>取消</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
