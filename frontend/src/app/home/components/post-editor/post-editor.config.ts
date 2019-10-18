import { Palette } from '@app/core/models/palette.model';
import { Post } from '@app/home/models/post.model';

export interface PostEditorAction {
  action: 'sendPost' | 'closeEditor';
  post?: Post;
}

export type PostEditorType = 'screenshotShare' | 'message' | null;

export interface PostEditorDesign {
  readonly palette: Palette;
  readonly icon: string;
}

export const POST_EDITOR_TYPES_DESIGNS: { [key in PostEditorType]: PostEditorDesign } = {
  message: {
    palette: 'primary',
    icon: 'edit'
  },
  screenshotShare: {
    palette: 'accent',
    icon: 'image'
  }
};
