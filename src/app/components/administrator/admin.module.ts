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

const routes: Routes = [
  {
    path: 'profiles-main/Administrator',
    component: AdminPageComponent,
    canActivate: [AuthGuard],
    data: { showBackButton: false },
    children: [
      {
        path: 'addUser',
        component: AddUserComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'editUser',
        component: EditUserComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'coreConfig',
        component: CoreConfigurationComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'languageConfig',
        component: LanguageConfigComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'coreDocument',
        component: CoreDocumentComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'coreDomain',
        component: CoreDomainComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'carsBrand',
        component: CarsBrandComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'carsClient',
        component: CarsClientComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'carCovers',
        component: CarsCoverComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'carProducts',
        component: CarProductsComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'carSublines',
        component: CarSublinesComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'carReportList',
        component: CarsReportListComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'carSupplier',
        component: CarsSupplierComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'expertConfig',
        component: ExpertConfigComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'branchConfig',
        component: BranchConfigComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'carBroker',
        component: CarBrokerComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'carTerritoryTown',
        component: TownTerritoryComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'carsExpertDefaultFees',
        component: CarsExpertDefaultFeesComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'carsCaseMngrSetup',
        component: CarsCaseMngrSetupComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [CommonModule, RouterModule],
})
export class AdminModule {}
