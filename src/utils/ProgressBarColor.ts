const progressBarColor: { min: number; max: number; variant: string }[] = [
    { min: 0, max: 59, variant: "success" },
    { min: 60, max: 79, variant: "warning" },
    { min: 80, max: 100, variant: "danger" }
];

export const getProgressBarVariant = (value: number): string => {
        const found = progressBarColor.find((range) => value >= range.min && value <= range.max);
        return found ? found.variant : "success";
};