import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './components/administrator/add-user/add-user.component';
import { AdminPageComponent } from './components/administrator/admin-page/admin-page.component';
import { EditUserComponent } from './components/administrator/edit-user/edit-user.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ProfilesPageComponent } from './components/profiles-page/profiles-page.component';
import { AuthGuard } from './shared/auth.guard';
import { CoreConfigurationComponent } from './components/administrator/core-configuration/core-configuration.component';
import { LanguageConfigComponent } from './components/administrator/language-config/language-config.component';
import { CoreDocumentComponent } from './components/administrator/core-document/core-document.component';
import { CoreDomainComponent } from './components/administrator/core-domain/core-domain.component';
import { CarsBrandComponent } from './components/administrator/cars-brand/cars-brand.component';
import { CarsClientComponent } from './components/administrator/cars-client/cars-client.component';
import { CarsCoverComponent } from './components/administrator/cars-cover/cars-cover.component';
import { CarProductsComponent } from './components/administrator/car-products/car-products.component';
import { CarSublinesComponent } from './components/administrator/car-sublines/car-sublines.component';
import { CarsReportListComponent } from './components/administrator/cars-report-list/cars-report-list.component';
import { CarsSupplierComponent } from './components/administrator/cars-supplier/cars-supplier.component';
import { ExpertConfigComponent } from './components/administrator/expert-config/expert-config.component';
import { BranchConfigComponent } from './components/administrator/branch-config/branch-config.component';
import { CarBrokerComponent } from './components/administrator/car-broker/car-broker.component';
import { TownTerritoryComponent } from './components/administrator/town-territory/town-territory.component';
import { DataEntryViewComponent } from './components/data-entry-view/data-entry-view.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { CarsExpertDefaultFeesComponent } from './components/administrator/cars-expert-default-fees/cars-expert-default-fees.component';
import { CarsCaseMngrSetupComponent } from './components/administrator/cars-case-mngr-setup/cars-case-mngr-setup.component';
import { CallCenterComponent } from './components/call-center/call-center.component';
import { SearchPolicyComponent } from './components/search-policy/search-policy.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: '**', redirectTo: 'login', pathMatch: 'full' },
  // { path: '', component: AppComponent },
  {
    path: 'profiles-main',
    component: ProfilesPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profiles-main/Administrator',
    component: AdminPageComponent,
    canActivate: [AuthGuard],
    // data: {
    //   // authorities: ['Admin'],
    // },
    children: [
      {
        path: 'addUser',
        component: AddUserComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'editUser',
        component: EditUserComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'coreConfig',
        component: CoreConfigurationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'languageConfig',
        component: LanguageConfigComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'coreDocument',
        component: CoreDocumentComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'coreDomain',
        component: CoreDomainComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'carsBrand',
        component: CarsBrandComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'carsClient',
        component: CarsClientComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'carCovers',
        component: CarsCoverComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'carProducts',
        component: CarProductsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'carSublines',
        component: CarSublinesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'carReportList',
        component: CarsReportListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'carSupplier',
        component: CarsSupplierComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'expertConfig',
        component: ExpertConfigComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'branchConfig',
        component: BranchConfigComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'carBroker',
        component: CarBrokerComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'carTerritoryTown',
        component: TownTerritoryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'carsExpertDefaultFees',
        component: CarsExpertDefaultFeesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'carsCaseMngrSetup',
        component: CarsCaseMngrSetupComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'profiles-main/CallCenter',
    component: CallCenterComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'searchPolicy',
        component: SearchPolicyComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'dataEntryView',
    component: DataEntryViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sendEmail',
    component: SendEmailComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
