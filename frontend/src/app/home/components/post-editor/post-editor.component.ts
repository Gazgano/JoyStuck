import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';

import { User } from '@app/core/models/user.model';
import { AuthService } from '@app/core/services/auth.service';
import { PostEditorType, PostEditorDesign, POST_EDITOR_TYPES_DESIGNS } from './post-editor.config';
import { Logger } from '@app/core/services/logger.service';
import { FormService } from '@app/shared/services/form.service';
import { trigger, transition, style, animate } from '@angular/animations';

const log = new Logger('PostEditorComponent');

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss'],
  animations: [trigger('open', [
    transition(':enter', [
      style({height: '0', opacity: '0'}),
      animate('200ms ease-out')
    ])
  ])]
})
export class PostEditorComponent implements OnInit {

  @Input() postEditorType: PostEditorType;
  @Output() close = new EventEmitter<boolean>();

  public currentUser: User;
  public form: FormGroup;
  public formSubmitted = false;
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
    this.close.emit(true);
    this.form.reset();
    this.formSubmitted = false;
  }

  publish() {
    this.form.markAllAsTouched();
    this.formSubmitted = true;
    
    if (this.form.valid) {
      log.debug({
        title: this.form.get('title').value,
        message: this.form.get('message').value
      });
    }

  }
}
