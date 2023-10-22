import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddConfigDialogComponent } from './components/administrator/add-dialogs/add-config-dialog/add-config-dialog.component';
import { AddDocumentDialogComponent } from './components/administrator/add-dialogs/add-document-dialog/add-document-dialog.component';
import { AddDomainDialogComponent } from './components/administrator/add-dialogs/add-domain-dialog/add-domain-dialog.component';
import { AddLanguageComponent } from './components/administrator/add-dialogs/add-language/add-language.component';
import { AddProfileDialogComponent } from './components/administrator/add-dialogs/add-profile-dialog/add-profile-dialog.component';
import { AddUserComponent } from './components/administrator/add-user/add-user.component';
import { AdminPageComponent } from './components/administrator/admin-page.component';
import { ChangePassDialogComponent } from './components/administrator/change-pass-dialog/change-pass-dialog.component';
import { CopyProfileComponent } from './components/administrator/copy-profile/copy-profile.component';
import { CoreConfigurationComponent } from './components/administrator/core-configuration/core-configuration.component';
import { CoreDocumentComponent } from './components/administrator/core-document/core-document.component';
import { CoreDomainValueComponent } from './components/administrator/core-domain-value/core-domain-value.component';
import { CoreDomainComponent } from './components/administrator/core-domain/core-domain.component';
import { EditUserComponent } from './components/administrator/edit-user/edit-user.component';
import { LanguageConfigComponent } from './components/administrator/language-config/language-config.component';
import { EditUserDialogComponent } from './components/administrator/update-dialogs/edit-user-dialog/edit-user-dialog.component';
import { UserProfilesComponent } from './components/administrator/user-profiles/user-profiles.component';
import { UserRolesComponent } from './components/administrator/user-roles/user-roles.component';
import { LoginNavComponent } from './components/login-nav/login-nav.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfilesPageComponent } from './components/profiles-page/profiles-page.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { AuthInterceptorInterceptor } from './shared/auth-interceptor.interceptor';

import { AddDomainValueDialogComponent } from './components/administrator/add-dialogs/add-domain-value-dialog/add-domain-value-dialog.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { AddApprovalTypeComponent } from './components/administrator/add-dialogs/add-approval-type/add-approval-type.component';
import { AddBranchComponent } from './components/administrator/add-dialogs/add-branch/add-branch.component';
import { AddBrokerComponent } from './components/administrator/add-dialogs/add-broker/add-broker.component';
import { AddCarBrandDialogComponent } from './components/administrator/add-dialogs/add-car-brand-dialog/add-car-brand-dialog.component';
import { AddCarClientComponent } from './components/administrator/add-dialogs/add-car-client/add-car-client.component';
import { AddCarCoverComponent } from './components/administrator/add-dialogs/add-car-cover/add-car-cover.component';
import { AddCarInfoComponent } from './components/administrator/add-dialogs/add-car-info/add-car-info.component';
import { AddCarProductComponent } from './components/administrator/add-dialogs/add-car-product/add-car-product.component';
import { AddCarSublineComponent } from './components/administrator/add-dialogs/add-car-subline/add-car-subline.component';
import { AddCarSupplierComponent } from './components/administrator/add-dialogs/add-car-supplier/add-car-supplier.component';
import { AddExpertCompanyComponent } from './components/administrator/add-dialogs/add-expert-company/add-expert-company.component';
import { AddExpertComponent } from './components/administrator/add-dialogs/add-expert/add-expert.component';
import { AddReportListComponent } from './components/administrator/add-dialogs/add-report-list/add-report-list.component';
import { AddShapeDialogComponent } from './components/administrator/add-dialogs/add-shape-dialog/add-shape-dialog.component';
import { AddTrademarkDialogComponent } from './components/administrator/add-dialogs/add-trademark-dialog/add-trademark-dialog.component';
import { BranchConfigComponent } from './components/administrator/branch-config/branch-config.component';
import { CarApprovalTypeComponent } from './components/administrator/car-approval-type/car-approval-type.component';
import { CarBrokerComponent } from './components/administrator/car-broker/car-broker.component';
import { CarInfoComponent } from './components/administrator/car-info/car-info.component';
import { CarProductsComponent } from './components/administrator/car-products/car-products.component';
import { CarShapeComponent } from './components/administrator/car-shape/car-shape.component';
import { CarSublinesComponent } from './components/administrator/car-sublines/car-sublines.component';
import { CarTrademarkComponent } from './components/administrator/car-trademark/car-trademark.component';
import { CarsBrandComponent } from './components/administrator/cars-brand/cars-brand.component';
import { CarsClientComponent } from './components/administrator/cars-client/cars-client.component';
import { CarsCoverComponent } from './components/administrator/cars-cover/cars-cover.component';
import { CarsReportListComponent } from './components/administrator/cars-report-list/cars-report-list.component';
import { CarsSupplierComponent } from './components/administrator/cars-supplier/cars-supplier.component';
import { ExpertCompanyListComponent } from './components/administrator/expert-config/expert-company-list/expert-company-list.component';
import { ExpertConfigComponent } from './components/administrator/expert-config/expert-config.component';
import { ExpertSearchResultsComponent } from './components/administrator/expert-config/expert-search-results/expert-search-results.component';
import { TownTerritoryComponent } from './components/administrator/town-territory/town-territory.component';
import { UpdateCarSuppFormComponent } from './components/administrator/update-car-supp-form/update-car-supp-form.component';
import { UpdateCarCoverComponent } from './components/administrator/update-dialogs/update-car-cover/update-car-cover.component';
import { UpdateCarDialogComponent } from './components/administrator/update-dialogs/update-car-dialog/update-car-dialog.component';
import { UpdateShapeDialogComponent } from './components/administrator/update-dialogs/update-shape-dialog/update-shape-dialog.component';
import { UpdateTrademarkDialogComponent } from './components/administrator/update-dialogs/update-trademark-dialog/update-trademark-dialog.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ViewPolicyDialogComponent } from './components/view-policy/view-policy-dialog/view-policy-dialog.component';
import { ViewPolicyComponent } from './components/view-policy/view-policy.component';

