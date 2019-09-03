export interface Post {
    id: string;
    timestamp: string;
    type: string;
    authorName: string;
    title: string;
    likesCount: number;
    commentsCount: number;
    content?: string;
}
