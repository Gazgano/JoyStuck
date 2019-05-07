import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  MatButtonModule, 
  MatFormFieldModule, 
  MatIconModule, 
  MatInputModule, 
  MatMenuModule, 
  MatProgressSpinnerModule ,
  MatToolbarModule
} from '@angular/material';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './shell/footer/footer.component';
import { HeaderComponent } from './shell/header/header.component';
import { ShellComponent } from './shell/shell.component';


@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    ShellComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    ShellComponent
  ]
})
export class SharedModule { }