import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxEditorModule } from 'ngx-editor';
import { AddNearRegionTerritoryComponent } from './components/administrator/near-region-territory/add-near-region-territory/add-near-region-territory.component';
import { NearRegionTerritoryComponent } from './components/administrator/near-region-territory/near-region-territory.component';
import { UpdateDocumentComponent } from './components/administrator/update-dialogs/update-document/update-document.component';
import { DataEntryButtonComponent } from './components/data-entry-button/data-entry-button.component';
import { BodilyInjuryComponent } from './components/data-entry-view/bodily-injury/bodily-injury.component';
import { DataEntryDetailsComponent } from './components/data-entry-view/data-entry-details/data-entry-details.component';
import { DataEntryViewComponent } from './components/data-entry-view/data-entry-view.component';
import { MaterialDamageComponent } from './components/data-entry-view/material-damage/material-damage.component';
import { SendEmailButtonComponent } from './components/send-email-button/send-email-button.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
// import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { AddbrandMatchingComponent } from './components/administrator/car-brand-matching/addbrand-matching/addbrand-matching.component';
import { CarBrandMatchingComponent } from './components/administrator/car-brand-matching/car-brand-matching.component';
import { AddProductReserveComponent } from './components/administrator/car-products-reserve/add-product-reserve/add-product-reserve.component';
import { CarProductsReserveComponent } from './components/administrator/car-products-reserve/car-products-reserve.component';
import { AddRiskCoverComponent } from './components/administrator/car-risk-cover/add-risk-cover/add-risk-cover.component';
import { CarRiskCoverComponent } from './components/administrator/car-risk-cover/car-risk-cover.component';
import { AddCaseMngrSetupComponent } from './components/administrator/cars-case-mngr-setup/add-case-mngr-setup/add-case-mngr-setup.component';
import { CarsCaseMngrSetupComponent } from './components/administrator/cars-case-mngr-setup/cars-case-mngr-setup.component';
import { AddCarCellSetupComponent } from './components/administrator/cars-cell-setup/add-car-cell-setup/add-car-cell-setup.component';
import { CarsCellSetupComponent } from './components/administrator/cars-cell-setup/cars-cell-setup.component';
import { AddCellComponent } from './components/administrator/cars-cell/add-cell/add-cell.component';
import { CarsCellComponent } from './components/administrator/cars-cell/cars-cell.component';
import { AddExpertFeesComponent } from './components/administrator/cars-expert-default-fees/add-expert-fees/add-expert-fees.component';
import { CarsExpertDefaultFeesComponent } from './components/administrator/cars-expert-default-fees/cars-expert-default-fees.component';
import { CarsPolicyCarComponent } from './components/administrator/cars-policy-car/cars-policy-car.component';
import { ViewNoteDialogComponent } from './components/view-notes/view-note-dialog/view-note-dialog.component';
import { ViewNotesComponent } from './components/view-notes/view-notes.component';
// import { MatTimepickerModule } from 'mat-timepicker';
import { AppContentComponent } from './app-content/app-content.component';
import { CallCenterComponent } from './components/call-center/call-center.component';
import { GaugesComponent } from './components/call-center/gauges/gauges.component';
import { SearchPolicyComponent } from './components/search-policy/search-policy.component';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxGaugeModule } from 'ngx-gauge';
import { UpdateCompanyListComponent } from './components/administrator/expert-config/update-company-list/update-company-list.component';
import { FollowUpComponent } from './components/call-center/follow-up/follow-up.component';
import { SearchNotificationComponent } from './components/call-center/search-notification/search-notification.component';
import { CompanySelectComponent } from './components/company-select/company-select.component';
import { TableComponent } from './components/table/table.component';

