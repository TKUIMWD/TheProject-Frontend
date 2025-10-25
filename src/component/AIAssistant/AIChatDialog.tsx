import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { streamPlatformGuideChat, streamBoxHintChat } from '../../utils/aiChatApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import '../../style/AIAssistant/AIChatDialog.css';

interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

interface AIChatDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AIChatDialog({ isOpen, onClose }: AIChatDialogProps) {
    const location = useLocation();
    
    // 檢查當前是否在 VM Detail 頁面並提取 vmId
    const isVMDetailPage = location.pathname.startsWith('/vmDetail/');
    const vmId = isVMDetailPage ? location.pathname.split('/vmDetail/')[1] : null;
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    
    // 初始化歡迎訊息
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                id: '1',
                content: isVMDetailPage 
                    ? '你好！我是 AI 助理，可以協助你解決 Box 挑戰中的問題。有什麼需要幫助的嗎？'
                    : '你好！我是 AI 助理,有什麼可以幫助你的嗎?',
                sender: 'ai',
                timestamp: new Date()
            }]);
        }
    }, [isVMDetailPage, messages.length]);

    // 檢查是否已滾動到底部
    const isScrolledToBottom = () => {
        if (!messagesContainerRef.current) return true;
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        // 允許 50px 的誤差範圍
        return scrollHeight - scrollTop - clientHeight < 50;
    };

    // 監聽滾動事件,檢測用戶是否手動滾動
    const handleScroll = () => {
        if (!messagesContainerRef.current) return;
        
        if (isScrolledToBottom()) {
            setIsUserScrolling(false);
        } else {
            setIsUserScrolling(true);
        }
    };

    // 自動滾動到最新訊息 (僅當用戶未手動滾動時)
    useEffect(() => {
        if (!isUserScrolling) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isUserScrolling]);

    // 發送訊息
    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        const userInput = inputValue;
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setIsUserScrolling(false); // 發送新訊息時重置滾動狀態,確保自動滾動到底部

        // 創建一個臨時的 AI 訊息用於 streaming
        const aiMessageId = (Date.now() + 1).toString();
        const aiMessage: Message = {
            id: aiMessageId,
            content: '',
            sender: 'ai',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);

        try {
            // 調用 AI Chat Stream API
            console.log('開始 Stream，AI Message ID:', aiMessageId);
            
            // 根據當前頁面選擇使用哪個 API
            if (isVMDetailPage && vmId) {
                console.log('使用 Box Hint API, VM ID:', vmId);
                await streamBoxHintChat({
                    userInput,
                    vmId,
                    onChunk: (chunk) => {
                        console.log('收到 Box Hint chunk:', chunk);
                        // 逐步更新 AI 訊息內容
                        setMessages(prev => {
                            const updated = prev.map(msg => 
                                msg.id === aiMessageId 
                                    ? { ...msg, content: msg.content + chunk }
                                    : msg
                            );
                            console.log('更新後的訊息:', updated.find(m => m.id === aiMessageId)?.content);
                            return updated;
                        });
                    },
                    onComplete: (fullResponse) => {
                        console.log('Box Hint 回應完成:', fullResponse);
                        setIsLoading(false);
                    },
                    onError: (error) => {
                        console.error('Box Hint Chat 錯誤:', error);
                        
                        // 直接使用後端返回的錯誤訊息
                        const errorMessage = error.message;
                        const displayMessage = `❌ **錯誤**\n\n${errorMessage}`;
                        
                        // 更新訊息顯示錯誤
                        setMessages(prev => prev.map(msg => 
                            msg.id === aiMessageId 
                                ? { ...msg, content: displayMessage }
                                : msg
                        ));
                        setIsLoading(false);
                    }
                });
            } else {
                console.log('使用 Platform Guide API');
                await streamPlatformGuideChat({
                    userInput,
                    onChunk: (chunk) => {
                        console.log('收到 chunk:', chunk);
                        // 逐步更新 AI 訊息內容
                        setMessages(prev => {
                            const updated = prev.map(msg => 
                                msg.id === aiMessageId 
                                    ? { ...msg, content: msg.content + chunk }
                                    : msg
                            );
                            console.log('更新後的訊息:', updated.find(m => m.id === aiMessageId)?.content);
                            return updated;
                        });
                    },
                    onComplete: (fullResponse) => {
                        console.log('AI 回應完成:', fullResponse);
                        setIsLoading(false);
                    },
                    onError: (error) => {
                        console.error('AI Chat 錯誤:', error);
                        
                        // 直接使用後端返回的錯誤訊息
                        const errorMessage = error.message;
                        const displayMessage = `❌ **錯誤**\n\n${errorMessage}`;
                        
                        // 更新訊息顯示錯誤
                        setMessages(prev => prev.map(msg => 
                            msg.id === aiMessageId 
                                ? { ...msg, content: displayMessage }
                                : msg
                        ));
                        setIsLoading(false);
                    }
                });
            }
        } catch (error) {
            console.error('發送訊息失敗:', error);
            setIsLoading(false);
        }
    };

    // 處理 Enter 鍵發送
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="ai-chat-dialog-overlay" onClick={onClose}>
            <div className="ai-chat-dialog" onClick={(e) => e.stopPropagation()}>
                {/* 對話框標題 */}
                <div className="ai-chat-header">
                    <div className="ai-chat-title">
                        <i className="bi bi-robot"></i>
                        <span>AI 助理</span>
                    </div>
                    <button className="ai-chat-close-btn" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                {/* 訊息列表 */}
                <div className="ai-chat-messages" ref={messagesContainerRef} onScroll={handleScroll}>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`ai-chat-message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
                        >
                            <div className="message-avatar">
                                {message.sender === 'user' ? (
                                    <i className="bi bi-person-circle"></i>
                                ) : (
                                    <i className="bi bi-robot"></i>
                                )}
                            </div>
                            <div className="message-content">
                                <div className="message-text">
                                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                                <div className="message-time">
                                    {message.timestamp.toLocaleTimeString('zh-TW', { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="ai-chat-message ai-message">
                            <div className="message-avatar">
                                <i className="bi bi-robot"></i>
                            </div>
                            <div className="message-content">
                                <div className="message-text typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* 輸入區域 */}
                <div className="ai-chat-input-area">
                    <textarea
                        className="ai-chat-input"
                        placeholder="輸入訊息... (按 Enter 發送，Shift+Enter 換行)"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        rows={1}
                    />
                    <button
                        className="ai-chat-send-btn"
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                    >
                        <i className="bi bi-send-fill"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}
