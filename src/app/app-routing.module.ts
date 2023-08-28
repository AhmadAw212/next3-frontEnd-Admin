import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './components/administrator/add-user/add-user.component';
import { AdminPageComponent } from './components/administrator/admin-page.component';
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
import { GaugesComponent } from './components/call-center/gauges/gauges.component';
import { FollowUpComponent } from './components/call-center/follow-up/follow-up.component';
import { SearchNotificationComponent } from './components/call-center//search-notification/search-notification.component';
import { NotificationDetailsComponent } from './components/call-center/notification-details/notification-details.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: '**', redirectTo: 'login', pathMatch: 'full' },
  // { path: '', component: AppComponent },
  {
    path: 'profiles-main',
    loadChildren: () =>
      import('./components/profiles-page/profiles.module').then(
        (m) => m.ProfilesModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'profiles-main/Administrator',
    loadChildren: () =>
      import('./components/administrator/admin.module').then(
        (m) => m.AdminModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'profiles-main/CallCenter',
    loadChildren: () =>
      import('./components/call-center/call-center.module').then(
        (m) => m.CallCenterModule
      ),

    canActivate: [AuthGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('./components/call-center/call-center.module').then(
        (m) => m.CallCenterModule
      ),

    canActivate: [AuthGuard],
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