import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgChartsModule } from 'ng2-charts';
import { NewHotlineBtnComponent } from './components/call-center/new-hotline-btn/new-hotline-btn.component';
import { AddBodilyInjuryDialogComponent } from './components/call-center/new-hotline/add-bodily-injury-dialog/add-bodily-injury-dialog.component';
import { AppExpertDispatchDialogComponent } from './components/call-center/new-hotline/app-expert-dispatch-dialog/app-expert-dispatch-dialog.component';
import { ChangeToAvailableDataComponent } from './components/call-center/new-hotline/change-to-available-data/change-to-available-data.component';
import { ChooseManuallyComponent } from './components/call-center/new-hotline/choose-manually/choose-manually.component';
import { ClaimsDialogComponent } from './components/call-center/new-hotline/claims-dialog/claims-dialog.component';
import { CreateNoDataDialogComponent } from './components/call-center/new-hotline/create-no-data-dialog/create-no-data-dialog.component';
import { CustomerSatisfactionDialogComponent } from './components/call-center/new-hotline/customer-satisfaction-dialog/customer-satisfaction-dialog.component';
import { ExpertDispatchComponent } from './components/call-center/new-hotline/expert-dispatch/expert-dispatch.component';
import { NewHotlineComponent } from './components/call-center/new-hotline/new-hotline.component';
import { RepairShopDialogComponent } from './components/call-center/new-hotline/repair-shop-dialog/repair-shop-dialog.component';
import { RotationDialogComponent } from './components/call-center/new-hotline/rotation-dialog/rotation-dialog.component';
import { SecondExpertDialogComponent } from './components/call-center/new-hotline/second-expert-dialog/second-expert-dialog.component';
import { TotalLossTowingTableComponent } from './components/call-center/new-hotline/total-loss-towing-table/total-loss-towing-table.component';
import { TowCasesDialogComponent } from './components/call-center/new-hotline/tow-cases-dialog/tow-cases-dialog.component';
import { TowingConditionsHotlineComponent } from './components/call-center/new-hotline/towing-conditions-hotline/towing-conditions-hotline.component';
// import { TowingDispatchTabComponent } from './components/call-center/new-hotline/towing-dispatch-tab/towing-dispatch-tab.component';
import { NotificationDetailsComponent } from './components/call-center/notification-details/notification-details.component';
import { AddTowingCompanyComponent } from './components/call-center/towing-condition/add-towing-company/add-towing-company.component';
import { TowingConditionComponent } from './components/call-center/towing-condition/towing-condition.component';
import { UsersActivityComponent } from './components/call-center/users-activity/users-activity.component';
import { CompaniesDropdownComponent } from './components/companies-dropdown/companies-dropdown.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { ViewComplaintsComponent } from './components/view-complaints/view-complaints.component';
import { NewNotificationRelatedComponent } from './components/new-notification-related/new-notification-related.component';
import { GoogleMapComponent } from './components/call-center/google-map/google-map.component';
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
    CarsCaseMngrSetupComponent,
    AddCaseMngrSetupComponent,
    CarsCellComponent,
    AddCellComponent,
    CarsCellSetupComponent,
    AddCarCellSetupComponent,
    AddbrandMatchingComponent,
    CarsPolicyCarComponent,
    ViewNotesComponent,
    ViewNoteDialogComponent,
    CallCenterComponent,
    SearchPolicyComponent,
    AppContentComponent,
    GaugesComponent,
    FollowUpComponent,
    UpdateCompanyListComponent,
    TableComponent,
    CompanySelectComponent,
    SearchNotificationComponent,
    TowingConditionComponent,
    NotificationDetailsComponent,
    CompaniesDropdownComponent,
    AddTowingCompanyComponent,
    UsersActivityComponent,
    NewHotlineComponent,
    NewHotlineBtnComponent,
    CreateNoDataDialogComponent,
    ChangeToAvailableDataComponent,
    AppExpertDispatchDialogComponent,
    ChooseManuallyComponent,
    AddBodilyInjuryDialogComponent,
    PaginatorComponent,
    SecondExpertDialogComponent,
    CustomerSatisfactionDialogComponent,
    RotationDialogComponent,
    ExpertDispatchComponent,

    TowingConditionsHotlineComponent,
    RepairShopDialogComponent,
    TotalLossTowingTableComponent,
    ClaimsDialogComponent,
    TowCasesDialogComponent,
    ViewComplaintsComponent,
    NewNotificationRelatedComponent,
    GoogleMapComponent,
  ],
  imports: [
    BrowserModule,
    Ng2GoogleChartsModule,
    NgxGaugeModule,
    MatTooltipModule,
    CommonModule,
    MatMenuModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    MatSidenavModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    NgxMatNativeDateModule,
    MatInputModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatIconModule,
    MatSelectModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatSliderModule,
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
    NgChartsModule,
  ],
  providers: [
    // { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },d

    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorInterceptor,
      multi: true,
    },

    // DataServiceService,
  ],
  bootstrap: [AppComponent],

  // entryComponents: [EditUserDialogComponent],
})
export class AppModule {}
