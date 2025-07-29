import { createContext, useState, useContext, ReactNode } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

// Toast 訊息的類型
type ToastVariant = 'success' | 'danger' | 'secondary' | 'warning' | 'info';

interface ToastMessage {
    id: number;
    message: string;
    variant: ToastVariant;
}

// Context 要提供的值的類型
interface ToastContextType {
    showToast: (message: string, variant?: ToastVariant) => void;
}

// context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Provider
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = (message: string, variant: ToastVariant = 'secondary') => {
        const newToast: ToastMessage = {
            id: Date.now(),
            message,
            variant,
        };
        setToasts(prevToasts => [...prevToasts, newToast]);
    };

    const removeToast = (id: number) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer
                position="top-center"
                className="p-3"
                style={{ zIndex: 9999, position: 'fixed' }} // 確保 Toast 在最上層
            >
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        onClose={() => removeToast(toast.id)}
                        show={true}
                        delay={3000}
                        autohide
                        bg={toast.variant}
                    >
                        <Toast.Body className="text-white">{toast.message}</Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
}

// 建立自訂 Hook，方便其他元件使用
export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}