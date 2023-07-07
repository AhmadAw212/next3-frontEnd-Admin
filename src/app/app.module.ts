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
import { EditUserDialogComponent } from './components/administrator/update-dialogs/edit-user-dialog/edit-user-dialog.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { UserProfilesComponent } from './components/administrator/user-profiles/user-profiles.component';
import { UserRolesComponent } from './components/administrator/user-roles/user-roles.component';
import { AddProfileDialogComponent } from './components/administrator/add-dialogs/add-profile-dialog/add-profile-dialog.component';
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
import { AddConfigDialogComponent } from './components/administrator/add-dialogs/add-config-dialog/add-config-dialog.component';
import { LanguageConfigComponent } from './components/administrator/language-config/language-config.component';
import { AddLanguageComponent } from './components/administrator/add-dialogs/add-language/add-language.component';
import { CoreDocumentComponent } from './components/administrator/core-document/core-document.component';
import { AddDocumentDialogComponent } from './components/administrator/add-dialogs/add-document-dialog/add-document-dialog.component';
import { CoreDomainComponent } from './components/administrator/core-domain/core-domain.component';
import { AddDomainDialogComponent } from './components/administrator/add-dialogs/add-domain-dialog/add-domain-dialog.component';
import { CoreDomainValueComponent } from './components/administrator/core-domain-value/core-domain-value.component';

import { AddDomainValueDialogComponent } from './components/administrator/add-dialogs/add-domain-value-dialog/add-domain-value-dialog.component';

import { CarsBrandComponent } from './components/administrator/cars-brand/cars-brand.component';
import { AddCarBrandDialogComponent } from './components/administrator/add-dialogs/add-car-brand-dialog/add-car-brand-dialog.component';
import { UpdateCarDialogComponent } from './components/administrator/update-dialogs/update-car-dialog/update-car-dialog.component';
import { CarTrademarkComponent } from './components/administrator/car-trademark/car-trademark.component';
import { AddTrademarkDialogComponent } from './components/administrator/add-dialogs/add-trademark-dialog/add-trademark-dialog.component';
import { UpdateTrademarkDialogComponent } from './components/administrator/update-dialogs/update-trademark-dialog/update-trademark-dialog.component';
import { CarShapeComponent } from './components/administrator/car-shape/car-shape.component';
import { AddShapeDialogComponent } from './components/administrator/add-dialogs/add-shape-dialog/add-shape-dialog.component';
import { UpdateShapeDialogComponent } from './components/administrator/update-dialogs/update-shape-dialog/update-shape-dialog.component';
import { CarInfoComponent } from './components/administrator/car-info/car-info.component';
import { CarsClientComponent } from './components/administrator/cars-client/cars-client.component';
import { AddCarInfoComponent } from './components/administrator/add-dialogs/add-car-info/add-car-info.component';
import { CarsCoverComponent } from './components/administrator/cars-cover/cars-cover.component';
import { AddCarCoverComponent } from './components/administrator/add-dialogs/add-car-cover/add-car-cover.component';
import { UpdateCarCoverComponent } from './components/administrator/update-dialogs/update-car-cover/update-car-cover.component';
import { CarProductsComponent } from './components/administrator/car-products/car-products.component';
import { AddCarProductComponent } from './components/administrator/add-dialogs/add-car-product/add-car-product.component';

import { CarSublinesComponent } from './components/administrator/car-sublines/car-sublines.component';
import { AddCarSublineComponent } from './components/administrator/add-dialogs/add-car-subline/add-car-subline.component';
import { AddCarClientComponent } from './components/administrator/add-dialogs/add-car-client/add-car-client.component';
import { CarsReportListComponent } from './components/administrator/cars-report-list/cars-report-list.component';
import { AddReportListComponent } from './components/administrator/add-dialogs/add-report-list/add-report-list.component';
import { CarsSupplierComponent } from './components/administrator/cars-supplier/cars-supplier.component';
import { UpdateCarSuppFormComponent } from './components/administrator/update-car-supp-form/update-car-supp-form.component';
import { AddCarSupplierComponent } from './components/administrator/add-dialogs/add-car-supplier/add-car-supplier.component';
import { ExpertConfigComponent } from './components/administrator/expert-config/expert-config.component';
import { ViewPolicyComponent } from './components/view-policy/view-policy.component';
import { ViewPolicyDialogComponent } from './components/view-policy-dialog/view-policy-dialog.component';
import { ExpertSearchResultsComponent } from './components/administrator/expert-config/expert-search-results/expert-search-results.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddExpertComponent } from './components/administrator/add-dialogs/add-expert/add-expert.component';
import { BranchConfigComponent } from './components/administrator/branch-config/branch-config.component';
import { AddBranchComponent } from './components/administrator/add-dialogs/add-branch/add-branch.component';
import { ExpertCompanyListComponent } from './components/administrator/expert-config/expert-company-list/expert-company-list.component';
import { AddExpertCompanyComponent } from './components/administrator/add-dialogs/add-expert-company/add-expert-company.component';
import { CarBrokerComponent } from './components/administrator/car-broker/car-broker.component';
import { AddBrokerComponent } from './components/administrator/add-dialogs/add-broker/add-broker.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CarApprovalTypeComponent } from './components/administrator/car-approval-type/car-approval-type.component';
import { AddApprovalTypeComponent } from './components/administrator/add-dialogs/add-approval-type/add-approval-type.component';
import { TownTerritoryComponent } from './components/administrator/town-territory/town-territory.component';

