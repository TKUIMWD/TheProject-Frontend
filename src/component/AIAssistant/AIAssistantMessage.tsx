import { useState, useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';
import '../../style/aiAssistant/AIAssistantMessage.css';

interface AIAssistantMessageProps {
    messages?: string[];
    showDuration?: number;
    hideDuration?: number;
}

const defaultMessages = [
    "需要幫助嗎？",
    "探索新功能和工具",
    "系統正常，一切順利！",
    "TKUIMWD 入圍決賽!!"
];

export default function AIAssistantMessage({
    messages = defaultMessages,
    showDuration = 6000,
    hideDuration = 4000
}: AIAssistantMessageProps) {
    const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const messageTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const startMessageCycle = () => {
            const cycleDuration = showDuration + hideDuration;

            const runCycle = () => {
                // 顯示訊息
                setShowMessage(true);
                
                setTimeout(() => {
                    // 隱藏訊息
                    setShowMessage(false);
                    
                    setTimeout(() => {
                        // 切換到下一個訊息
                        setCurrentMessageIndex((prevIndex) => 
                            (prevIndex + 1) % messages.length
                        );
                    }, hideDuration);
                }, showDuration);
            };

            // 立即開始第一個循環
            runCycle();
            
            // 設定定時器重複循環
            messageTimerRef.current = setInterval(runCycle, cycleDuration);
        };

        startMessageCycle();

        // 清理定時器
        return () => {
            if (messageTimerRef.current) {
                clearInterval(messageTimerRef.current);
                messageTimerRef.current = null;
            }
        };
    }, [messages, showDuration, hideDuration]);

    if (!showMessage) return null;

    return (
        <Card className="ai-assistant-message">
            <Card.Body className="ai-assistant-message-body">
                <div className="ai-assistant-arrow-outer" />
                <div className="ai-assistant-arrow-inner" />
                
                <div className="ai-assistant-content">
                    <i className="bi bi-chat-dots-fill ai-assistant-icon" />
                    {messages[currentMessageIndex]}
                </div>
            </Card.Body>
        </Card>
    );
}
