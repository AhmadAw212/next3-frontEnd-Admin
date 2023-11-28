import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPageComponent } from './components/login-page/login-page.component';

import { AuthGuard } from './shared/auth.guard';

import { DataEntryViewComponent } from './components/data-entry-view/data-entry-view.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { NewHotlineComponent } from './components/call-center/new-hotline/new-hotline.component';
import { PhoneIndexComponent } from './components/common-components/phone-index/phone-index.component';

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
    path: 'profiles-main/DataManagement',
    loadChildren: () =>
      import('./components/data-mgmt/data-mgmt.module').then(
        (m) => m.DataMgmtModule
      ),

    canActivate: [AuthGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('./components/data-mgmt/data-mgmt.module').then(
        (m) => m.DataMgmtModule
      ),

    canActivate: [AuthGuard],
  },

  {
    path: 'dataEntryView/:notificationId',
    component: DataEntryViewComponent,
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'phoneIndex',
  //   component: PhoneIndexComponent,
  //   canActivate: [AuthGuard],
  // },
  {
    path: 'sendEmail/:carId',
    component: SendEmailComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
