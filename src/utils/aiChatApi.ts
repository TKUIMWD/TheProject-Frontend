/**
 * AI Chat API 工具函數
 * 使用類似 OpenAI SDK 的方式處理 SSE Stream
 */

const AI_CHAT_BASE = import.meta.env.VITE_API_BASE_URL + "/ai-chat";

export interface AIChatStreamOptions {
    userInput: string;
    onChunk?: (chunk: string) => void;
    onComplete?: (fullResponse: string) => void;
    onError?: (error: Error) => void;
    signal?: AbortSignal;
}

export interface BoxHintStreamOptions extends AIChatStreamOptions {
    vmId: string;
}

/**
 * 處理 SSE Stream，類似 OpenAI SDK 的 stream 處理
 * @param options Stream 選項
 * @returns Promise<string> 完整的回應
 */
export async function streamPlatformGuideChat(options: AIChatStreamOptions): Promise<string> {
    const { userInput, onChunk, onComplete, onError, signal } = options;
    
    // 獲取 Token
    const token = localStorage.getItem('token');
    if (!token) {
        const error = new Error('未找到登入 Token');
        onError?.(error);
        throw error;
    }

    try {
        console.log('開始 SSE 請求:', userInput);
        
        const response = await fetch(`${AI_CHAT_BASE}/platform/guide-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'text/event-stream',
            },
            body: JSON.stringify({
                user_input: userInput
            }),
            signal,
        });

        console.log('收到回應:', response.status, response.headers.get('content-type'));

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }

        if (!response.body) {
            throw new Error('無法獲取回應流');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let fullResponse = '';
        let buffer = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                // 解碼 chunk
                buffer += decoder.decode(value, { stream: true });
                
                // 按行處理 SSE 數據
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // 保留最後一行（可能不完整）

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    
                    // 跳過空行和註釋
                    if (!trimmedLine || trimmedLine.startsWith(':')) {
                        continue;
                    }

                    // 處理 SSE data 行
                    if (trimmedLine.startsWith('data: ')) {
                        const data = trimmedLine.slice(6); // 移除 "data: "
                        
                        // 檢查是否為結束標記
                        if (data === '[DONE]') {
                            console.log('收到 [DONE] 標記');
                            continue;
                        }

                        try {
                            const parsed = JSON.parse(data);
                            console.log('解析 SSE 數據:', parsed);
                            
                            // 統一的錯誤檢查:檢查是否有 error 字段
                            if (parsed.error) {
                                const errorCode = parsed.code || 'UNKNOWN';
                                const errorMessage = parsed.error;
                                
                                console.error('收到 API 錯誤:', { code: errorCode, error: errorMessage });
                                
                                // 創建帶有錯誤代碼的錯誤對象
                                const error = new Error(errorMessage);
                                (error as any).code = errorCode;
                                throw error;
                            }
                            
                            // 處理後端的格式: {"content":"文字"}
                            let content = '';
                            if (parsed.content) {
                                content = parsed.content;
                            } 
                            // 兼容舊格式: {"code":200,"body":{"response":"文字"}}
                            else if (parsed.code === 200 && parsed.body?.response) {
                                content = parsed.body.response;
                            } 
                            // 其他錯誤情況
                            else if (parsed.code && parsed.code !== 200) {
                                throw new Error(parsed.message || parsed.error || `API 錯誤: ${parsed.code}`);
                            }
                            
                            if (content) {
                                console.log('收到內容:', content);
                                fullResponse += content;
                                onChunk?.(content);
                            }
                        } catch (parseError) {
                            console.warn('SSE 數據解析錯誤:', parseError, 'Data:', data);
                            // 向上拋出所有錯誤
                            if (parseError instanceof Error) {
                                throw parseError;
                            }
                        }
                    }
                }
            }

            onComplete?.(fullResponse);
            return fullResponse;

        } finally {
            reader.releaseLock();
        }

    } catch (error) {
        const err = error instanceof Error ? error : new Error('未知錯誤');
        onError?.(err);
        throw err;
    }
}

/**
 * 處理 VM Detail 頁面的 Box Hint SSE Stream
 * @param options Stream 選項（包含 vmId）
 * @returns Promise<string> 完整的回應
 */
export async function streamBoxHintChat(options: BoxHintStreamOptions): Promise<string> {
    const { userInput, vmId, onChunk, onComplete, onError, signal } = options;
    
    // 獲取 Token
    const token = localStorage.getItem('token');
    if (!token) {
        const error = new Error('未找到登入 Token');
        onError?.(error);
        throw error;
    }

    try {
        console.log('開始 Box Hint SSE 請求:', { userInput, vmId });
        
        const response = await fetch(`${AI_CHAT_BASE}/box/hint-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'text/event-stream',
            },
            body: JSON.stringify({
                user_input: userInput,
                vm_id: vmId
            }),
            signal,
        });

        console.log('收到 Box Hint 回應:', response.status, response.headers.get('content-type'));

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }

        if (!response.body) {
            throw new Error('無法獲取回應流');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let fullResponse = '';
        let buffer = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                // 解碼 chunk
                buffer += decoder.decode(value, { stream: true });
                
                // 按行處理 SSE 數據
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // 保留最後一行（可能不完整）

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    
                    // 跳過空行和註釋
                    if (!trimmedLine || trimmedLine.startsWith(':')) {
                        continue;
                    }

                    // 處理 SSE data 行
                    if (trimmedLine.startsWith('data: ')) {
                        const data = trimmedLine.slice(6); // 移除 "data: "
                        
                        // 檢查是否為結束標記
                        if (data === '[DONE]') {
                            console.log('收到 [DONE] 標記');
                            continue;
                        }

                        try {
                            const parsed = JSON.parse(data);
                            console.log('解析 Box Hint SSE 數據:', parsed);
                            
                            // 統一的錯誤檢查:檢查是否有 error 字段
                            if (parsed.error) {
                                const errorCode = parsed.code || 'UNKNOWN';
                                const errorMessage = parsed.error;
                                
                                console.error('收到 API 錯誤:', { code: errorCode, error: errorMessage });
                                
                                // 創建帶有錯誤代碼的錯誤對象
                                const error = new Error(errorMessage);
                                (error as any).code = errorCode;
                                throw error;
                            }
                            
                            // 處理後端的格式: {"content":"文字"}
                            let content = '';
                            if (parsed.content) {
                                content = parsed.content;
                            } 
                            // 兼容舊格式: {"code":200,"body":{"response":"文字"}}
                            else if (parsed.code === 200 && parsed.body?.response) {
                                content = parsed.body.response;
                            } 
                            // 其他錯誤情況
                            else if (parsed.code && parsed.code !== 200) {
                                throw new Error(parsed.message || parsed.error || `API 錯誤: ${parsed.code}`);
                            }
                            
                            if (content) {
                                console.log('收到 Box Hint 內容:', content);
                                fullResponse += content;
                                onChunk?.(content);
                            }
                        } catch (parseError) {
                            console.warn('Box Hint SSE 數據解析錯誤:', parseError, 'Data:', data);
                            // 向上拋出所有錯誤
                            if (parseError instanceof Error) {
                                throw parseError;
                            }
                        }
                    }
                }
            }

            onComplete?.(fullResponse);
            return fullResponse;

        } finally {
            reader.releaseLock();
        }

    } catch (error) {
        const err = error instanceof Error ? error : new Error('未知錯誤');
        onError?.(err);
        throw err;
    }
}

/**
 * 非 Stream 版本的平台指導 AI Chat（備用）
 * @param userInput 用戶輸入
 * @returns Promise<string> AI 回應
 */
export async function callPlatformGuideChat(userInput: string): Promise<string> {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('未找到登入 Token');
    }

    try {
        const response = await fetch(`${AI_CHAT_BASE}/platform/guide-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                user_input: userInput
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.code === 200 && data.body?.response) {
            return data.body.response;
        } else {
            throw new Error(data.message || '未知錯誤');
        }
    } catch (error) {
        throw error instanceof Error ? error : new Error('未知錯誤');
    }
}
