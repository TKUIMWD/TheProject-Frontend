import React, { useRef, useState, useEffect } from 'react';
import AIChatDialog from './AIChatDialog';
import AIAssistantImage from '../../assets/AI_assitant.png';
import "bootstrap-icons/font/bootstrap-icons.css";
import '../../style/AIAssistant/DraggableAIContainer.css';

export default function DraggableAIContainer() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: window.innerWidth - 240, y: window.innerHeight - 360 });
    const [isChatOpen, setIsChatOpen] = useState(false);
    const mouseDownPos = useRef({ x: 0, y: 0 });

    // 從 localStorage 載入位置
    useEffect(() => {
        const savedPosition = localStorage.getItem('ai-container-position');
        if (savedPosition) {
            try {
                const pos = JSON.parse(savedPosition);
                setPosition(pos);
            } catch (e) {
                console.warn('無法載入 AI 容器位置:', e);
            }
        }
    }, []);

    // 保存位置到 localStorage
    const savePosition = (newPosition: { x: number; y: number }) => {
        try {
            localStorage.setItem('ai-container-position', JSON.stringify(newPosition));
        } catch (e) {
            console.warn('無法保存 AI 容器位置:', e);
        }
    };

    // 開始拖動
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!containerRef.current) return;

        // 記錄起始位置
        mouseDownPos.current = { x: e.clientX, y: e.clientY };

        const rect = containerRef.current.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        setIsDragging(true);

        // 防止選取文字和默認行為
        e.preventDefault();
        e.stopPropagation();
    };

    // 拖動中
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !containerRef.current) return;

            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;

            // 確保容器不會拖出視窗範圍
            const containerWidth = 240; // 容器寬度（根據 CSS）
            const containerHeight = 360; // 容器高度
            const padding = 0; // 邊界 padding
            const maxX = window.innerWidth - containerWidth - padding;
            const maxY = window.innerHeight - containerHeight - padding;

            const clampedPosition = {
                x: Math.max(padding, Math.min(maxX, newX)),
                y: Math.max(padding, Math.min(maxY, newY))
            };

            setPosition(clampedPosition);
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (isDragging) {
                // 檢查是否為點擊（移動距離很小）
                const distance = Math.sqrt(
                    Math.pow(e.clientX - mouseDownPos.current.x, 2) + 
                    Math.pow(e.clientY - mouseDownPos.current.y, 2)
                );
                
                console.log('移動距離:', distance);
                
                if (distance < 10) {
                    console.log('單擊 AI 助理，開啟對話框');
                    setIsChatOpen(true);
                }
                
                setIsDragging(false);
                savePosition(position);
            }
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove, { passive: false });
            document.addEventListener('mouseup', handleMouseUp, { passive: false });
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging, dragOffset, position]);

    return (
        <>
            <div
                ref={containerRef}
                className={`draggable-ai-container ${isDragging ? 'dragging' : ''}`}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`
                }}
                onMouseDown={handleMouseDown}
            >
                {/* AI 助理圖片 */}
                <img 
                    src={AIAssistantImage} 
                    alt="AI Assistant" 
                    className="ai-assistant-avatar"
                    draggable={false}
                />
            </div>

            {/* AI 聊天對話框 */}
            <AIChatDialog 
                isOpen={isChatOpen} 
                onClose={() => setIsChatOpen(false)} 
            />
        </>
    );
}
