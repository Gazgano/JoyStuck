import { Component, OnInit } from '@angular/core';

import { Logger } from '@app/core/services/logger.service';

const log = new Logger('SignupDialogComponent');

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss']
})
export class SignupDialogComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onFormSubmit(formData: any) {
  }
}
