import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/auth.guard';
import { ProfilesPageComponent } from './profiles-page.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: 'profiles-main',
    component: ProfilesPageComponent,
    canActivate: [AuthGuard],
  },
  // other routes...
];

@NgModule({
  declarations: [ProfilesPageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  exports: [CommonModule, RouterModule],
})
export class ProfilesModule {}
