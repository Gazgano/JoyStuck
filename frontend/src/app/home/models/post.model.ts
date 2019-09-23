export interface Post {
    id: string;
    timestamp: string;
    type: string;
    author: {
      uid: string,
      displayName: string,
      photoURL: string
    };
    title: string;
    likeIds?: string[];
    commentsCount: number;
    content?: string;
}
