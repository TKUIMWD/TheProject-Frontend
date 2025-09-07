export interface Reviews {
    _id: string;
    rating_score: number;
    comment: string;
    submitted_date: Date;
    reviewer_info: {
        username: string;
        avatar_path: string;
    };
}