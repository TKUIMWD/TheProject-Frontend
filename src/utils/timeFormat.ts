export function minute_to_hour(minute: number): number {
    return Math.round((minute / 60) * 10) / 10; // 四捨五入到小數點第一位
}

const DateTimeFormatter = new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
});

/**
 * 將 ISO 格式的時間字串轉換為本地化的日期時間格式 (YYYY/MM/DD HH:mm)
 * @param isoString - 例如 "2025-07-03T12:47:48.703Z"
 * @returns 格式化後的字串，例如 "2025/07/03 20:47"
 */
export function formatISOString(isoString: string | Date | undefined): string {
    if (!isoString) return "";
    try {
        // 2. 在函式內部從字串建立 Date 物件
        const date = new Date(isoString);
        return DateTimeFormatter.format(date);
    } catch (error) {
        console.error("Invalid date string provided:", isoString, error);
        return "無效日期";
    }
}