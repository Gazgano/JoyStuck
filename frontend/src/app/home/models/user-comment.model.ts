export interface UserComment {
    id: string;
    post_id: string;
    authorName: string;
    timestamp: string;
    content: string;
    likesCount: number;
    sentFailed?: boolean;
}
