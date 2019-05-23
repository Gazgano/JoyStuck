import * as moment from 'moment';

export interface UserComment {
    authorName: string;
    timestamp: moment.Moment;
    content: string;
    likesCount: number;
}
