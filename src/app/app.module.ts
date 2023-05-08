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
import { AddUserComponent } from './components/administrator/add-user/add-user.component';
import { EditUserComponent } from './components/administrator/edit-user/edit-user.component';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { EditUserDialogComponent } from './components/administrator/edit-user-dialog/edit-user-dialog.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { UserProfilesComponent } from './components/administrator/user-profiles/user-profiles.component';
import { UserRolesComponent } from './components/administrator/user-roles/user-roles.component';
import { AddProfileDialogComponent } from './components/administrator/add-profile-dialog/add-profile-dialog.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CopyProfileComponent } from './components/administrator/copy-profile/copy-profile.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { AdminPageComponent } from './components/administrator/admin-page/admin-page.component';
import { ProfilesPageComponent } from './components/profiles-page/profiles-page.component';
import { AuthInterceptorInterceptor } from './shared/auth-interceptor.interceptor';
import { DataServiceService } from './services/data-service.service';
import { LoginNavComponent } from './components/login-nav/login-nav.component';
import { ChangePassDialogComponent } from './components/administrator/change-pass-dialog/change-pass-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CoreConfigurationComponent } from './components/administrator/core-configuration/core-configuration.component';
import { AddConfigDialogComponent } from './components/administrator/add-config-dialog/add-config-dialog.component';
import { LanguageConfigComponent } from './components/administrator/language-config/language-config.component';
import { AddLanguageComponent } from './components/administrator/add-language/add-language.component';
import { CoreDocumentComponent } from './components/administrator/core-document/core-document.component';
import { AddDocumentDialogComponent } from './components/administrator/add-document-dialog/add-document-dialog.component';
import { CoreDomainComponent } from './components/administrator/core-domain/core-domain.component';
import { AddDomainDialogComponent } from './components/administrator/add-domain-dialog/add-domain-dialog.component';
import { CoreDomainValueComponent } from './components/administrator/core-domain-value/core-domain-value.component';

import { AddDomainValueDialogComponent } from './components/administrator/add-domain-value-dialog/add-domain-value-dialog.component';

import { CarsBrandComponent } from './components/administrator/cars-brand/cars-brand.component';
import { AddCarBrandDialogComponent } from './components/administrator/add-car-brand-dialog/add-car-brand-dialog.component';
import { UpdateCarDialogComponent } from './components/administrator/update-car-dialog/update-car-dialog.component';
import { CarTrademarkComponent } from './components/administrator/car-trademark/car-trademark.component';
import { AddTrademarkDialogComponent } from './components/administrator/add-trademark-dialog/add-trademark-dialog.component';
import { UpdateTrademarkDialogComponent } from './components/administrator/update-trademark-dialog/update-trademark-dialog.component';
import { CarShapeComponent } from './components/administrator/car-shape/car-shape.component';
import { AddShapeDialogComponent } from './components/administrator/add-shape-dialog/add-shape-dialog.component';
import { UpdateShapeDialogComponent } from './components/administrator/update-shape-dialog/update-shape-dialog.component';
import { CarInfoComponent } from './components/administrator/car-info/car-info.component';
import { CarsClientComponent } from './components/administrator/cars-client/cars-client.component';
import { AddCarInfoComponent } from './components/administrator/add-car-info/add-car-info.component';
import { CarsCoverComponent } from './components/administrator/cars-cover/cars-cover.component';
import { AddCarCoverComponent } from './components/administrator/add-car-cover/add-car-cover.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SideMenuComponent,
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
    CoreDocumentComponent,
    AddDocumentDialogComponent,
    CoreDomainComponent,
    AddDomainDialogComponent,
    CoreDomainValueComponent,
    AddDomainValueDialogComponent,
    CarsBrandComponent,
    AddCarBrandDialogComponent,
    UpdateCarDialogComponent,
    CarTrademarkComponent,
    AddTrademarkDialogComponent,
    UpdateTrademarkDialogComponent,
    CarShapeComponent,
    AddShapeDialogComponent,
    UpdateShapeDialogComponent,
    CarInfoComponent,
    CarsClientComponent,
    AddCarInfoComponent,
    CarsCoverComponent,
    AddCarCoverComponent,
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
