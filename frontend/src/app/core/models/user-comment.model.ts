import * as moment from 'moment';

export interface UserComment {
    post_id: number;
    authorName: string;
    timestamp: moment.Moment;
    content: string;
    likesCount: number;
}
