import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/auth.guard';
import { DataMgmtMainPageComponent } from './data-mgmt-main-page/data-mgmt-main-page.component';
import { ReceptionComponent } from './reception/reception.component';
import { DataMgmtGaugesComponent } from './data-mgmt-main-page/data-mgmt-gauges/data-mgmt-gauges.component';
import { NewDataEntryListViewComponent } from './new-data-entry-list-view/new-data-entry-list-view.component';
import { ExpertFollowUpViewComponent } from './expert-follow-up-view/expert-follow-up-view.component';
import { ViewNotesComponent } from '../view-notes/view-notes.component';
import { ViewNoteDialogComponent } from '../view-notes/view-note-dialog/view-note-dialog.component';
import { ClaimLabelReportComponent } from './claim-label-report/claim-label-report.component';
import { DataEntryComponent } from './data-entry/data-entry.component';

const routes: Routes = [
  {
    path: 'profiles-main/DataManagement',
    component: DataMgmtMainPageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DataMgmtGaugesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'reception',
        component: ReceptionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'dataEntryList',
        component: NewDataEntryListViewComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'expertFollowUp',
        component: ExpertFollowUpViewComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'notes/:notificationId',
        component: ViewNoteDialogComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'claimLabel',
        component: ClaimLabelReportComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'dataEntry',
        component: DataEntryComponent,
        canActivate: [AuthGuard],
      },
      // {
      //   path: 'dataEntry',
      //   component: ,
      //   canActivate: [AuthGuard],
      // },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [CommonModule, RouterModule],
})
export class DataMgmtRoutingModule {}
