import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ShellComponent } from './containers/shell/shell.component';
import { LoaderComponent } from './components/loader/loader.component';
import { UppercaseFirstLetterPipe } from './pipes/uppercase-first-letter.pipe';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { ChecklistItemComponent } from './components/checklist-item/checklist-item.component';
import { ProfileImageComponent } from './components/profile-image/profile-image.component';
import { ImagesPreviewerComponent } from './components/images-previewer/images-previewer.component';
import { FileSizePipe } from './pipes/file-size.pipe';
import { HtmlFormatPipe } from './pipes/html-format.pipe';
import { LikeTextPipe } from './pipes/like-text.pipe';

const externalSharedModules = [
  CommonModule,
  FontAwesomeModule,
  FormsModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule,
  ReactiveFormsModule
];

const internalSharedModules = [
  ChecklistItemComponent,
  FileSizePipe,
  HtmlFormatPipe,
  ImagesPreviewerComponent,
  LikeTextPipe,
  LoaderComponent,
  ProfileFormComponent,
  ProfileImageComponent,
  ShellComponent,
  UppercaseFirstLetterPipe
];


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ...internalSharedModules
  ],
  imports: [
    RouterModule,
    ...externalSharedModules
  ],
  exports: [
    ...internalSharedModules,
    ...externalSharedModules
  ]
})
export class SharedModule { }
