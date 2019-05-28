import * as moment from 'moment';

import { UserComment } from './user-comment.model';

export interface Post {
    id: number;
    timestamp: moment.Moment;
    type: string;
    authorName: string;
    title: string;
    likesCount: number;
    comments?: UserComment[];
    content?: string;
}
