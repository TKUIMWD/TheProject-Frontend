import React, { useRef, useState, useEffect } from 'react';
import AIAssistantMessage from './AIAssistantMessage';
import "bootstrap-icons/font/bootstrap-icons.css";
import '../../style/AIAssistant/DraggableAIContainer.css';

export default function DraggableAIContainer() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: window.innerWidth - 360, y: window.innerHeight - 360 });

    // 測試用：確認元件有渲染
    useEffect(() => {
        console.log('DraggableAIContainer mounted');
    }, []);

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

        // 檢查是否點擊在特定互動元素上
        const target = e.target as HTMLElement;

        // 只有點擊在訊息框的實際內容或 widget 的 canvas 上才不拖動
        const isInteractiveElement = target.closest('.ai-assistant-message') ||
            target.tagName === 'CANVAS' ||
            target.tagName === 'BUTTON' ||
            target.tagName === 'A';

        if (isInteractiveElement) return;

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
            const containerWidth = 320; // 容器寬度
            const containerHeight = 320; // 容器高度
            const maxX = window.innerWidth - containerWidth;
            const maxY = window.innerHeight - containerHeight;

            const clampedPosition = {
                x: Math.max(0, Math.min(maxX, newX)),
                y: Math.max(0, Math.min(maxY, newY))
            };

            setPosition(clampedPosition);
        };

        const handleMouseUp = () => {
            if (isDragging) {
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

    // 監聽並移動 sakana-widget 到容器內
    useEffect(() => {
        const moveSakanaWidget = () => {
            const sakanaContainer = document.getElementById('sakana-widget-superadmin');
            const targetContainer = document.getElementById('sakana-widget-target');

            if (sakanaContainer && targetContainer && !targetContainer.contains(sakanaContainer)) {
                // 調整 sakana-widget 的樣式
                sakanaContainer.style.position = 'absolute';
                sakanaContainer.style.right = '0px';
                sakanaContainer.style.bottom = '0px';
                sakanaContainer.style.transform = 'none';
                sakanaContainer.style.zIndex = '1';

                // 移動到容器內
                targetContainer.appendChild(sakanaContainer);
            }
        };

        // 定期檢查並移動 sakana widget
        const interval = setInterval(moveSakanaWidget, 500);

        // 立即執行一次
        setTimeout(moveSakanaWidget, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            ref={containerRef}
            className={`draggable-ai-container ${isDragging ? 'dragging' : ''}`}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`
            }}
            onMouseDown={handleMouseDown}
        >
            {/* 拖動手柄 */}
            <div className="drag-handle">
                <i className="bi bi-arrows-move"></i>
            </div>

            {/* 訊息框 */}
            <div className="message-wrapper">
                <AIAssistantMessage />
            </div>

            {/* Sakana Widget 目標位置 */}
            <div
                className="sakana-widget-target"
                id="sakana-widget-target"
            />
        </div>
    );
}
