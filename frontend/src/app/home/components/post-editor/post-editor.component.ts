import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';

import { User } from '@app/core/models/user.model';
import { AuthService } from '@app/core/services/auth.service';
import { PostEditorType, PostEditorDesign, POST_EDITOR_TYPES_DESIGNS } from './post-editor.config';
import { Logger } from '@app/core/services/logger.service';
import { FormService } from '@app/shared/services/form.service';

const log = new Logger('PostEditorComponent');

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss']
})
export class PostEditorComponent implements OnInit {

  @Input() postEditorType: PostEditorType;
  public currentUser: User;
  public form: FormGroup;
  private errorsMessages = {
    title: { required: (fieldName: string) => `${fieldName} is required` },
    message: { required: (fieldName: string) => `${fieldName} is required` }
  };
  
  constructor(
    private authService: AuthService, 
    private formService: FormService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      message: new FormControl(null, Validators.required)
    });
  }

  get design(): PostEditorDesign {
    return POST_EDITOR_TYPES_DESIGNS[this.postEditorType];
  }

  getErrorMessage(path: string | string[], fieldName: string) {
    return this.formService.getErrorMessage(this.form, path, this.errorsMessages, fieldName);
  }

  closeEditor() {
    this.postEditorType = null;
    this.form.reset();
  }

  publish() {
    this.form.markAllAsTouched();
    
    if (this.form.valid) {
      log.debug({
        title: this.form.get('title').value,
        message: this.form.get('message').value
      });
    }
  }
}
