import * as moment from 'moment';

export interface UserComment {
    id: string;
    post_id: string;
    authorName: string;
    timestamp: moment.Moment;
    content: string;
    likesCount: number;
}
