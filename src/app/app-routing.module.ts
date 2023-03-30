import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './components/add-user/add-user.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { HomeComponent } from './components/home/home.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ProfilesPageComponent } from './components/profiles-page/profiles-page.component';
import { UserProfilesComponent } from './components/user-profiles/user-profiles.component';
import { AuthGuardGuard } from './shared/auth-guard.guard';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: '', component: LoginPageComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'profiles-main',
    component: ProfilesPageComponent,
    canActivate: [AuthGuardGuard],
    children: [
      {
        path: ':description',
        component: ProfilesPageComponent,
        canActivate: [AuthGuardGuard],
      },
    ],
  },
  {
    path: 'Administrator',
    component: AdminPageComponent,
    canActivate: [AuthGuardGuard],
    children: [
      { path: 'addUser', component: AddUserComponent },
      { path: 'editUser', component: EditUserComponent },
    ],
  },
  // {
  //   path: 'Administrator',
  //   component: AdminPageComponent,
  //   canActivate: [AuthGuardGuard],
  //   children: [
  //     { path: 'addUser', component: AddUserComponent },
  //     { path: 'editUser', component: EditUserComponent },
  //   ],
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
