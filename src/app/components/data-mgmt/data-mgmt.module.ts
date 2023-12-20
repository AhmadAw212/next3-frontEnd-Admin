import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/auth.guard';
import { DataMgmtMainPageComponent } from './data-mgmt-main-page/data-mgmt-main-page.component';
import { DataMgmtRoutingModule } from './data-mgmt-routing.module';
import { ReceptionComponent } from './reception/reception.component';
import { DataMgmtGaugesComponent } from './data-mgmt-main-page/data-mgmt-gauges/data-mgmt-gauges.component';
import { CompanySelectComponent } from '../company-select/company-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NewDataEntryListViewComponent } from './new-data-entry-list-view/new-data-entry-list-view.component';
import { ExpertFollowUpViewComponent } from './expert-follow-up-view/expert-follow-up-view.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClaimLabelReportComponent } from './claim-label-report/claim-label-report.component';
import { DataEntryComponent } from './data-entry/data-entry.component';

@NgModule({
  declarations: [
    ReceptionComponent,
    NewDataEntryListViewComponent,
    ExpertFollowUpViewComponent,
    ClaimLabelReportComponent,
    DataMgmtGaugesComponent,
    DataMgmtMainPageComponent,
    // DataEntryComponent,
  ],
  imports: [
    CommonModule,
    DataMgmtRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
  exports: [],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
})
export class DataMgmtModule {}
