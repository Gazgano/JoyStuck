import { Palette } from '@app/core/models/palette.model';
import { Post } from '@app/home/models/post.model';

export enum PostType {
  Normal = 0,
  Light
}

export interface PostAction {
  action: 'like' | 'unlike' | 'loadComments';
  post: Post;
}

export interface PostDesign {
  readonly componentStyle: PostType;
  readonly palette: Palette;
  readonly icon: string;
}

export const POST_TYPES_DESIGNS: { [key: string]: PostDesign } = {
  gameDiscover: {
    palette: 'warn',
    icon: 'videogame_asset',
    componentStyle: PostType.Normal
  },
  newMember: {
    palette: 'primary',
    icon: 'user',
    componentStyle: PostType.Light
  },
  screenshotShare: {
    palette: 'accent',
    icon: 'image',
    componentStyle: PostType.Normal
  },
  message: {
    palette: 'primary',
    icon: 'forum',
    componentStyle: PostType.Normal
  }
};
