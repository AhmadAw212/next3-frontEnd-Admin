import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/auth.guard';
import { ProfilesPageComponent } from './profiles-page.component';

const routes: Routes = [
  {
    path: '',
    component: ProfilesPageComponent,
    canActivate: [AuthGuard],
  },
  // other routes...
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [CommonModule, RouterModule],
})
export class ProfilesModule {}
