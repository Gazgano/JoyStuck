import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    RouterModule
  ],
  exports: [
    BrowserAnimationsModule,
    BrowserModule,
    RouterModule
  ]
})
export class CoreModule { }
