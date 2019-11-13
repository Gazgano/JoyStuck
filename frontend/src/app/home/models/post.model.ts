import { FirebaseUser } from './firebase-user.model';

export interface Post {
    id: string;
    timestamp: string;
    type: string;
    author: FirebaseUser;
    title: string;
    commentsCount: number;
    likes?: FirebaseUser[];
    content?: string;
    imagesStorageURLs?: string[];
}
