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
    status: 'FAILED' | 'SENT' | 'PENDING';
}
