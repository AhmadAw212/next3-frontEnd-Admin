import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/auth.guard';
import { DataMgmtMainPageComponent } from './data-mgmt-main-page/data-mgmt-main-page.component';

const routes: Routes = [
  {
    path: '',
    component: DataMgmtMainPageComponent,
    canActivate: [AuthGuard],
    // children: [
    //   {
    //     path: '',
    //     component: ,
    //     canActivate: [AuthGuard],
    //   },
    //   {
    //     path: 'searchPolicy',
    //     component: ,
    //     canActivate: [AuthGuard],
    //   },
    //   {
    //     path: 'followUp', // Change the path to 'followUp'
    //     component: ,
    //     canActivate: [AuthGuard],
    //   },
    // ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [CommonModule, RouterModule],
})
export class DataMgmtRoutingModule {}
