import * as moment from 'moment';

import { UserComment } from './user-comment.model';

export interface Post {
    id: string;
    timestamp: moment.Moment;
    type: string;
    authorName: string;
    title: string;
    likesCount: number;
    commentsCount: number;
    comments?: UserComment[];
    content?: string;
}
