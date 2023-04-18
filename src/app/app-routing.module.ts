import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './components/add-user/add-user.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { HomeComponent } from './components/home/home.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ProfilesPageComponent } from './components/profiles-page/profiles-page.component';
import { UserProfilesComponent } from './components/user-profiles/user-profiles.component';
import { AuthGuard } from './shared/auth.guard';
import { CoreConfigurationComponent } from './components/core-configuration/core-configuration.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'profiles-main',
    component: ProfilesPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'Administrator',
    component: AdminPageComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['Admin'],
    },
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
