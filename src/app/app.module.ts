import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './components/home/home.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { EditUserDialogComponent } from './components/edit-user-dialog/edit-user-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { UserProfilesComponent } from './components/user-profiles/user-profiles.component';
import { UserRolesComponent } from './components/user-roles/user-roles.component';
import { AddProfileDialogComponent } from './components/add-profile-dialog/add-profile-dialog.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CopyProfileComponent } from './components/copy-profile/copy-profile.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { ProfilesPageComponent } from './components/profiles-page/profiles-page.component';
import { AuthInterceptorInterceptor } from './shared/auth-interceptor.interceptor';
import { DataServiceService } from './services/data-service.service';
import { LoginNavComponent } from './components/login-nav/login-nav.component';
import { ChangePassDialogComponent } from './components/change-pass-dialog/change-pass-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CoreConfigurationComponent } from './components/core-configuration/core-configuration.component';
import { AddConfigDialogComponent } from './components/add-config-dialog/add-config-dialog.component';
import { LanguageConfigComponent } from './components/language-config/language-config.component';
import { AddLanguageComponent } from './components/add-language/add-language.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SideMenuComponent,
    HomeComponent,
    AddUserComponent,
    EditUserComponent,
    EditUserDialogComponent,
    UserProfilesComponent,
    UserRolesComponent,
    AddProfileDialogComponent,
    CopyProfileComponent,
    LoginPageComponent,
    AdminPageComponent,
    ProfilesPageComponent,
    LoginNavComponent,
    ChangePassDialogComponent,
    CoreConfigurationComponent,
    AddConfigDialogComponent,
    LanguageConfigComponent,
    AddLanguageComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatSelectModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTableModule,
    NgSelectModule,
    NgxPaginationModule,
    MatExpansionModule,
    FontAwesomeModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorInterceptor,
      multi: true,
    },
    DataServiceService,
  ],
  bootstrap: [AppComponent],

  entryComponents: [EditUserDialogComponent],
})
export class AppModule {}
