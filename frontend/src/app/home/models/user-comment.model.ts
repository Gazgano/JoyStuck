import { FirebaseUser } from './firebase-user.model';

export type CommentStatus = 'FAILED' | 'SENT' | 'PENDING' | 'DELETING';

export interface UserComment {
    id: string;
    post_id: string;
    author: FirebaseUser;
    timestamp: string;
    content: string;
    likeIds: string[];
    status: CommentStatus;
}
