import { Timestamp } from '@google-cloud/firestore';

export class Post {
  private timestamp: Timestamp;

  constructor(
    timestamp: string, 
    private type: string, 
    private authorName: string, 
    private title: string, 
    private likesCount: number, 
    private commentsCount: number, 
    private content?: string
  ) {
    this.timestamp = Timestamp.fromDate(new Date(timestamp));
  }
};
