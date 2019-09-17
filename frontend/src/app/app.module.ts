import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from '@app/core/core.module';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SharedModule } from '@app/shared/shared.module';
import { HttpErrorInterceptor } from '@app/core/interceptors/http-error.interceptor';
import { FormService } from './shared/services/form.service';
import { SignupDialogComponent } from './components/signup-dialog/signup-dialog.component';
import { ForgottenPwdDialogComponent } from './components/forgotten-pwd-dialog/forgotten-pwd-dialog.component';
import { WINDOW_PROVIDERS } from './core/providers/window.provider';

@ NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    SignupDialogComponent,
    ForgottenPwdDialogComponent
  ],
  imports: [
    AppRoutingModule,
    CoreModule,
    SharedModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true
  },
  FormService,
  WINDOW_PROVIDERS
],
  bootstrap: [AppComponent],
  entryComponents: [SignupDialogComponent, ForgottenPwdDialogComponent]
})
export class AppModule { }
