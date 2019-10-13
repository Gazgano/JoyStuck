import { Component, Input, OnInit } from '@angular/core';

import { User } from '@app/core/models/user.model';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss']
})
export class ProfileImageComponent implements OnInit {

  @Input() user: User;
  @Input() inline = false;
  @Input() sizeInPixel = 30;
  @Input() loadedFileURL: string;

  public hue: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.hue = this.getHueFromId(this.user.id);
  }

  get imageUrl(): string {
    return this.loadedFileURL
      || (this.user && this.user.profileImageSrcUrl)
      || this.authService.getCurrentUser().profileImageSrcUrl;
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
