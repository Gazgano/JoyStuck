import { Timestamp } from '@google-cloud/firestore';

export class UserComment {
  private timestamp: Timestamp
  
  constructor(
    private post_id: string,
    private authorName: string,
    timestamp: string,
    private content: string,
    private likesCount: number
  ) {
    this.timestamp = Timestamp.fromDate(new Date(timestamp));
  }
};