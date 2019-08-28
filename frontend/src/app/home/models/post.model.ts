import * as moment from 'moment';

export interface Post {
    id: string;
    timestamp: moment.Moment;
    type: string;
    authorName: string;
    title: string;
    likesCount: number;
    commentsCount: number;
    content?: string;
}