import { DataEntryButtonComponent } from './components/data-entry-button/data-entry-button.component';
import { DataEntryViewComponent } from './components/data-entry-view/data-entry-view.component';
import { NearRegionTerritoryComponent } from './components/administrator/near-region-territory/near-region-territory.component';
import { AddNearRegionTerritoryComponent } from './components/administrator/near-region-territory/add-near-region-territory/add-near-region-territory.component';
import { DataEntryDetailsComponent } from './components/data-entry-view/data-entry-details/data-entry-details.component';
import { BodilyInjuryComponent } from './components/data-entry-view/bodily-injury/bodily-injury.component';
import { MaterialDamageComponent } from './components/data-entry-view/material-damage/material-damage.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { SendEmailButtonComponent } from './components/send-email-button/send-email-button.component';
import { NgxEditorModule } from 'ngx-editor';
import { UpdateDocumentComponent } from './components/administrator/update-dialogs/update-document/update-document.component';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
// import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { CarProductsReserveComponent } from './components/administrator/car-products-reserve/car-products-reserve.component';
import { AddProductReserveComponent } from './components/administrator/car-products-reserve/add-product-reserve/add-product-reserve.component';
import { CarBrandMatchingComponent } from './components/administrator/car-brand-matching/car-brand-matching.component';
import { CarRiskCoverComponent } from './components/administrator/car-risk-cover/car-risk-cover.component';
import { AddRiskCoverComponent } from './components/administrator/car-risk-cover/add-risk-cover/add-risk-cover.component';
import { CarsExpertDefaultFeesComponent } from './components/administrator/cars-expert-default-fees/cars-expert-default-fees.component';
import { AddExpertFeesComponent } from './components/administrator/cars-expert-default-fees/add-expert-fees/add-expert-fees.component';
// import { MatTimepickerModule } from 'mat-timepicker';
@NgModule({
  declarations: [
    SpinnerComponent,
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
    UpdateCarCoverComponent,
    CarProductsComponent,
    AddCarProductComponent,
    CarSublinesComponent,
    AddCarSublineComponent,
    AddCarClientComponent,
    CarsReportListComponent,
    AddReportListComponent,
    CarsSupplierComponent,
    UpdateCarSuppFormComponent,
    AddCarSupplierComponent,
    ExpertConfigComponent,
    ViewPolicyComponent,
    ViewPolicyDialogComponent,
    ExpertSearchResultsComponent,
    SpinnerComponent,
    AddExpertComponent,
    BranchConfigComponent,
    AddBranchComponent,
    ExpertCompanyListComponent,
    AddExpertCompanyComponent,
    CarBrokerComponent,
    AddBrokerComponent,
    CarApprovalTypeComponent,
    AddApprovalTypeComponent,
    TownTerritoryComponent,
    DataEntryButtonComponent,
    DataEntryViewComponent,
    NearRegionTerritoryComponent,
    AddNearRegionTerritoryComponent,
    DataEntryDetailsComponent,
    BodilyInjuryComponent,
    MaterialDamageComponent,
    SendEmailComponent,
    SendEmailButtonComponent,
    UpdateDocumentComponent,
    CarProductsReserveComponent,
    AddProductReserveComponent,
    CarBrandMatchingComponent,
    CarRiskCoverComponent,
    AddRiskCoverComponent,
    CarsExpertDefaultFeesComponent,
    AddExpertFeesComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    MatSidenavModule,
    MatDatepickerModule,
    NgxMatNativeDateModule,
    MatInputModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatSelectModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    FormsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTabsModule,
    MatTableModule,
    NgSelectModule,
    NgxPaginationModule,
    MatExpansionModule,
    FontAwesomeModule,
    MatProgressSpinnerModule,
    NgxEditorModule,
  ],
  providers: [
    DatePipe,
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
