import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { User } from '@app/core/models/user.model';
import { Logger } from '@app/core/services/logger.service';

const log = new Logger('ProfileImageComponent');

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileImageComponent implements OnInit {

  @Input() user: User; // if not provided, fetch current user
  @Input() loadedFileURL: string; // to preview loaded image (or future deleted image if null)

  @Input() inline = false;
  @Input() sizeInPixel = 30;

  public hue: string;

  constructor() { }

  ngOnInit() {
    this.hue = this.getHueFromId(this.user.id);
  }

  get imageUrl(): string {
    if (this.loadedFileURL === null) { // to preview image deletion
      return null;
    } else {
      return this.loadedFileURL || (this.user && this.user.profileImageSrcUrl);
    }
  }

  /* Purpose of this function is to generate a 'random' hue from the user id.

     Characters unicode codes are: 0-9 => 48-57, A-Z => 65-90, a-z => 97-122
     The first character of the user id will be one of them
     We want to select randomly a number among 0, 10, 20, 30... 360 (hue slices)
     thanks to this first id char
  */
  getHueFromId(id: string): string {
    const charCode = id.charCodeAt(0);
    let n: number;
    if (48 <= charCode && charCode <= 57) {
      n = charCode - 48;
    } else if (65 <= charCode && charCode <= 90) {
      const offset = 57 - 48 + 1;
      n = offset + charCode - 65;
    } else if (97 <= charCode && charCode <= 122) {
      const offset = 57 - 48 + 1 + 90 - 65 + 1;
      n = offset + charCode - 97;
    } else {
      throw new Error('Unexpected input id');
    }

    const percent = n / (57 - 48 + 1 + 90 - 65 + 1 + 122 - 97 + 1);
    const hueSlice = Math.trunc(Math.round(percent*360)/10)*10;
    return hueSlice + '';
  }
}
