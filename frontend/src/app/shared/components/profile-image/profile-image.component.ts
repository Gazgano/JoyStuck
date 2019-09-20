import { Component, Input } from '@angular/core';

import { User } from '@app/core/models/user.model';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss']
})
export class ProfileImageComponent {

  @Input() user: User;
  @Input() inline = false;
  @Input() sizeInPixel = 30;

  constructor() { }
}
