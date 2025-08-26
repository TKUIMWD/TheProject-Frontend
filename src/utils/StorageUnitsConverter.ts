export function GBtoMB(gb: number | undefined) {
    return (gb || 0) * 1024;
}

export function MBtoGB(mb: number | undefined) {
    return (mb || 0) / 1024;
}