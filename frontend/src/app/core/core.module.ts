import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    RouterModule
  ],
  exports: [
    BrowserAnimationsModule,
    BrowserModule,
    HeaderComponent,
    RouterModule
  ]
})
export class CoreModule { }
