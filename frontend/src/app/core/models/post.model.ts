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

export interface PostTypeDesign {
    readonly color: string;
    readonly component: string;
    readonly icon: string;
}
  
export const POST_TYPE_DESIGNS: { [key: string]: PostTypeDesign } = {
    gameDiscover: {
        color: 'warn',
        component: 'post',
        icon: 'videogame_asset',
    },
    newMember: {
        color: 'reverse-primary',
        component: 'post-light',
        icon: 'user'
    },
    screenshotShare: {
        color: 'accent',
        component: 'post',
        icon: 'image'
    }
};
