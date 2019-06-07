import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { environment } from 'src/environments/environment';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from '@app/core/services/in-memory-data.service';

@NgModule({
  declarations: [],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    environment.production ? [] : HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false, delay: 500 }
    ),
    RouterModule
  ]
})
export class CoreModule { }
