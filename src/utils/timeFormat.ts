export function minute_to_hour(minute: number): number {
    return Math.round((minute / 60) * 10) / 10; // 四捨五入到小數點第一位
}