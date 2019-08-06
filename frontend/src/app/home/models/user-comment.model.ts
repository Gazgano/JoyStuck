import * as moment from 'moment';

export interface UserComment {
    id: number;
    post_id: number;
    authorName: string;
    timestamp: moment.Moment;
    content: string;
    likesCount: number;
}
