import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/auth.guard';
import { AdminPageComponent } from './admin-page.component';
import { AddUserComponent } from './add-user/add-user.component';
import { BranchConfigComponent } from './branch-config/branch-config.component';
import { CarBrokerComponent } from './car-broker/car-broker.component';
import { CarProductsComponent } from './car-products/car-products.component';
import { CarSublinesComponent } from './car-sublines/car-sublines.component';
import { CarsBrandComponent } from './cars-brand/cars-brand.component';
import { CarsCaseMngrSetupComponent } from './cars-case-mngr-setup/cars-case-mngr-setup.component';
import { CarsClientComponent } from './cars-client/cars-client.component';
import { CarsCoverComponent } from './cars-cover/cars-cover.component';
import { CarsExpertDefaultFeesComponent } from './cars-expert-default-fees/cars-expert-default-fees.component';
import { CarsReportListComponent } from './cars-report-list/cars-report-list.component';
import { CarsSupplierComponent } from './cars-supplier/cars-supplier.component';
import { CoreConfigurationComponent } from './core-configuration/core-configuration.component';
import { CoreDocumentComponent } from './core-document/core-document.component';
import { CoreDomainComponent } from './core-domain/core-domain.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ExpertConfigComponent } from './expert-config/expert-config.component';
import { LanguageConfigComponent } from './language-config/language-config.component';
import { TownTerritoryComponent } from './town-territory/town-territory.component';
import { SharedModule } from '../shared/shared.module';
import { EditUserDialogComponent } from './update-dialogs/edit-user-dialog/edit-user-dialog.component';
import { CarApprovalTypeComponent } from './car-approval-type/car-approval-type.component';
import { UserProfilesComponent } from './user-profiles/user-profiles.component';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { AddProfileDialogComponent } from './add-dialogs/add-profile-dialog/add-profile-dialog.component';
import { CopyProfileComponent } from './copy-profile/copy-profile.component';
import { AddConfigDialogComponent } from './add-dialogs/add-config-dialog/add-config-dialog.component';
import { AddLanguageComponent } from './add-dialogs/add-language/add-language.component';
import { AddDocumentDialogComponent } from './add-dialogs/add-document-dialog/add-document-dialog.component';
import { AddDomainDialogComponent } from './add-dialogs/add-domain-dialog/add-domain-dialog.component';
import { ViewPolicyDialogComponent } from '../view-policy/view-policy-dialog/view-policy-dialog.component';
import { ViewPolicyComponent } from '../view-policy/view-policy.component';
import { AddBranchComponent } from './add-dialogs/add-branch/add-branch.component';
import { AddBrokerComponent } from './add-dialogs/add-broker/add-broker.component';
import { AddCarBrandDialogComponent } from './add-dialogs/add-car-brand-dialog/add-car-brand-dialog.component';
import { AddCarClientComponent } from './add-dialogs/add-car-client/add-car-client.component';
import { AddCarCoverComponent } from './add-dialogs/add-car-cover/add-car-cover.component';
import { AddCarInfoComponent } from './add-dialogs/add-car-info/add-car-info.component';
import { AddCarProductComponent } from './add-dialogs/add-car-product/add-car-product.component';
import { AddCarSublineComponent } from './add-dialogs/add-car-subline/add-car-subline.component';
import { AddCarSupplierComponent } from './add-dialogs/add-car-supplier/add-car-supplier.component';
import { AddDomainValueDialogComponent } from './add-dialogs/add-domain-value-dialog/add-domain-value-dialog.component';
import { AddExpertCompanyComponent } from './add-dialogs/add-expert-company/add-expert-company.component';
import { AddExpertComponent } from './add-dialogs/add-expert/add-expert.component';
import { AddReportListComponent } from './add-dialogs/add-report-list/add-report-list.component';
import { AddShapeDialogComponent } from './add-dialogs/add-shape-dialog/add-shape-dialog.component';
import { AddTrademarkDialogComponent } from './add-dialogs/add-trademark-dialog/add-trademark-dialog.component';
import { AddbrandMatchingComponent } from './car-brand-matching/addbrand-matching/addbrand-matching.component';
import { CarBrandMatchingComponent } from './car-brand-matching/car-brand-matching.component';
import { CarInfoComponent } from './car-info/car-info.component';
import { AddProductReserveComponent } from './car-products-reserve/add-product-reserve/add-product-reserve.component';
import { CarProductsReserveComponent } from './car-products-reserve/car-products-reserve.component';
import { AddRiskCoverComponent } from './car-risk-cover/add-risk-cover/add-risk-cover.component';
import { CarRiskCoverComponent } from './car-risk-cover/car-risk-cover.component';
import { CarShapeComponent } from './car-shape/car-shape.component';
import { CarTrademarkComponent } from './car-trademark/car-trademark.component';
import { AddCaseMngrSetupComponent } from './cars-case-mngr-setup/add-case-mngr-setup/add-case-mngr-setup.component';
import { AddCarCellSetupComponent } from './cars-cell-setup/add-car-cell-setup/add-car-cell-setup.component';
import { CarsCellSetupComponent } from './cars-cell-setup/cars-cell-setup.component';
import { AddCellComponent } from './cars-cell/add-cell/add-cell.component';
import { CarsCellComponent } from './cars-cell/cars-cell.component';
import { AddExpertFeesComponent } from './cars-expert-default-fees/add-expert-fees/add-expert-fees.component';
import { CoreDomainValueComponent } from './core-domain-value/core-domain-value.component';
import { ExpertCompanyListComponent } from './expert-config/expert-company-list/expert-company-list.component';
import { ExpertSearchResultsComponent } from './expert-config/expert-search-results/expert-search-results.component';
import { AddNearRegionTerritoryComponent } from './near-region-territory/add-near-region-territory/add-near-region-territory.component';
import { NearRegionTerritoryComponent } from './near-region-territory/near-region-territory.component';
import { UpdateCarSuppFormComponent } from './update-car-supp-form/update-car-supp-form.component';
import { UpdateCarCoverComponent } from './update-dialogs/update-car-cover/update-car-cover.component';
import { UpdateCarDialogComponent } from './update-dialogs/update-car-dialog/update-car-dialog.component';
import { UpdateDocumentComponent } from './update-dialogs/update-document/update-document.component';
import { UpdateShapeDialogComponent } from './update-dialogs/update-shape-dialog/update-shape-dialog.component';
import { UpdateTrademarkDialogComponent } from './update-dialogs/update-trademark-dialog/update-trademark-dialog.component';
import { AddApprovalTypeComponent } from './add-dialogs/add-approval-type/add-approval-type.component';
import { CarsPolicyCarComponent } from './cars-policy-car/cars-policy-car.component';
import { UpdateCompanyListComponent } from './expert-config/update-company-list/update-company-list.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

