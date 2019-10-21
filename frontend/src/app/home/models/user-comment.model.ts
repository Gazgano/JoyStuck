export type CommentStatus = 'FAILED' | 'SENT' | 'PENDING' | 'DELETING';

export interface UserComment {
    id: string;
    post_id: string;
    author: {
      uid: string,
      displayName: string,
      photoURL: string
    };
    timestamp: string;
    content: string;
    likeIds: string[];
    status: CommentStatus;
}
