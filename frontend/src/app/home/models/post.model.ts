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
    commentsCount: number;
    likeIds?: string[];
    content?: string;
    imagesURLs?: string[];
}