const routes: Routes = [
  {
    path: 'profiles-main/Administrator',
    component: AdminPageComponent,
    canActivate: [AuthGuard],

    children: [
      {
        path: 'userManagement/addUser',
        component: AddUserComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'userManagement/editUser',
        component: EditUserComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'userManagement/approval',
        component: CarApprovalTypeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'systemConfiguration/coreConfig',
        component: CoreConfigurationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'systemConfiguration/languageConfig',
        component: LanguageConfigComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'systemConfiguration/coreDocument',
        component: CoreDocumentComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'systemConfiguration/coreDomain',
        component: CoreDomainComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tables/carsBrand',
        component: CarsBrandComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tables/carsClient',
        component: CarsClientComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tables/carCovers',
        component: CarsCoverComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tables/carProducts',
        component: CarProductsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tables/carSublines',
        component: CarSublinesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tables/carReportList',
        component: CarsReportListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tables/carSupplier',
        component: CarsSupplierComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tables/expertConfig',
        component: ExpertConfigComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tables/branchConfig',
        component: BranchConfigComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tables/carBroker',
        component: CarBrokerComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tables/carTerritoryTown',
        component: TownTerritoryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tables/carsExpertDefaultFees',
        component: CarsExpertDefaultFeesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tables/carsCaseMngrSetup',
        component: CarsCaseMngrSetupComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  declarations: [
    AdminPageComponent,
    AddUserComponent,
    EditUserComponent,
    EditUserDialogComponent,
    CarApprovalTypeComponent,
    UserProfilesComponent,
    UserRolesComponent,
    CoreConfigurationComponent,
    AddProfileDialogComponent,
    CopyProfileComponent,
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
    UpdateCompanyListComponent,
    AddTrademarkDialogComponent,
    UpdateTrademarkDialogComponent,
    CarShapeComponent,
    AddShapeDialogComponent,
    UpdateShapeDialogComponent,
    CarInfoComponent,
    CarsPolicyCarComponent,
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
    ExpertSearchResultsComponent,
    AddExpertComponent,
    BranchConfigComponent,
    AddBranchComponent,
    ExpertCompanyListComponent,
    AddExpertCompanyComponent,
    CarBrokerComponent,
    AddBrokerComponent,
    NearRegionTerritoryComponent,
    AddNearRegionTerritoryComponent,
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
    TownTerritoryComponent,
    AddApprovalTypeComponent,
    CarsCellSetupComponent,
    AddCarCellSetupComponent,
    AddbrandMatchingComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  exports: [CommonModule, RouterModule],
  providers: [MessageService, ConfirmationService],
})
export class AdminModule {}
