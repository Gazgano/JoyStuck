import { Palette } from '@app/core/models/palette.model';

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
    palette: 'warn',
    icon: 'image'
  }
};
