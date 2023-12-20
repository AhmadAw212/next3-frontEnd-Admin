import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {
  CommonModule,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { AuthInterceptorInterceptor } from './shared/auth-interceptor.interceptor';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DatePipe } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BodilyInjuryComponent } from './components/data-entry-view/bodily-injury/bodily-injury.component';
import { DataEntryDetailsComponent } from './components/data-entry-view/data-entry-details/data-entry-details.component';
import { DataEntryViewComponent } from './components/data-entry-view/data-entry-view.component';
import { MaterialDamageComponent } from './components/data-entry-view/material-damage/material-damage.component';

import { MatNativeDateModule } from '@angular/material/core';

import { AppContentComponent } from './app-content/app-content.component';

import { TableComponent } from './components/table/table.component';

import { AuthService } from './services/auth.service';
import { DataServiceService } from './services/data-service.service';
import { UsersRolesService } from './services/users-roles.service';

import { SharedModule } from './components/shared/shared.module';
@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    DataEntryViewComponent,
    DataEntryDetailsComponent,
    BodilyInjuryComponent,
    MaterialDamageComponent,
    AppContentComponent,
    TableComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    SharedModule,
    MatNativeDateModule,
    MatTableModule,
    FontAwesomeModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorInterceptor,
      multi: true,
    },
    DataServiceService,
    AuthService,
    UsersRolesService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
